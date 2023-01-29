import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import React, { useEffect, useState } from 'react';
import { View, TextInput, StyleSheet, Pressable, TouchableHighlight } from 'react-native';
import { Color, FontSize, Radius, Style } from '../../style';
import Text from './text';
import _Text from './text';

const _DropdownOption = (props: any, {navigation}:any) => {
    /*
    Props: JA TODO 
    */
    return (
    <TouchableHighlight
    underlayColor={Color.default}
    onPress={() => props.onPress(props.item)}
    style={props.item.display === 'none' ? styles.hide : null}
    >
        <Text
        style={[styles.style, {backgroundColor: props.item.background}]}
        >
            {props.item.value}
        </Text>
    </TouchableHighlight>
    );
};

const styles = StyleSheet.create({
    style: {
        width: '100%',
        paddingLeft: 10,
        paddingRight: 10,
        paddingTop: 10,
        paddingBottom: 10,
        fontSize: FontSize.default,
        color: Color.text
    },
    hide: {
        display: 'none'
    }
  });
  

export default _DropdownOption;