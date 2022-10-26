import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import _Button from '../../components/control/button';
import _Text from '../../components/control/text';
import { Color, Style } from '../../style';

const ForgotPassword = (props: any, {navigation}:any) => {
  return (
    <View style={props.style}>
        <_Button
            style={Style.buttonSuccess}
            onPress={() => props.backToLoginPressed()}
        >
            Forgot Password Screen
        </_Button>
        <_Button
            style={Style.buttonSuccess}
            onPress={() => props.sendEmailPressed()}
        >
            Send Email
        </_Button>
    </View>
  );
};

export default ForgotPassword;