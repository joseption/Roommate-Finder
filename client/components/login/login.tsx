import { useLinkProps } from '@react-navigation/native';
import React from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import _Button from '../../components/control/button';
import _Text from '../../components/control/text';
import { Color, Style } from '../../style';
import _TextInput from '../control/textinput';

const Login = (props: any, {navigation}:any) => {
  const login = () => {
    // do login stuff with props
  }
  return (
    <View
    style={props.style}>
      <_Text
      style={[Style.textHuge, Style.boldFont]}
      >
        Login
      </_Text>
      <_Text
      style={[Style.textDefaultTertiary, styles.actionText]}
      >
        Please sign in to continue
      </_Text>
      <_TextInput
      label="Email"
      style={styles.inputStyle}
      />
      <_TextInput
      type="password"
      label="Password"
      />
      <_Text
      style={[Style.textSmallDefault, styles.forgotPassword]}
      onPress={() => props.forgotPasswordPressed()}
      >
        Forgot Password?
      </_Text>
      <View
      style={styles.alignRight}
      >
        <_Button
        style={[Style.buttonSuccess, styles.submitButton]}
        onPress={login()}
        >
          Login
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
          Don't have an account?
        </_Text>
        <_Text
        style={[Style.textDefaultDefault, Style.boldFont]}
        onPress={() => props.registerPressed()}
        >Sign up</_Text>
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
    marginBottom: 20
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

export default Login;