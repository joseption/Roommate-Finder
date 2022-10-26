import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Color } from '../../style';

const _Text = (props: any) => {
  const textStyle = () => {
    return (!props.style) ? styles.text : props.style;
  }

  return (
    <View>
      <Text style={textStyle()}>{props.children}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  text: {
    color: Color.black,
    fontFamily: 'Inter-Regular'
  }
});

export default _Text;