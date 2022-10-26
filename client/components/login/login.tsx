import { useLinkProps } from '@react-navigation/native';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import _Button from '../../components/control/button';
import _Text from '../../components/control/text';
import { Color, Style } from '../../style';

const Login = (props: any, {navigation}:any) => {
  return (
    <View style={props.style}>
        <_Button
            style={Style.buttonSuccess}
            navigateTo='Home'
            navigation={navigation}
        >
            Home
        </_Button>
        <_Button style={Style.buttonSuccess} onPress={() => props.forgotPasswordPressed()}>Another</_Button>
    </View>
  );
};

export default Login;