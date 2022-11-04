import { StyleSheet, View } from 'react-native';
import _TextInput from '../control/text-input';
import _Dropdown from '../control/dropdown';
import _Checkbox from '../control/checkbox';
import _Text from '../control/text';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Color, Radius } from '../../style';
import { Context } from '../../App';

const _Group = (props: any, {navigation}:any) => {
    const [focus,setFocus] = useState(false);
    const [prepFocus, setPrepFocus] = useState(false);
    const [canPrepFocus, setCanPrepFocus] = useState(false);
    const [timerId, setTimerId] = useState(-1);

    useEffect(() => {
        if (canPrepFocus) {
            let timeout: any;
            if (timerId < 0) {
                timeout = setTimeout(() => setFocus(prepFocus), 10);
                setTimerId(timeout);
            }
            else {
                clearTimeout(timerId);
                setTimerId(-1);
            }
            setCanPrepFocus(false);
        }
      }, [prepFocus, timerId]) 
      
    const setParentFocus = useCallback((value: any) => { 
        setPrepFocus(value);
        setCanPrepFocus(true);
        //setFocus(value);
      }, []);

    const containerStyle = () => {
        var style = [];
        if (focus) {
            style.push(styles.groupFocus);
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

    return (
        <View
        style={containerStyle()}
        >
            <_Text
            required={props.required}
            style={styles.label}
            >
                {props.label}
            </_Text>
            <View
            style={groupStyle(focus)}
            >
            <Context.Provider value={{ setParentFocus, groupStyle: {flex: 1} }}>
            {props.children}
            </Context.Provider>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    label: {
        marginBottom: 5
    },
    group: {
        backgroundColor: Color.holder,
        display: 'flex',
        gap: 10,
        borderRadius: Radius.default,
    },
    groupAccent: {
        padding: 10,
        shadowColor: Color.holderSecondary,
        shadowOffset: {width: -3, height: 3},
        shadowOpacity: 1,
        shadowRadius: 0,
        marginLeft: 3,
        width: 'calc(100% - 3px)'
    },
    groupNoBG: {
        backgroundColor: Color.none,
    },
    groupFocus: {
        zIndex: 1,
        elevation: 1
    },
    horizontal: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    vertical: {
        flexDirection: 'column',
        alignItems: 'flex-start',
    }
});

export default _Group;