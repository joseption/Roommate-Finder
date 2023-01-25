import { useFocusEffect } from '@react-navigation/native';
import { setStatusBarStyle } from 'expo-status-bar';
import React, { useContext, useEffect, useState } from 'react';
import { Platform, StyleSheet, Text, TextInput, View } from 'react-native';
import { Context, isMobile } from '../../helper';
import { Color, Radius, Style } from '../../style';
import _Text from './text';

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
  const [length,setLength] = useState(0);
  const [phoneMask,setPhoneMask] = useState(false);
  const [phoneMaskLength,setPhoneMaskLength] = useState(0);
  useEffect(() => {
  }, []);

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
    var style = [];
    style.push(Style.inputDefault);
    style.push(styles.input);
    if (props.multiline) {
      style.push({
        height: props.height,
      });
    }
    if (!props.style) {
      style.push(props.style);
    }
    style.push(styles.transparentBackground);
    if (phoneMask)
      style.push(styles.phoneMaskText);
    return style;
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
        return " is required"
      }
      else {
        return props.errorMessage;
      }
    }
  }

  const phonePlaceholder = () => {
    let mask = '(999) 999-9999';
    return getValue() + mask.substring(phoneMaskLength);
  }

  const onChangeText = (e: any) => {
    var value = e;
    if (props.keyboardType === 'numeric' || props.type === 'phone') {
      value = e.replace(/[^0-9]/g, '');
    }
    setLength(value.length);
    if (props.onChangeText)
      props.onChangeText(value);
    if (props.setValue)
      props.setValue(value);
  }

  const placeholder = () => {
    if (props.placeholder)
      return props.placeholder;
    else if (props.type === 'phone' && !phoneMask) {
      setPhoneMask(true);
      return '';
    }
  }

  const keyboardType = () => {
    if (props.keyboardType)
      return props.keyboardType;
    else if (props.type === 'phone')
      return 'numeric'
  }

  const getMaxLength = () => {
    if (phoneMask && props.maxLength)
      return props.maxLength + 4;
    else
      return props.maxLength;
  }

  const getValue = () => {
    if (phoneMask) {
      let value = '';
      for (let i = 0; i < props.value.length; i++) {
        if (i == 0)
          value += '(';
        
         if (i == 3)
          value += ') ';

        if (i == 6)
          value += '-';

        value += props.value[i];
      }
      if (value.length != phoneMaskLength)
        setPhoneMaskLength(value.length);
      return value;
    }
    else
      return props.value;
  }

  const checkSubmit = () => {
    if (props.onSubmit)
      props.onSubmit();
  }

  const returnTypeKey = () => {
    if (props.onSubmit) {
      return 'go';
    }
    else {
      return 'default';
    }
  }

  return (
    <View
    style={containerStyle()}
    >
      <View
      style={styles.header}
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
        {props.maxLength && props.showMaxLength ?
        <_Text
        style={styles.count}
        >
          {length}/{props.maxLength}
        </_Text>
        : null }
      </View>
      <View
      style={styles.textBackground}
      >
        {phoneMask ?
        <_Text
        containerStyle={styles.phoneContainer}
        style={styles.phoneMask}
        >
          {phonePlaceholder()}
        </_Text>
        : null }
        <TextInput
        style={style()}
        onChangeText={(e: any) => onChangeText(e)}
        value={getValue()}
        placeholder={placeholder()}
        keyboardType={keyboardType()}
        secureTextEntry={props.type === 'password'}
        ref={props.ref}
        multiline={props.multiline}
        maxLength={getMaxLength()}
        onSubmitEditing={(e: any) => {checkSubmit()}}
        returnKeyType={returnTypeKey()}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  phoneMaskText: {
    color: Color.textMask
  },
  transparentBackground: {
    backgroundColor: Color.transparent
  },
  textBackground: {
    backgroundColor: Color.white,
    borderRadius: Radius.default
  },
  phoneMask: {
    color: Color.textSecondary
  },
  phoneContainer: {
    zIndex: -1,
    position: 'absolute',
    top: 8,
    left: 11,
  },
  count: {
    color: Color.textSecondary
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row'
  },
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
  },
  input: {
    ...Platform.select({
      android: {
        textAlignVertical: 'top'
      }
    }),
  }
});

export default _TextInput;