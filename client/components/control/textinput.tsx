import { PrivateValueStore } from '@react-navigation/native';
import React from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import { Color, Style } from '../../style';

const _TextInput = (props: any) => {
  const labelStyle = () => {
    return (!props.labelStyle) ? Style.labelDefault : props.labelStyle;
  }

  const style = () => {
    if (!props.style) {
        return Style.inputDefault;
    }
    else {
      return [Style.inputDefault, props.style];
    }
  }

  const value = () => {
    return props.value ? props.value : props.children;
  }

  return (
    <View>
      <Text
      style={labelStyle()}
      >
        {props.label}
      </Text>
      <TextInput
      style={style()}
      onChangeText={props.onChangeText}
      value={value()}
      placeholder={props.placeholder}
      keyboardType={props.keyboardType}
      secureTextEntry={props.type === 'password'}
      />
    </View>
  );
};

export default _TextInput;