import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Color, Style } from '../../style';

const _Text = (props: any) => {
  const style = () => {
    var style = [];
    if (!props.style)
      style.push(Style.textDefault);
    else
      style.push(props.style);
    if (props.error)
      style.push(styles.error);

    return style;
  }

  const press = () => {
    if (props.navigation) {
        props.navigation.navigate(props.navigateTo);
    }
    else if (props.onPress) {
        props.onPress();
    }
  }

  const errorMessage = () => {
    if (!props.errorMessage) {
      return "is required"
    }
    else {
      return props.errorMessage;
    }
  }

  return (
    <View
    style={props.containerStyle}>
      {(props.onPress != null) ?
      <Pressable
      onPress={() => press()}
      >
        <View
        style={styles.text}
        >
          <Text
          onPress={() => press()}
          style={style()}>
            {props.children}
          </Text>
          {props.error ?
          <Text
          style={style()}
          >
            {errorMessage()}
          </Text>
          : null
          }
          {props.required ?
          <Text
          onPress={() => press()}
          style={style()}>
            *
          </Text>
          : null
          }
        </View>
      </Pressable>
      :
      <View
      style={styles.text}
      >
        <Text
          style={style()}
        >
          {props.children}
        </Text>
        {props.error ?
        <Text
        style={style()}
        >
          {errorMessage()}
        </Text>
        : null
        }
        {props.required ?
          <Text
          style={style()}>
            *
          </Text>
          : null
          }
      </View>
      }
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
    color: Color.danger
  }
});

export default _Text;