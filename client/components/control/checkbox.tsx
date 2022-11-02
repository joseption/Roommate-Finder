import React, { useEffect, useState } from 'react';
import { Pressable, View } from 'react-native';
import { Style } from '../../style';
import _Text from './text';

const _Checkbox = (props: any, {navigation}:any) => {
    const [checked,setChecked] = useState(false);
    const [init,setInit] = useState(false);
    useEffect(() => {
        if (!init) {
            setChecked(props.checked);
            setInit(true);
        }
    }, [checked]);

    const press = () => {
        setChecked(!checked);
    }

    return (
    <View>
        <Pressable
        style={Style.checkboxContainer}
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