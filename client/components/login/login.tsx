import React, { useCallback, useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import _Button from '../../components/control/button';
import _Text from '../../components/control/text';
import { LoginStyle, Style } from '../../style';
import _TextInput from '../control/textinput';

const Login = (props: any, {navigation}:any) => {
  const [emailValue,setEmailValue] = useState('');
  const [passwordValue,setPasswordValue] = useState('');

  // const checkDisabledBtn = useCallback((type: string, ) => {
  //     let emailError = !(validateEmail(emailValue));
  //     let passwordError = loginPassword.value.length === 0;
  //     if (type === 'email')
  //         props.setError([{el:email, isError:!emailError ? false : true}]);
  //     else if (type === 'password')
  //         props.setError([{el:loginPassword, isError:passwordError}]);

  //     setDisabled(emailError || passwordError);
  //     return emailError || passwordError;
  // });

  const [disabled, setDisabled] = useState(true);
  const [message, setMessage] = useState('');

  // useEffect(() => {    
  //     // var mTimeout = searchParams.get("timeout");
  //     // if (mTimeout !== "yes") {
  //     //     var info = JSON.parse(localStorage.getItem('user_data'));
  //     //     if (info && !!info.id) {
  //     //         window.location.href = '/profile';
  //     //     }
  //     //}

  //     checkDisabledBtn(emailValue);
  //     checkDisabledBtn(passwordValue);

  //     var timeout = searchParams.get("timeout");
  //     if (timeout === "yes") {
  //       setMessage("Your session has expired, please login");
  //     }
  // }, [email, loginPassword, checkDisabledBtn, searchParams]);

  // const handleChange = (type) => {
  //     checkDisabledBtn(type);
  // };

  // const showScreen = () => {
  //     setMessage("");
  //     email.value = "";
  //     loginPassword.value = "";
  //     setDisabled(true);
  //     props.setError([{el:email, isError:false}, {el:loginPassword, isError:false}]);
  //     props.setScreen(screen);
  // };

  // const doLogin = async (event: any) => 
  // {
  //     event.preventDefault();
  //     if (checkDisabledBtn())
  //         return;

  //     let obj = {email:email.value,password:loginPassword.value};
  //     let js = JSON.stringify(obj);

  //     try
  //     {   
  //         await fetch(`${config.URL}/api/login`,
  //         {method:'POST',body:js,headers:{'Content-Type': 'application/json'}}).then(async ret => {
  //             let res = JSON.parse(await ret.text());
  //             if (res.error)
  //             {
  //                 setMessage(res.error);
  //             }
  //             else
  //             {
  //                 let user = {id:res.id, user_id:res.user_id, email:res.email, auth: res.token};
  //                 localStorage.setItem('user_data', JSON.stringify(user));

  //                 setMessage('');
  //                 window.location.href = "/profile";
  //             }
  //         });
  //     }
  //     catch(e)
  //     {
  //         setMessage('An unknown error occurred');
  //         return;
  //     }    
  // };
  
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
      />
      <_TextInput
      type="password"
      label="Password"
      />
      <_Text
      style={[Style.textSmallDefault, LoginStyle.rightTextHint]}
      onPress={() => props.forgotPasswordPressed()}
      >
        Forgot Password?
      </_Text>
      <View
      style={Style.alignRight}
      >
        <_Button
        style={props.btnStyle(disabled)}
        onPress={() => props.loginPressed()}
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
        onPress={() => props.registerPressed()}
        >Sign up</_Text>
      </View>
    </View>
  );
};

export default Login;