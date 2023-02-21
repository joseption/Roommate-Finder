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
    setLength(props.value.length);
  }, [props.value]);

  const labelStyle = () => {
    var style = [];
    if (props.label) {
      if (!props.labelStyle)
        style.push(Style(props.isDarkMode).labelDefault)
      else
        style.push(props.labelStyle);

      if (props.error == true)
        style.push(styles.error);

      if (props.readonly) {
        style.push({color: Color(props.isDarkMode).disabledText});
      }
      else
        style.push({color: Color(props.isDarkMode).text});
    }

    return style;
  }

  const inputStyle = () => {
    let align = props.multiline ? 'top' : 'center';
    return {
        height: 40,
        textAlignVertical: align
    }
  }

  const style = () => {
    var style = [];
    style.push(Style(props.isDarkMode).inputDefault);
    style.push(inputStyle());
    if (props.style) {
      style.push(props.style);
    }
    style.push(styles.transparentBackground);
    if (phoneMask)
      style.push(styles.phoneMaskText);

    if (props.readonly) 
      style.push(styles.disabled);

    if (props.error)
      style.push({borderColor: Color(props.isDarkMode).danger});

    if (props.multiline && props.height >= 0) {
      style.push({
        height: props.height,
      });
    }

    return style;
  }

  const containerStyle = () => {
    var style = [];
    style.push(styles.container);
    if (context.isGroup) {
      if (isMobile())
          style.push(Style(props.isDarkMode).verticalGroup);
      else
          style.push(Style(props.isDarkMode).horizontalGroup);
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
    if (props.returnKeyType) {
      return props.returnKeyType;
    }
    else if (props.onSubmit) {
      return 'go';
    }
    else {
      return 'default';
    }
  }

  const styles = StyleSheet.create({
    disabled: {
      color: Color(props.isDarkMode).disabledText,
      backgroundColor: Color(props.isDarkMode).disabledTextInput,
    },
    phoneMaskText: {
      color: Color(props.isDarkMode).textMask
    },
    transparentBackground: {
      backgroundColor: Color(props.isDarkMode).transparent
    },
    textBackground: {
      backgroundColor: Color(props.isDarkMode).input,
      borderRadius: Radius.default
    },
    phoneMask: {
      color: Color(props.isDarkMode).maskText
    },
    phoneContainer: {
      zIndex: -1,
      position: 'absolute',
      ...Platform.select({
        web: {
          top: 10,
          left: 11,
        },
        android: {
          top: 8,
          left: 10,
        }
      }),
    },
    count: {
      color: Color(props.isDarkMode).textSecondary
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
      color: Color(props.isDarkMode).danger,
      fontFamily: 'Inter-Bold'
    },
    container: {
      width: '100%',
    }
  });

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
      style={[styles.textBackground, props.innerContainerStyle]}
      pointerEvents={props.readonly ? 'none' : 'auto'}
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
        placeholderTextColor={Color(props.isDarkMode).placeHolderText}
        placeholder={placeholder()}
        keyboardType={keyboardType()}
        secureTextEntry={props.type === 'password'}
        ref={props.innerRef}
        multiline={props.multiline}
        maxLength={getMaxLength()}
        onSubmitEditing={(e: any) => {checkSubmit()}}
        returnKeyType={returnTypeKey()}
        editable={props.readonly}
        caretHidden={props.readonly}
        blurOnSubmit={props.blurOnSubmit}
        onBlur={props.onBlur}
        onFocus={props.onFocus}
        onLayout={props.onLayout}
        onContentSizeChange={props.onContentSizeChange}
        />
      </View>
    </View>
  )
};

export default _TextInput;
