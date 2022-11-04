import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { setStatusBarTranslucent } from 'expo-status-bar';
import React, { useCallback, useContext, useEffect, useState } from 'react';
import { View, TextInput, StyleSheet, Pressable } from 'react-native';
import { Context } from '../../App';
import { Color, FontSize, Radius, Style } from '../../style';
import _Option from './option';
import Text from './text';
import _Text from './text';

const _Dropdown = (props: any, {navigation}:any) => {
    const [focus,setFocus] = useState(false);
    const [height,setHeight] = useState(0);
    const [zIndex,setZIndex] = useState({});
    const [options,setOptions] = useState([]);
    const [init,setInit] = useState(false);
    const [value,setValue] = useState('');
    const [key,setKey] = useState(''); // JA todo: use the key to send back to server
    const [textValue,setTextValue] = useState('');
    const [visibleOptionCount,setVisibleOptionCount] = useState(0);
    const inputRef = React.useRef<React.ElementRef<typeof TextInput> | null>(null);
    /*Props:
    JA TODO Will be explained later
    */

    const context = useContext(Context);
    const onFocus = useCallback((value: any) => {
        context.setParentFocus(value);
      }, [props.value, context.setParentFocus]);

    useEffect(() => {
        if (!init) {
            mappedItems(props.value);
            setInit(true);
            setValue(props.value);
            setKey(props.key);
            if (props.value)
                setTextValue(props.value);
        }
    }, [options]);

    const labelStyle = () => {
        var style = [];
        if (!props.labelStyle)
            style.push(Style.labelDefault)
        else
            style.push(props.labelStyle);
        if (props.error == true)
            style.push(styles.error);

        return style;
    }

    const style = () => {
        if (!props.style) {
            return Style.dropdownDefault;
        }
        else {
            return [Style.dropdownDefault, props.style];
        }
    }

    const errorMessage = () => {
        if (props.error == true) {
            if (!props.errorMessage) {
            return "is required"
            }
            else {
            return props.errorMessage;
            }
        }
    }

    const onPress = () => {
        setMenu(!focus, true);
    }

    const swapIndex = (focus: boolean) => {
        var zIndex = {
            zIndex: focus ? 1 : 0,
            elevation: focus ? 1 :0
        }
        setZIndex(zIndex)
    }

    const setMenu = (focus: boolean, fromBtn = false) => {
        if (focus) {
            if (fromBtn)
                inputRef.current?.focus();
            else
                mappedItems(textValue);
        }

        swapIndex(focus);
        setFocus(focus);
        onFocus(focus);
    }

    const setNavLayout = (e: any) => {
        setHeight(e.nativeEvent.layout.height);
    }

    const menuStyle = () => {
        return {
            top: height
        }
    }

    const filteredItems = (value: string) => {
        if (props.options) {
            if (!value)
                value = '';

            var cnt = 0;
            var items = props.options.filter((x: any) => {
                if (x && x.value && x.value.trim().toLowerCase().includes(value.trim().toLowerCase()) || !value) {
                    if (cnt % 2 != 0)
                        x.background = Color.holder;
                    else
                        x.background = Color.white;

                    x.display = "block";
                    cnt++;
                }
                else {
                    x.display = "none";
                }

                return x;
            })
            setVisibleOptionCount(cnt);
            return items;
        }
        return [];
    }

    const select = (e: any) => {
        setKey(e.key);
        setValue(e.value);
        setTextValue(e.value);
        setMenu(false);
    }

    const mappedItems = (value: string) => {
        var items = filteredItems(value).map((item: any, key: any) => {
            return <_Option onPress={(e: any) => select(e)} key={key} item={item} />
        });
        setOptions(items);
    }

    const onValueChange = (e: string) => {
        setTextValue(e);
        mappedItems(e);
        if (!focus)
            setMenu(true);
    }

    const onblur = (e: any) => {
        if (value && textValue)
            setTextValue(value);
        else {
            setTextValue("");
            setKey("");
            setValue("");
        }

        setTimeout(() => {
            setMenu(false, false);
        }, 150);
    }

    const onfocus = (e: any) => {
        if (!focus) {
            setMenu(true);
        }
    }

    return (
    <View
    style={[styles.container, zIndex, props.containerStyle, context.groupStyle]}
    onLayout={(e: any) => setNavLayout(e)}
    >
        <View
        style={styles.content}
        >
        <View
        style={styles.text}
        >
            <Text
            style={labelStyle()}
            >
            {props.label}
                </Text>
                {props.error ?
                <Text
                style={labelStyle()}
                >
                {errorMessage()}
                </Text>
                : null
                }
                {props.required ?
                <Text
                style={labelStyle()}>
                    *
                </Text>
            : null
            }
            </View>
            <TextInput
            style={style()}
            onChangeText={(e) => onValueChange(e)}
            value={textValue}
            placeholder={props.placeholder}
            keyboardType={props.keyboardType}
            ref={inputRef}
            onBlur={(e: any) => onblur(e)}
            onFocus={(e: any) => onfocus(e)}
            ></TextInput>
            <Pressable
            style={styles.iconContainer}
            onPress={() => onPress()}
            >
                <FontAwesomeIcon style={styles.icon} icon="caret-down" />
            </Pressable>
        </View>
        {focus ?
        <View
            style={[styles.menu, menuStyle()]}
            >
            {visibleOptionCount === 0 ?
            <_Text
            style={styles.noResults}
            >No results</_Text>
            : null}
            {options}
        </View>
        : null}
    </View>
    );
};

const styles = StyleSheet.create({
    noResults: {
        textAlign: 'center',
        padding: 10,
        fontSize: FontSize.default,
        fontFamily: 'Inter-Regular',
        width: '100%',
        color: Color.textTertiary
    },
    menu: {
        backgroundColor: Color.white,
        borderColor: Color.border,
        borderWidth: 1,
        width: '100%',
        maxHeight: 300,
        borderRadius: Radius.default,
        overflowY: 'auto',
        overflowX: 'hidden',
        position: 'absolute',
    },
    text: {
        display: 'flex',
        flexDirection: 'row',
        gap: 5
    },
    error: {
      color: Color.danger,
      fontFamily: 'Inter-Bold'
    },
    icon: {
        height: 16,
        width: 16,
        color: Color.icon,
        outlineStyle: 'none',
        marginRight: 2,
    },
    iconContainer: {
        bottom: 0,
        right: 0,
        position: 'absolute',
        height: 35,
        display: 'flex',
        justifyContent: 'center',
        width: 25,
        alignItems: 'center',
    },
    content: {
        position: 'relative'
    },
    container: {
        width: '100%'
    }
  });
  

export default _Dropdown;