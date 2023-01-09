import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { setStatusBarTranslucent } from 'expo-status-bar';
import React, { useCallback, useContext, useEffect, useRef, useState } from 'react';
import { View, TextInput, StyleSheet, Pressable, PanResponder, GestureResponderEvent, Platform, Alert, NativeSyntheticEvent, TextInputFocusEventData, Modal, ScrollView } from 'react-native';
import { Context, isMobile } from '../../helper';
import { Color, FontSize, Radius, Style } from '../../style';
import _Button from './button';
import _Group from './group';
import _DropdownOption from './dropdown-option';
import Text from './text';
import _Text from './text';

const _Dropdown = (props: any, {navigation}:any) => {
        /*
    Props: JA TODO 
    */
    const [focus,setFocus] = useState(false);
    const [height,setHeight] = useState(0);
    const [options,setOptions] = useState([]);
    const [init,setInit] = useState(false);
    const [value,setValue] = useState('');
    const [key,setKey] = useState(''); // JA todo: use the key to send back to server
    const [textValue,setTextValue] = useState('');
    const [visibleOptionCount,setVisibleOptionCount] = useState(0);
    const inputRef = React.useRef<React.ElementRef<typeof TextInput> | null>(null);
    // JA todo dropdowns need to calculate if they are going to run off the page and open upwards instead
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
        else if (!focus && textValue && props.options.filter((x: { value: string; }) => x.value === textValue).length == 0) {
            clearSelected(false);
        }
    }, [options, props.options]);

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

    const containerStyle = () => {
        var style = [];        
        style.push(styles.container);
        if (focus)
            style.push(styles.containerFocus);
        if (context.isGroup) {
            if (isMobile())
                style.push(Style.verticalGroup);
            else
                style.push(Style.horizontalGroup);
        }

        if (context.isGroup) {
            var container = {
                ...Platform.select({
                    web: {
                        flex: 1,
                    }
                }),
            }
            style.push(container);
        }
        
        style.push(props.containerStyle);
        return style;
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
        if (props.selected)
            props.selected(key);
    }

    const setMenu = (focus: boolean, fromBtn = false) => {
        if (focus) {
            if (fromBtn)
                inputRef.current?.focus();
            else
                mappedItems(textValue);
        }

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
        setMenu(false)
        if (props.selected)
            props.selected(e.key);
    }

    const clearSelected = (reload = true) => {
        setKey('');
        setValue('');
        setTextValue('');
        if (reload)
            mappedItems(''); // Try mapping again (old value doesn't exist in list anymore)
    }

    const mappedItems = (value: string) => {
        var fItems = filteredItems(value);
        if (!focus && value && fItems.filter((x: { value: string; }) => x.value === value).length == 0) {
            clearSelected();
        }
        else {
            var items = fItems.map((item: any, key: any) => {
                return <_DropdownOption
                onPress={(e: any) => select(e)}
                key={key}
                item={item} />
            });
            setOptions(items);
        }
    }

    const onValueChange = (e: string) => {
        setTextValue(e);
        mappedItems(e);
        if (!focus)
            setMenu(true);
        if (props.onChangeText)
            props.onChangeText(e);
    }

    const onblur = (e: any) => {
        if (Platform.OS === 'web') {
            if (!e.relatedTarget ||
                e.relatedTarget && !e.relatedTarget.parentElement ||
                e.relatedTarget && e.relatedTarget.parentElement && 
                e.relatedTarget.parentElement.id != "menu") {
                if (value && textValue)
                    setTextValue(value);
                else {
                    setTextValue("");
                    setKey("");
                    setValue("");
                }
                setMenu(false);
            }
        }
    }

    const onfocus = (e: any) => {
        if (!focus) {
            setMenu(true);
        }
    }

    const onKeyPress = (e: any) => {
        if ((e.keyCode === 13 || e.keyCode === 9) && focus) {
            // JA: Todo conveniently select top option when enter or tab is pressed on keyboard
        }
    }

    const input = () => {
        return <TextInput
        style={style()}
        onChangeText={(e) => onValueChange(e)}
        value={textValue}
        placeholder={props.placeholder}
        keyboardType={props.keyboardType}
        ref={inputRef}
        onFocus={(e: any) => onfocus(e)}
        onBlur={(e: any) => onblur(e)}
        onKeyPress={(e: any) => onKeyPress(e)}
        ></TextInput>

    }

    return (
    <View
    style={containerStyle()}
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
                {input()}
                <Pressable
                style={styles.iconContainer}
                onPress={() => onPress()}
                >
                <FontAwesomeIcon
                style={styles.icon}
                icon="caret-down" />
            </Pressable>
        </View>
        {focus ?
        <View
        style={styles.menuContainer}
        >
            {Platform.OS === 'web' ?
            <View
                style={[styles.menu, menuStyle()]}
                nativeID="menu"
                >
                {visibleOptionCount === 0 ?
                <_Text
                style={styles.noResults}
                >No results</_Text>
                : null}
                {options}
            </View>
            :
            <Modal
            animationType='fade'
            transparent={true}
            onRequestClose={() => setFocus(false)}
            >
                <View
                style={styles.modalMenuContainer}
                >
                    {input()}
                    <ScrollView
                        style={[styles.modalMenu]}
                        >
                        {visibleOptionCount === 0 ?
                        <_Text
                        style={styles.noResults}
                        >No results</_Text>
                        : null}
                        {options}
                    </ScrollView>
                    <_Button
                    onPress={(e: any) => setFocus(false)}
                    style={[Style.buttonDanger, styles.closeModalButton]}
                    >
                        Close
                    </_Button>
                </View>
            </Modal>
            }
        </View>
        : null}

    </View>
    );
};

const styles = StyleSheet.create({
    closeModalButton: {
        marginTop: 10,
    },
    menuContainer: {
        ...Platform.select({
            web: {
                position: 'absolute',
                width: '100%'
            }
        })
    },
    menuVoid: {
        backgroundColor: Color.black,
        height: '100%',
        width: '100%'
    },
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
        shadowColor: Color.black,
        shadowOffset: {width: -4, height: 4},
        shadowOpacity: .15,
        shadowRadius: 15,
    },
    modalMenuContainer: {
        height: '100%',
        width: '100%',
        backgroundColor: Color.blackMask,
        padding: 20
    },
    modalMenu: {
        backgroundColor: Color.white,
        borderColor: Color.border,
        borderWidth: 1,
        marginTop: 10
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
    },
    containerFocus: {
        zIndex: 1,
        elevation: 1
    },
  });
  

export default _Dropdown;