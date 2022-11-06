import React, { useContext } from 'react';
import { Platform, StyleSheet, Text, TextInput, View } from 'react-native';
import { Context, isMobile } from '../../helper';
import { Color, Style } from '../../style';

const _TextInput = (props: any) => {
    /* Props:
  style: Add custom styles to the input field
  labelStyle: Add custom styles to the label text
  error: Set true/false if error text
  errorMessage: if no error message is provided, the default is "is required" else a custom message is used
  value: Uses the value from the nested text as the text field value
  label: Set the label text above the input field
  required: Marks the text to end in an * mark
  onChangeText: Performs your function when the text input changes
  placeholder: Give the input field a watermark
  keyboardType: Give the input field a keyboard type
  type: If the input field is a password field set this value to true
  ref: Give the input field a ref
  */
  const context = useContext(Context);
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

  const containerStyle = () => {
    var style = [];
    style.push(styles.container);
    if (context.isGroup) {
      if (isMobile())
          style.push(Style.verticalGroup);
      else
          style.push(Style.horizontalGroup);
    }
    if (context.isGroup) {
    var container = {
        ...Platform.select({
          web: {
              flex: 1,
          },
        }),
      }
      style.push(container);
    }
    style.push(props.containerStyle);
    return style;
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
    <View
    style={containerStyle()}
    >
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
  },
  container: {
    width: '100%',
  }
});

export default _TextInput;