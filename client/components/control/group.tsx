import { Platform, StyleSheet, View } from 'react-native';
import _TextInput from '../control/text-input';
import _Dropdown from '../control/dropdown';
import _Checkbox from '../control/checkbox';
import _Text from '../control/text';
import { useCallback, useState } from 'react';
import { Color, Radius } from '../../style';
import { Context } from '../../helper';

const _Group = (props: any, {navigation}:any) => {
    /*
    Props: JA TODO 
    */
    const [focus,setFocus] = useState(false);  
    const [isGroup, setIsGroup] = useState(true);
    const setParentFocus = useCallback((value: any) => { 
        setFocus(value);
      }, []);

    const containerStyle = () => {
        var style = [];
        if (focus) {
            style.push(styles.groupFocus);
        }
        if (props.containerStyle) {
            style.push(props.containerStyle);
        }

        return style;
    }

    const groupStyle = (focus: boolean) => {
        var style = [];
        style.push(styles.group);
        if (focus) {
            style.push(styles.groupFocus);
        }
        if (!props.noBackground) {
            style.push(styles.groupAccent);
        }
        else {
            style.push(styles.groupNoBG);
        }
        if (props.vertical || props.mobile) {
            style.push(styles.vertical);
        }
        else {
            style.push(styles.horizontal);
        }
        if (props.style)
            style.push(props.style);

        return style;
    }

    const styles = StyleSheet.create({
        label: {
            marginBottom: 5,
            color: Color(props.isDarkMode).text
        },
        group: {
            backgroundColor: Color(props.isDarkMode).contentHolder,
            display: 'flex',
            borderRadius: Radius.default,
        },
        groupAccent: {
            padding: 10,
            shadowColor: Color(props.isDarkMode).contentHolderSecondary,
            shadowOffset: {width: -3, height: 3},
            shadowOpacity: 1,
            shadowRadius: 0,
            marginLeft: 3,
            ...Platform.select({
                web: {
                    width: 'calc(100% - 3px)'
                },
                android: {
                    marginLeft: 0
                }
            })
        },
        groupNoBG: {
            backgroundColor: Color(props.isDarkMode).none,
        },
        groupFocus: {
            zIndex: 1,
            elevation: 1
        },
        horizontal: {
            flexDirection: 'row',
            alignItems: 'center',
            paddingRight: 0,
        },
        vertical: {
            flexDirection: 'column',
            alignItems: 'flex-start',
            marginTop: 0
        },
    });

    return (
        <View
        style={containerStyle()}
        >
            {props.label ?
            <_Text
            required={props.required}
            style={styles.label}
            >
                {props.label}
            </_Text>
            : null }
            <View
            style={groupStyle(focus)}
            >
            <Context.Provider value={{ setParentFocus, isGroup }}>
            {props.children}
            </Context.Provider>
            </View>
        </View>
    );
};

export default _Group;