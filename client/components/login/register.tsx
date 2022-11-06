import React, { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import _Button from '../../components/control/button';
import _Text from '../../components/control/text';
import { config, env, validateEmail } from '../../helper';
import { LoginStyle, Style } from '../../style';
import _TextInput from '../control/text-input';

const Register = (props: any, {navigation}:any) => {
  const [disabled, setDisabled] = useState(true);
  const [message, setMessage] = useState('');
  const [emailError,setEmailError] = useState(false);

  const TEMP = () => {
    props.setEmail("");
    setEmailError(false);
    setDisabled(true);
    props.sendEmailPressed();
  }

  const backToLogin = () => {
      setMessage("");
      props.setEmail("");
      setEmailError(false);
      setDisabled(true);
      props.loginPressed();
  }

  const handleChange = (value: string) => {
    var error = !validateEmail(value);
    setDisabled(error);
    props.setEmail(value);
  };

  const doRegister = async () => 
  {
      if (disabled)
        return;

      setMessage("");
      setDisabled(true);
      props.setEmail(props.email);
      setEmailError(false);

      let obj = {email:props.email};
      let js = JSON.stringify(obj);

      try
      {    
          await fetch(`${env.URL}/api/register`,
          {method:'POST',body:js,headers:{'Content-Type': 'application/json'}}).then(async ret => {
              let res = JSON.parse(await ret.text());
              if (res.error && res.error !== "Account Exists")
              {
                  setMessage(res.error);
                  setDisabled(false);
              }
              else
              {
                  if (res.error === "Account Exists") {
                      props.setResendVerify(true);
                  }

                  props.setEmail("");
                  setEmailError(false);
                  setDisabled(true);
                  props.sendEmailPressed();
              }
          });
      }
      catch(e)
      {
          TEMP(); // JA REMOVE
          setMessage('An unknown error occurred');
          setDisabled(false);
          return;
      }    
  };
  return (
    <View
    style={props.style}>
      <_Text
      style={[Style.textHuge, Style.boldFont]}
      >
        Register
      </_Text>
      <_Text
      style={[Style.textDefaultTertiary, LoginStyle.actionText]}
      >
        Create an account with your UCF email
      </_Text>
      <_TextInput
      label="Email"
      style={LoginStyle.inputStyle}
      onChangeText={(e: any) => {handleChange(e)}}
      value={props.email}
      error={emailError}
      />
      <View
      style={Style.alignRight}
      >
        <_Button
        style={props.btnStyle(disabled)}
        onPress={() => doRegister()}
        disabled={disabled}
        >
          Create Account
        </_Button>
      </View>
      <_Text
      style={LoginStyle.errorMessage}
      >
        {message}
      </_Text>
        <View
        style={LoginStyle.previousPageText}
        >
        <_Text
        style={Style.textDefaultTertiary}
        >
          Already have an account?
        </_Text>
        <_Text
        style={[Style.textDefaultDefault, Style.boldFont]}
        onPress={() => backToLogin()}
        >Login</_Text>
      </View>
    </View>
  );
};

export default Register;