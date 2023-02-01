import { userInfo } from 'os';
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
  const [loading,setLoading] = useState(false);

  useEffect(() => {
    if (props.emailValue) {
      setDisabled(false);
    }
  }, [props.emailValue]);

  const backToLogin = () => {
      setMessage('');
      props.setEmail('');
      setEmailError(false);
      setDisabled(true);
      props.setPasswordUpdateType('');
      props.loginPressed();
  }

  const handleChange = (value: string) => {
    var error = !validateEmail(value);
    setDisabled(false); // JA TEMP put back "error"
    props.setEmail(value);
  };

  const doRegister = async () => 
  {
    let hasError = false;
      setLoading(true);
      setEmailError(false);

      if (disabled) {
        setEmailError(!props.email);
        return;
      }

      setMessage("");
      setDisabled(true);
      props.setEmail(props.email);
      setEmailError(false);

      let obj = {email:props.email};
      let js = JSON.stringify(obj);

      try
      {    
          await fetch(`${env.URL}/auth/registerFast`,
          {method:'POST',body:js,headers:{'Content-Type': 'application/json'}}).then(async ret => {
              let res = JSON.parse(await ret.text());
              if (res.error)
              {
                    setMessage(res.error);
                    hasError = true;
              }
              else
              {
                  setEmailError(false);
                  setDisabled(true);
                  props.sendEmailPressed();
              }
              setDisabled(false);
          });
      }
      catch(e)
      {
        setMessage('An unknown error occurred');
        hasError = true;
      }    
      if (hasError) {
        setDisabled(false);
      }
      setLoading(false);
  };
  return (
    <View
    style={props.style}>
      <_Text
      style={[Style(props.isDarkMode).textHuge, Style(props.isDarkMode).boldFont]}
      >
        Register
      </_Text>
      <_Text
      style={[Style(props.isDarkMode).textDefaultTertiary, LoginStyle(props.isDarkMode).actionText]}
      >
        Create an account with your UCF email
      </_Text>
      {<_TextInput
      label="Email"
      containerStyle={LoginStyle(props.isDarkMode).inputStyle}
      onChangeText={(e: any) => {handleChange(e)}}
      value={props.email}
      error={emailError}
      onSubmit={doRegister}
      loading={loading}
      keyboardType='email-address'
      isDarkMode={props.isDarkMode}
      />}
      <View
      style={Style(props.isDarkMode).alignRight}
      >
        <_Button
        isDarkMode={props.isDarkMode}
        style={props.btnStyle(disabled)}
        onPress={() => doRegister()}
        disabled={disabled}
        loading={loading}
        >
          Next
        </_Button>
      </View>
      <_Text
      style={LoginStyle(props.isDarkMode).errorMessage}
      >
        {message}
      </_Text>
        <View
        style={LoginStyle(props.isDarkMode).previousPageText}
        >
        <_Text
        style={Style(props.isDarkMode).textDefaultTertiary}
        >
          Already have an account?
        </_Text>
        <_Text
        style={[Style(props.isDarkMode).textDefaultDefault, Style(props.isDarkMode).boldFont, LoginStyle(props.isDarkMode).previousPageAction]}
        onPress={() => backToLogin()}
        >Login</_Text>
      </View>
    </View>
  );
};

export default Register;