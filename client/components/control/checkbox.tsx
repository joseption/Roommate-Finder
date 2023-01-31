import React, { useContext, useEffect, useState } from 'react';
import { Pressable, View } from 'react-native';
import { styles } from '../../screens/login';
import { Context, isMobile } from '../../helper';
import { Style } from '../../style';
import _Text from './text';

const _Checkbox = (props: any, {navigation}:any) => {
    /*
    Props: JA TODO 
    */
    const context = useContext(Context);
    const [checked,setChecked] = useState(false);
    const [init,setInit] = useState(false);
    useEffect(() => {
        if (!init) {
            setChecked(props.checked);
            setInit(true);
        }
    }, [checked]);

    const containerStyle = () => {
        var style = [];
        if (context.isGroup) {
            if (isMobile())
                style.push(Style(props.isDarkMode).verticalGroup);
            else
                style.push(Style(props.isDarkMode).horizontalGroup);
        }

        return style;
    }

    const press = () => {
        setChecked(!checked);
        props.checked(!checked);
    }

    return (
    <View
    style={containerStyle()}
    >
        <Pressable
        style={[Style(props.isDarkMode).checkboxContainer, props.checkbox]}
        onPress={() => press()}
        >
        <View
        style={Style(props.isDarkMode).checkbox}
        >
            {checked ?
            <View
            style={Style(props.isDarkMode).checkboxMarkContainer}
            >
                <View
                style={Style(props.isDarkMode).checkboxMark}
                />
            </View>
            :
            null
            }
        </View>
        <_Text
        style={Style(props.isDarkMode).checkboxLabel}
        >
            {props.label}
        </_Text>
        </Pressable>
    </View>
    );
};

export default _Checkbox;