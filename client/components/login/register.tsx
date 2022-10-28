import React from 'react';
import { StyleSheet, View } from 'react-native';
import _Button from '../../components/control/button';
import _Text from '../../components/control/text';
import { Style } from '../../style';
import _TextInput from '../control/textinput';

const Register = (props: any, {navigation}:any) => {
  const login = () => {
    // do register stuff with props
  }
  return (
    <View
    style={props.style}>
      <_Text
      style={[Style.textHuge, Style.boldFont]}
      >
        Register
      </_Text>
      <_Text
      style={[Style.textDefaultTertiary, styles.actionText]}
      >
        Create an account with your UCF email
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
          Create Account
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
          Already have an account?
        </_Text>
        <_Text
        style={[Style.textDefaultDefault, Style.boldFont]}
        onPress={() => props.loginPressed()}
        >Login</_Text>
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

export default Register;