import React, { useContext, useEffect, useState } from 'react';
import { Pressable, View } from 'react-native';
import { styles } from '../../screens/login';
import { Context, isMobile } from '../../helper';
import { Style } from '../../style';
import _Text from './text';

const _Checkbox = (props: any, {navigation}:any) => {
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
                style.push(Style.verticalGroup);
            else
                style.push(Style.horizontalGroup);
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
        style={[Style.checkboxContainer, props.checkbox]}
        onPress={() => press()}
        >
        <View
        style={Style.checkbox}
        >
            {checked ?
            <View
            style={Style.checkboxMarkContainer}
            >
                <View
                style={Style.checkboxMark}
                />
            </View>
            :
            null
            }
        </View>
        <_Text
        style={Style.checkboxLabel}
        >
            {props.label}
        </_Text>
        </Pressable>
    </View>
    );
};

export default _Checkbox;