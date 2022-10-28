import React from 'react';
import { StyleSheet, View } from 'react-native';
import _Button from '../../components/control/button';
import _Text from '../../components/control/text';
import { Style } from '../../style';
import _TextInput from '../control/textinput';

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
      style={[Style.textDefaultTertiary, styles.actionText]}
      >
        Your password has been updated
      </_Text>
        <View
        style={styles.alignRight}
        >
            <_Button
            style={[Style.buttonDefault, styles.submitButton]}
            onPress={() => props.loginPressed()}
            >
            Back to Login
            </_Button>
        </View>
    </View>
  );
};

const styles = StyleSheet.create({
  actionText: {
    marginTop: 5,
    marginBottom: 40
  },
  inputStyle: {
    marginBottom: 15
  },
  forgotPassword: {
    marginTop: 5,
    marginBottom: 40,
    marginRight: 0,
    marginLeft: 'auto'
  },
  submitButton: {
    marginBottom: 40
  },
  alignRight: {
    marginRight: 0,
    marginLeft: 'auto'
  },
  alignCenter: {
    margin: 'auto'
  },
  signupInfo: {
    display: 'flex',
    gap: 5,
    flexDirection: 'row',
    marginBottom: 0,
    marginTop: 'auto',
    justifyContent: 'center'
  }
});

export default PasswordUpdated;