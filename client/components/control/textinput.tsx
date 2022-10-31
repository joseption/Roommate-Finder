import { PrivateValueStore } from '@react-navigation/native';
import React from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import { Color, Style } from '../../style';

const _TextInput = (props: any) => {
  const labelStyle = () => {
    var style = [];
    if (!props.labelStyle)
      style.push(Style.labelDefault)
    else
      style.push(props.labelStyle);
    if (props.error == true)
      style.push(styles.error);

    return style;
  }

  const style = () => {
    if (!props.style) {
        return Style.inputDefault;
    }
    else {
      return [Style.inputDefault, props.style];
    }
  }

  const errorMessage = () => {
    if (props.error == true) {
      if (!props.errorMessage) {
        return "is required"
      }
      else {
        return props.errorMessage;
      }
    }
  }

  return (
    <View>
      <View
      style={styles.text}
      >
        <Text
          style={labelStyle()}
        >
          {props.label}
        </Text>
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
      <TextInput
      style={style()}
      onChangeText={props.onChangeText}
      value={props.value}
      placeholder={props.placeholder}
      keyboardType={props.keyboardType}
      secureTextEntry={props.type === 'password'}
      ref={props.ref}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  text: {
      gap: 5,
      display: 'flex',
      flexDirection: 'row'
  },
  error: {
    color: Color.danger,
    fontFamily: 'Inter-Bold'
  }
});

export default _TextInput;