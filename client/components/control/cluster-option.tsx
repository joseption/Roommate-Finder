import { useNavigation } from '@react-navigation/native';
import React, { useCallback, useContext, useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Context, navProp } from '../../helper';
import { Color, Style } from '../../style';
import _Button from './button';
import _Text from './text';

const _ClusterOption = (props: any) => {
    /*
    Props: JA TODO 
    */
    const [selected,setSelected] = useState(false);

    useEffect(() => {
        setSelected(props.selected.includes(props.item));
    }, [props.selected]);

    const style = () => {
        var style = [];
        style.push(styles.button);
        if (selected) {
            style.push(styles.selected);
        }
        return style;
    }

    const styles = StyleSheet.create({
        selectedLabel: {
            color: Color(props.isDarkMode).actualWhite
        },
        selected: {
            borderColor: Color(props.isDarkMode).gold,
            backgroundColor: Color(props.isDarkMode).gold
        },
        button: {
            paddingTop: 7,
            paddingBottom: 7,
            paddingRight: 10,
            paddingLeft: 10,
            backgroundColor: Color(props.isDarkMode).white,
            borderRadius: 10,
            borderWidth: 1,
            borderColor: Color(props.isDarkMode).border,
            margin: 2.5
        },
    });

    return (
        <_Button
        isDarkMode={props.isDarkMode}
        style={style()}
        onPress={() => props.onPress(props.item)}
        >
            <_Text
            style={selected ? styles.selectedLabel : {color: Color(props.isDarkMode).text}}
            >
                {props.item}
            </_Text>
        </_Button>
    );
};

export default _ClusterOption;