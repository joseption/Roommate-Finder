import React, { useCallback, useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import _Button from '../../components/control/button';
import _Text from '../../components/control/text';
import { config, env, validateEmail } from '../../helper';
import { LoginStyle, Style } from '../../style';
import _Checkbox from '../control/checkbox';
import _TextInput from '../control/text-input';

const Login = (props: any, {navigation}:any) => {
  const [email,setEmail] = useState('');
  const [password,setPassword] = useState('');
  const [disabled, setDisabled] = useState(true);
  const [message, setMessage] = useState('');
  const [emailError,setEmailError] = useState(false);
  const [passwordError,setPasswordError] = useState(false);

  useEffect(() => {    
      if (props.url.includes("timeout=yes")) {
        setMessage("Your session has expired, please login");
      }
  }, [props.url]);

  const handleChange = (value: string, isEmail: boolean) => {
    let eValue = isEmail ? value : email;
    let pValue = !isEmail ? value : password;
    let emailError = !(validateEmail(eValue));
    let passwordError = pValue.length == 0;
    setPassword(pValue);
    setEmail(eValue);

    setDisabled(emailError || passwordError);
  };

  const goRegister = () => {
    setMessage('');
    setEmail('');
    setPassword('');
    setDisabled(true);
    setEmailError(false);
    setPasswordError(false);
    props.registerPressed();
};

  const doLogin = async () => 
  {
      if (disabled)
        return;

      setMessage('');
      let obj = {email:email,password:password};
      let js = JSON.stringify(obj);

      try
      {   
          await fetch(`${env.URL}/api/login`,
          {method:'POST',body:js,headers:{'Content-Type': 'application/json'}}).then(async ret => {
              let res = JSON.parse(await ret.text());
              if (res.error)
              {
                  setMessage(res.error);
              }
              else
              {
                  let user = {id:res.id, user_id:res.user_id, email:res.email, auth: res.token};
                  //localStorage.setItem('user_data', JSON.stringify(user));

                  setMessage('');
                  //window.location.href = "/profile";
              }
          });
      }
      catch(e)
      {
          setMessage('An unknown error occurred');
          return;
      }    
  };
  
  return (
    <View
    style={props.style}>
      <_Text
      style={[Style.textHuge, Style.boldFont]}
      >
        Login
      </_Text>
      <_Text
      style={[Style.textDefaultTertiary, LoginStyle.actionText]}
      >
        Please sign in to continue
      </_Text>
      <_TextInput
      label="Email"
      style={LoginStyle.inputStyle}
      onChangeText={(e: any) => {handleChange(e, true)}}
      value={email}
      error={emailError}
      />
      <_TextInput
      type="password"
      label="Password"
      onChangeText={(e: any) => {handleChange(e, false)}}
      value={password}
      error={passwordError}
      />
      <_Text
      style={Style.textSmallDefault}
      onPress={() => props.forgotPasswordPressed()}
      containerStyle={LoginStyle.rightTextHint}
      >
        Forgot Password?
      </_Text>
      <View
      style={Style.alignRight}
      >
        <_Button
        style={props.btnStyle(disabled)}
        onPress={() => doLogin()}
        disabled={disabled}
        >
          Login
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
          Don't have an account?
        </_Text>
        <_Text
        style={[Style.textDefaultDefault, Style.boldFont]}
        onPress={() => goRegister()}
        >Sign up</_Text>
      </View>
    </View>
  );
};

export default Login;