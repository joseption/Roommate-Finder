import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import React, { useCallback, useContext, useEffect, useState } from 'react';
import { View, TextInput, StyleSheet, Pressable, Platform, ScrollView, Modal, Text, Keyboard, TouchableHighlight } from 'react-native';
import { Context, isMobile } from '../../helper';
import { Color, FontSize, Radius, Style } from '../../style';
import _Button from './button';
import _Group from './group';
import _DropdownOption from './dropdown-option';
import _Text from './text';

const _Dropdown = (props: any, {navigation}:any) => {
        /*
    Props: JA TODO 
    */
    const [initModal,setInitModal] = useState(false);
    const [focus,setFocus] = useState(false);
    const [height,setHeight] = useState(0);
    const [options,setOptions] = useState([]);
    const [init,setInit] = useState(false);
    const [blurring,setBlurring] = useState(false);
    const [dataInit,setDataInit] = useState(false);
    const [key,setKey] = useState('');
    const [textValue,setTextValue] = useState('');
    const [visibleOptionCount,setVisibleOptionCount] = useState(0);
    const inputRef = React.useRef<React.ElementRef<typeof TextInput> | null>(null);
    const context = useContext(Context);
    const onFocus = useCallback((value: any) => {
        if (context.setParentFocus)
            context.setParentFocus(value);
      }, [props.value, context.setParentFocus]);

    useEffect(() => {
        if (!props.value) {
            setKey('');
            setTextValue('');
        }
    }, [props.value]);

    useEffect(() => {

        if (props.value && !props.key && !dataInit && props.options) {
            let l_options = options;
            if (l_options.length == 0)
                l_options = mappedItems(props.value);
            if (l_options && l_options.length > 0) {
                l_options.forEach(x => {
                    if (x && x['props']) {
                        let prop = x['props'];
                        if (prop['item']) {
                            let item = prop['item'];
                            if (props.value === item['value']) {
                                setDataInit(true);
                                select(item);
                                return;
                            }
                        }
                    }
                });
            }
        }
        if (!init) {
            mappedItems(props.value);
            setInit(true);
            setKey(props.key);
            if (props.value)
                setTextValue(props.value);
        }
        else if (!focus && textValue && props.options.filter((x: { value: string; }) => x.value === textValue).length == 0) {
            clearSelected(false);
        }
    }, [options, props.options, props.value, focus]);

    const labelStyle = () => {
        var style = [];
        if (!props.labelStyle)
            style.push(Style(props.isDarkMode).labelDefault)
        else
            style.push(props.labelStyle);
        if (props.error == true)
            style.push(styles.error);
        return style;
    }

    const style = () => {
        if (!props.style) {
            return Style(props.isDarkMode).dropdownDefault;
        }
        else {
            return [Style(props.isDarkMode).dropdownDefault, props.style];
        }
    }

    const containerStyle = () => {
        var style = [];        
        style.push(styles.container);
        if (focus)
            style.push(styles.containerFocus);
        if (context.isGroup) {
            if (isMobile())
                style.push(Style(props.isDarkMode).verticalGroup);
            else
                style.push(Style(props.isDarkMode).horizontalGroup);
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
                return " is required"
            }
            else {
                return props.errorMessage;
            }
        }
    }

    const onPress = () => {
        if (blurring) {
            setBlurring(false);
            return;
        }
        else {
            setMenu(!focus, true);
            if (props.selected)
                props.selected(key);
        }
    }

    const setMenu = (isFocus: boolean, fromBtn = false) => {
        if (isFocus) {
            if (fromBtn) {        
                if (props.innerRef) 
                    props.innerRef.current?.focus();
                else
                    inputRef.current?.focus();
            }
            else
                mappedItems(textValue);
        }
        else {
            if (props.innerRef)
                props.innerRef.current?.blur();
            else
                inputRef.current?.blur();
        }
        onFocus(isFocus);
        setFocus(isFocus);

        // JA hacky mobile fix for modal not initially showing
        if (isFocus && !initModal && Platform.OS !== 'web') {
            setInitModal(true);
            setTimeout(() => {
                setFocus(!isFocus);
                setTimeout(() => {
                    setFocus(isFocus);
                }, 0);
            }, 0);
        }
    }

    const setNavLayout = (e: any) => {
        setHeight(e.nativeEvent.layout.height);
    }

    const menuStyle = () => {
        if (props.direction == "top") {
            return {
                bottom: -25
            }
        }
        else {
            return {
                top: height
            }
        }
    }

    const filteredItems = (value: string, isModal: boolean = false) => {
        if (props.options) {
            if (!value)
                value = '';
                
            var cnt = 0;
            var items = props.options.filter((x: any) => {
                // Added !focus so that all options show when the menu is opened after being closed to show all options
                if (!value || !focus || isModal || (x && x.value && x.value && x.value.trim().toLowerCase().includes(value.toString().trim().toLowerCase()))) {
                    if (cnt % 2 != 0)
                        x.background = Color(props.isDarkMode).dropdownOption;
                    else
                        x.background = Color(props.isDarkMode).dropdownOptionAlt;

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
        props.setValue(e.value);
        setTextValue(e.value);
        setMenu(false)
        if (props.selected)
            props.selected(e.key);
    }

    const clearSelected = (reload = true) => {
        setKey('');
        props.setValue('');
        setTextValue('');
        if (reload)
            mappedItems(''); // Try mapping again (old value doesn't exist in list anymore)
    }

    const mappedItems = (value: string, isModal: boolean = false) => {
        if (isModal) {
            // Remove focus from input behind on mobile
            Keyboard.dismiss();
        }
        var fItems = filteredItems(value, isModal);
        if (!focus && value && fItems.filter((x: { value: string; }) => x.value === value).length == 0) {
            clearSelected();
        }
        else {
            var items = fItems.map((item: any, key: any) => {
                return <_DropdownOption
                isDarkMode={props.isDarkMode}
                onPress={(e: any) => select(e)}
                key={key}
                item={item} />
            });
            setOptions(items);
            return items;
        }

        return null;
    }

    const onValueChange = (e: string) => {
        setTextValue(e);
        mappedItems(e);
        if (!focus) {
            setMenu(true);
        }
        if (props.onChangeText)
            props.onChangeText(e);
    }

    const onblur = (e: any) => {
        if (Platform.OS === 'web') {
            if (!e.relatedTarget ||
                e.relatedTarget && !e.relatedTarget.parentElement ||
                e.relatedTarget && e.relatedTarget.parentElement && 
                e.relatedTarget.parentElement.id != "menu") {
                if (props.value && textValue)
                    setTextValue(props.value);
                else {
                    setTextValue("");
                    setKey("");
                    props.setValue("");
                }
                setBlurring(true);
                setTimeout(() => {
                    setBlurring(false);
                }, 250);
                setMenu(false);
            }
        }
    }

    const onfocus = (e: any) => {
        if (!focus) {
            setMenu(true);
        }
    }

    const styles = StyleSheet.create({
        inputContainer: {
            display: 'flex',
            flexDirection: 'row',
            width: '100%',
            alignItems: 'center'
        },
        menuContainer: {
            ...Platform.select({
                web: {
                    position: 'absolute',
                    width: '100%'
                }
            }),
        },
        menuVoid: {
            backgroundColor: Color(props.isDarkMode).black,
            height: '100%',
            width: '100%'
        },
        noResults: {
            textAlign: 'center',
            padding: 10,
            fontSize: FontSize.default,
            fontFamily: 'Inter-Regular',
            width: '100%',
            color: Color(props.isDarkMode).textTertiary
        },
        menu: {
            backgroundColor: Color(props.isDarkMode).white,
            borderColor: Color(props.isDarkMode).border,
            borderWidth: 1,
            width: '100%',
            maxHeight: 300,
            borderRadius: Radius.default,
            overflowY: 'auto',
            overflowX: 'hidden',
            position: 'absolute',
            shadowColor: Color(props.isDarkMode).shadow,
            shadowOffset: {width: -4, height: 4},
            shadowOpacity: .15,
            shadowRadius: 15,
        },
        modalMenuContainer: {
            height: '100%',
            width: '100%',
            backgroundColor: Color(props.isDarkMode).promptMaskMobile,
            padding: 20,
            alignItems: 'center',
            flexDirection: 'column',
            justifyContent: 'center',
            display: 'flex',
        },
        modalContentHolder: {
            backgroundColor: props.isDarkMode ? Color(props.isDarkMode).contentHolderSecondary : Color(props.isDarkMode).contentDialogBackground,
            alignItems: 'center',
            flexDirection: 'column',
            justifyContent: 'center',
            display: 'flex',
            padding: 10,
            borderRadius: Radius.default,
            borderWidth: .5,
            borderColor: Color(props.isDarkMode).separator
        },
        modalInner: {
            height: 300,
        },
        modalMenu: {
            backgroundColor: Color(props.isDarkMode).white,
            borderColor: Color(props.isDarkMode).border,
            borderWidth: 1,
            marginTop: 10,
            overflow: 'hidden',
        },
        text: {
            display: 'flex',
            flexDirection: 'row',
            gap: 5
        },
        error: {
          color: Color(props.isDarkMode).danger,
          fontFamily: 'Inter-Bold'
        },
        icon: {
            height: 16,
            width: 16,
            color: Color(props.isDarkMode).icon,
            outlineStyle: 'none',
            marginRight: 2,
        },
        deleteTextIcon: {
            outlineStyle: 'none',
        },
        iconContainer: {
            bottom: 0,
            right: 0,
            position: 'absolute',
            height: 40,
            display: 'flex',
            justifyContent: 'center',
            width: 25,
            alignItems: 'center',
        },
        iconContainerMobile: {
            width: '100%',
            justifyContent: 'flex-end',
            flexDirection: 'row',
            right: 5
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
        buttons: {
            flexDirection: 'row',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginTop: 10,
            width: '100%'
        },
        shellButton: {
            width: '100%'
        },
        modal: {
            width: '100%',
        },
        deleteTextButton: {
            position: 'absolute',
            right: 3,
            borderRadius: Radius.medium,
            padding: 2
        }
      });

    const input = (isWeb: boolean = true, isModal: boolean = false) => {
        return <View
            style={styles.inputContainer}
            >
            <TextInput
            style={[style(), {flex: 1}, isModal ? {paddingRight:38} : null]}
            onChangeText={(e) => onValueChange(e)}
            value={textValue}
            placeholder={props.placeholder}
            keyboardType={props.keyboardType}
            ref={props.innerRef ? props.innerRef : inputRef}
            onFocus={(e: any) => onfocus(e)}
            onBlur={(e: any) => onblur(e)}
            showSoftInputOnFocus={isWeb}
            caretHidden={!isWeb}
            selectTextOnFocus={isWeb}
            placeholderTextColor={Color(props.isDarkMode).placeHolderText}
            >
            </TextInput>
            {isModal && textValue ?
            <TouchableHighlight
            underlayColor={props.isDarkMode ? Color(props.isDarkMode).whiteUnderlay : Color(props.isDarkMode).holderUnderlay}
            style={[styles.deleteTextButton]}
            onPress={(e: any) => {
                if (props.setValue) {
                    setTextValue('');
                    props.setValue('');
                    onValueChange('');
                }
            }}
            >
                <FontAwesomeIcon 
                size={30} 
                color={Color(props.isDarkMode).text} 
                style={styles.deleteTextIcon} 
                icon="xmark"
                >
                </FontAwesomeIcon>
            </TouchableHighlight>
            : null }
            </View>
    }

    const iconStyle = () => {
        let style = [];
        style.push(styles.iconContainer);
        if (Platform.OS !== 'web')
            style.push(styles.iconContainerMobile);

            return style;
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
            {props.label ?
            <Text
            style={labelStyle()}
            >
                {props.label}
            </Text>
            : null}
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
                {input(Platform.OS === 'web')}
                <Pressable
                style={iconStyle()}
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
            onShow={() => mappedItems(props.value, true)}
            visible={true}
            animationType='fade'
            transparent={true}
            onRequestClose={() => setFocus(false)}
            style={styles.modal}
            >
                <View
                style={styles.modalMenuContainer}
                >
                    <View
                    style={styles.modalContentHolder}
                    >
                        <View
                        style={styles.modalInner}
                        >
                            {input(true, true)}
                            <ScrollView
                                keyboardShouldPersistTaps={'handled'}
                                style={[styles.modalMenu]}
                                >
                                {visibleOptionCount === 0 ?
                                <_Text
                                style={styles.noResults}
                                >No results</_Text>
                                : null}
                                {options}
                            </ScrollView>
                        </View>
                        <View
                        style={styles.buttons}
                        >
                            <_Button
                            containerStyle={styles.shellButton}
                            isDarkMode={props.isDarkMode}
                            onPress={(e: any) => setFocus(false)}
                            style={Style(props.isDarkMode).buttonDanger}
                            >
                                Close
                            </_Button>
                        </View>
                    </View>
                </View>
            </Modal>
            }
        </View>
        : null}

    </View>
    );
}; 

export default _Dropdown;