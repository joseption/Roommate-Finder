import { useNavigation } from '@react-navigation/native';
import React, { useCallback, useContext, useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Context, navProp } from '../../helper';
import { Color, Style } from '../../style';
import _Button from './button';
import _Text from './text';

const _ClusterOption = (props: any) => {
  /* Props:
  
  */
    const [selected,setSelected] = useState(false);

    useEffect(() => {
        setSelected(props.selected.includes(props.item.key));
    }, [props.selected]);

    const style = () => {
        var style = [];
        style.push(styles.button);
        if (selected) {
            style.push(styles.selected);
        }
        return style;
    }

    return (
        <_Button
        style={style()}
        onPress={() => props.onPress(props.item.key)}
        >
            <_Text
            style={selected ? styles.selectedLabel : null}
            >
                {props.item.value}
            </_Text>
        </_Button>
    );
};

const styles = StyleSheet.create({
    selectedLabel: {
        color: Color.white
    },
    selected: {
        borderColor: Color.default,
        backgroundColor: Color.default
    },
    button: {
        paddingTop: 5,
        paddingBottom: 5,
        paddingRight: 10,
        paddingLeft: 10,
        backgroundColor: Color.white,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: Color.border,
        margin: 2.5
    },
});

export default _ClusterOption;