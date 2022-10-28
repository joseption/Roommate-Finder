import React from 'react';
import { StyleSheet, View } from 'react-native';
import _Button from '../../components/control/button';
import _Text from '../../components/control/text';
import { Style } from '../../style';
import _TextInput from '../control/textinput';

const ForgotPassword = (props: any, {navigation}:any) => {
  return (
    <View
    style={props.style}>
      <_Text
      style={[Style.textHuge, Style.boldFont]}
      >
        Forgot Password
      </_Text>
      <_Text
      style={[Style.textDefaultTertiary, styles.actionText]}
      >
        Request a password reset link
      </_Text>
      <_TextInput
      label="Email"
      style={styles.inputStyle}
      />
      <View
      style={styles.alignRight}
      >
        <_Button
        style={[Style.buttonSuccess, styles.submitButton]}
        onPress={() => props.sendEmailPressed()}
        >
          Send Email
        </_Button>
      </View>
      <_Text
      style={[Style.textSmallDanger, styles.alignCenter]}
      >
        This is temp error text
      </_Text>
        <View
        style={styles.signupInfo}
        >
        <_Text
        style={Style.textDefaultTertiary}
        >
          Go back to
        </_Text>
        <_Text
        style={[Style.textDefaultDefault, Style.boldFont]}
        onPress={() => props.loginPressed()}
        >login</_Text>
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

export default ForgotPassword;