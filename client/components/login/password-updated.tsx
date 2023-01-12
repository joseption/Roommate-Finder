import React from 'react';
import { StyleSheet, View } from 'react-native';
import _Button from '../../components/control/button';
import _Text from '../../components/control/text';
import { LoginStyle, Style } from '../../style';
import _TextInput from '../control/text-input';

const PasswordUpdated = (props: any, {navigation}:any) => {
  return (
    <View
    style={props.style}>
      <_Text
      style={[Style.textHuge, Style.boldFont]}
      >
        Password Updated
      </_Text>
      <_Text
      style={[Style.textDefaultTertiary, LoginStyle.actionText]}
      >
        Your password has been updated
      </_Text>
        <View
        style={Style.alignRight}
        >
            <_Button
            style={[Style.buttonDefault, LoginStyle.submitButton]}
            onPress={() => props.loginPressed()}
            >
            Back to Login
            </_Button>
        </View>
    </View>
  );
};

export default PasswordUpdated;