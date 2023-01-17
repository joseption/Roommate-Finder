import { useNavigation } from '@react-navigation/native';
import React, { useCallback, useEffect, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { perPlatformTypes } from 'react-native-document-picker/lib/typescript/fileTypes';
import _Button from '../../components/control/button';
import _Text from '../../components/control/text';
import { config, env, getLocalStorage, navProp, NavTo, setLocalStorage, validateEmail } from '../../helper';
import { LoginStyle, Style } from '../../style';
import _Checkbox from '../control/checkbox';
import _TextInput from '../control/text-input';

const Login = (props: any) => {
  const [email,setEmail] = useState('');
  const [password,setPassword] = useState('');
  const [disabled, setDisabled] = useState(true);
  const [message, setMessage] = useState('');
  const [emailError,setEmailError] = useState(false);
  const [passwordError,setPasswordError] = useState(false);
  const [init,setInit] = useState(false);
  const navigation = useNavigation<navProp>();

  useEffect(() => { 
    if (!init) {
      verifyLogin();
      setInit(true);
    }
  }, [props.url, message]);

  const verifyLogin = async () => {
    let user = await getLocalStorage();
    if (user && user.refreshToken) {
      navigateToLast(user);
    }
  }

  const expired = () => {
    return props.url && props.url.toLowerCase().endsWith("/login?timeout=yes")
  }

  const handleChange = (value: string, isEmail: boolean) => {
    let eValue = isEmail ? value : email;
    let pValue = !isEmail ? value : password;
    //let emailError = !(validateEmail(eValue)); ja temp
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

  // ja needs to be properly tested that all routes lead where they should
  const navigateToLast = (data: any) => {
    if (data.user.is_setup) {
      if (data.next_question_id) {
        if (data.user.setup_step == "skip_survey" && data.init_question_count == 0)
          navigation.navigate(NavTo.Explore);
        else
          navigation.navigate(NavTo.Survey, {question: data.next_question_id} as never);
      }
      else {
        navigation.navigate(NavTo.Matches);
      }
    }
    else {
      navigation.navigate(NavTo.Account, {view: data.user.setup_step} as never);
    }
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
          await fetch(`${env.URL}/auth/login`,
          {method:'POST',body:js,headers:{'Content-Type': 'application/json'}}).then(async ret => {
              let res = JSON.parse(await ret.text());
              if (res.Error)
              {
                setMessage(res.Error);
              }
              else
              {
                await setLocalStorage(res);
                setMessage('');
                navigateToLast(res);
              }
          });
      }
      catch(e: any)
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
      containerStyle={LoginStyle.inputStyle}
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
        {!message && expired() ? "Your session has expired, please login" : message}
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
          style={[Style.textDefaultDefault, Style.boldFont, LoginStyle.previousPageAction]}
          onPress={() => goRegister()}
          >
            Sign up
          </_Text>
      </View>
    </View>
  );
};

export default Login;