import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Color, Style } from '../../style';

const _Text = (props: any) => {
  const style = () => {
    return (!props.style) ? Style.textDefault : props.style;
  }

  const press = () => {
    if (props.navigation) {
        props.navigation.navigate(props.navigateTo);
    }
    else if (props.onPress) {
        props.onPress();
    }
  }

  return (
    <View>
      {(props.onPress != null) ?
      <Pressable
      onPress={() => press()}
      >
        <Text
        onPress={() => press()}
        style={style()}>
          {props.children}
        </Text>
      </Pressable>
      :
      <Text
        style={style()}>{props.children}
      </Text>
      }
    </View>
  );
};

export default _Text;