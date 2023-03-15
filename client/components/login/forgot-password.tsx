import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
import _Button from '../../components/control/button';
import _Text from '../../components/control/text';
import { env, validateEmail } from '../../helper';
import { LoginStyle, Style } from '../../style';
import _TextInput from '../control/text-input';

const ForgotPassword = (props: any, {navigation}:any) => {
    const [message,setMessage] = useState('');
    const [disabled,setDisabled] = useState(true);
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
        setDisabled(true);
        setEmailError(false);
        props.loginPressed();
    };

    const handleChange = (value: string) => {
        var error = !validateEmail(value);
        setDisabled(error);
        props.setEmail(value);
    };

    const doSendEmail = async () => 
    {
        setLoading(true);
        setEmailError(false);

        if (disabled) {
          setEmailError(!props.email);
          return;
        }
        
        props.setEmail(props.email);
        setDisabled(true);
        setMessage("");
        setEmailError(false);

        let obj = {email:props.email};
        let js = JSON.stringify(obj);

        try
        {    
            await fetch(`${env.URL}/auth/resetPassword`,
                {method:'POST',body:js,headers:{'Content-Type': 'application/json'}}).then(async ret => {
                    let res = JSON.parse(await ret.text());
                    if(res.Error)
                    {
                        setMessage(res.Error);
                        setDisabled(false);
                    }
                    else
                    {
                        setDisabled(true);
                        props.sendEmailPressed();
                    }

                    setDisabled(false);
                });
        }
        catch(e)
        {
            setDisabled(false);
            setMessage("An unexpected error occurred while sending the password reset email. Please try again.");
        }    
        setLoading(false);
    };

  return (
    <View
    style={props.style}>
      <_Text
      style={[Style(props.isDarkMode).textHuge, Style(props.isDarkMode).boldFont]}
      >
        Forgot Password
      </_Text>
      <_Text
      style={[Style(props.isDarkMode).textDefaultTertiary, LoginStyle(props.isDarkMode).actionText]}
      >
        Request a password reset link
      </_Text>
      <_TextInput
      label="Email"
      containerStyle={LoginStyle(props.isDarkMode).inputStyle}
      onChangeText={(e: any) => {handleChange(e)}}
      value={props.email}
      error={emailError}
      onSubmit={doSendEmail}
      isDarkMode={props.isDarkMode}
      />
      <View
      style={Style(props.isDarkMode).alignRight}
      >
        <_Button
        isDarkMode={props.isDarkMode}
        style={props.btnStyle(disabled)}
        onPress={() => doSendEmail()}
        disabled={disabled}
        loading={loading}
        >
          Send Email
        </_Button>
      </View>
      <_Text
      style={LoginStyle(props.isDarkMode).errorMessage}
      >
        {(!message && props.forgotError) ? props.forgotError : message}
      </_Text>
        <View
        style={LoginStyle(props.isDarkMode).previousPageText}
        >
        <_Text
        style={Style(props.isDarkMode).textDefaultTertiary}
        >
          Go back to
        </_Text>
        <_Text
        style={[Style(props.isDarkMode).textDefaultDefault, Style(props.isDarkMode).boldFont, LoginStyle(props.isDarkMode).previousPageAction]}
        onPress={() => backToLogin()}
        >login</_Text>
      </View>
    </View>
  );
};

export default ForgotPassword;