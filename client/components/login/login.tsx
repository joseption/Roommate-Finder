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
  const [loading,setLoading] = useState(false);
  const navigation = useNavigation<navProp>();


  useEffect(() => { 
    if (!init) {
      verifyLogin();
      setInit(true);
    }
  }, [navigation, message]);

  const verifyLogin = async () => {
    let user = await getLocalStorage();
    if (user && user.refreshToken) {
      navigateToLast(user);
      markAsLoggedIn(user);
    }
  }

  const markAsLoggedIn = (data: any) => {
    props.setIsLoggedIn(true);
    if (data && data.user)
      props.setIsSetup(data.user.is_setup);
  }

  const route = () => {
    if (navigation) {
      let state = navigation.getState();
      if (state && state.routes) {
        let idx = state.index;
        if (!idx) {
            idx = state.routes.length - 1;
        }
        return state.routes[idx];
      }
    }

    return null;
  }

  const expired = () => {
    let rt = route();
    if (rt) {
      let expired = rt && rt.params && rt.params['timeout'] && (rt.params['timeout'] as string).toLowerCase().endsWith("yes");
      return expired;
    }

    return false;
  }

  const handleChange = (value: string, isEmail: boolean) => {
    let eValue = isEmail ? value : email;
    let pValue = !isEmail ? value : password;
    //let emailError = !(validateEmail(eValue)); // ja temp
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

  const navigateToLast = (data: any) => {
    if (data && data.user) {
      if (data.user.is_setup) {
        navigation.reset({
          index: 0,
          routes: [{name: NavTo.Profile}],
        });
        if (data.user.setup_step == NavTo.Search)
          navigation.navigate(NavTo.Search);
        else if (data.user.setup_step == NavTo.Survey)
          navigation.navigate(NavTo.Survey);
        else
          navigation.navigate(NavTo.Search, {view: 'matches'} as never);
      }
      else {
        navigation.reset({
          index: 0,
          routes: [{name: NavTo.Account}],
        });
        let step = data.user.setup_step;
        if (!step)
          step = "info";
        navigation.navigate(NavTo.Account, {view: step} as never);
      }
      let name = route()?.name;
      if (name)
        props.setNavSelector(name);
    }
  };

  const doLogin = async () => 
  {
    setLoading(true);
    setEmailError(false);
    setPasswordError(false);

      if (disabled) {
        setEmailError(!email);
        setPasswordError(!password);
        return;
      }

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
                markAsLoggedIn(res);
              }
          });
      }
      catch(e: any)
      {
          setMessage('An unknown error occurred');
      }    
      setLoading(false);
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
      keyboardType='email-address'
      />
      <_TextInput
      type="password"
      label="Password"
      onChangeText={(e: any) => {handleChange(e, false)}}
      value={password}
      error={passwordError}
      onSubmit={doLogin}
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
        loading={loading}
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