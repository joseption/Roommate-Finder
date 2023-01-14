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

  const backToLogin = () => {
      setMessage('');
      props.setEmail('');
      setEmailError(false);
      setDisabled(true);
      props.setIsRegistering(false);
      props.loginPressed();
  }

  const handleChange = (value: string) => {
    var error = !validateEmail(value);
    setDisabled(false); //JA TEMP put back "error"
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

      let obj = {query:props.email};
      let js = JSON.stringify(obj);

      try
      {    
          await fetch(`${env.URL}/users/profileByEmail?email=${props.email}`,
          {method:'GET',headers:{'Content-Type': 'application/json'}}).then(async ret => {
              let res = JSON.parse(await ret.text());
              if (res.email)
              {
                  setMessage("An account with this email already exists");
              }
              else
              {
                  setEmailError(false);
                  setDisabled(true);
                  props.sendEmailPressed();
                  props.setIsRegistering(true);
              }
              setDisabled(false);
          });
      }
      catch(e)
      {
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
      containerStyle={LoginStyle.inputStyle}
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
          Next
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
        style={[Style.textDefaultDefault, Style.boldFont, LoginStyle.previousPageAction]}
        onPress={() => backToLogin()}
        >Login</_Text>
      </View>
    </View>
  );
};

export default Register;