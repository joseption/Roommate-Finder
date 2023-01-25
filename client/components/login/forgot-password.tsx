import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import _Button from '../../components/control/button';
import _Text from '../../components/control/text';
import { config, env, validateEmail } from '../../helper';
import { LoginStyle, Style } from '../../style';
import _TextInput from '../control/text-input';

const ForgotPassword = (props: any, {navigation}:any) => {
    const [message,setMessage] = useState('');
    const [disabled,setDisabled] = useState(true);
    const [emailError,setEmailError] = useState(false);
    const [loading,setLoading] = useState(false);

    const backToLogin = () => {
        setMessage('');
        props.setEmail('');
        setDisabled(true);
        setEmailError(false);
        props.loginPressed();
    };

    const handleChange = (value: string) => {
        var error = !validateEmail(value);
        setDisabled(false); // JA TEMP put back "error"
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
      style={[Style.textHuge, Style.boldFont]}
      >
        Forgot Password
      </_Text>
      <_Text
      style={[Style.textDefaultTertiary, LoginStyle.actionText]}
      >
        Request a password reset link
      </_Text>
      <_TextInput
      label="Email"
      containerStyle={LoginStyle.inputStyle}
      onChangeText={(e: any) => {handleChange(e)}}
      value={props.email}
      error={emailError}
      onSubmit={doSendEmail}
      />
      <View
      style={Style.alignRight}
      >
        <_Button
        style={props.btnStyle(disabled)}
        onPress={() => doSendEmail()}
        disabled={disabled}
        loading={loading}
        >
          Send Email
        </_Button>
      </View>
      <_Text
      style={LoginStyle.errorMessage}
      >
        {(!message && props.forgotError) ? props.forgotError : message}
      </_Text>
        <View
        style={LoginStyle.previousPageText}
        >
        <_Text
        style={Style.textDefaultTertiary}
        >
          Go back to
        </_Text>
        <_Text
        style={[Style.textDefaultDefault, Style.boldFont, LoginStyle.previousPageAction]}
        onPress={() => backToLogin()}
        >login</_Text>
      </View>
    </View>
  );
};

export default ForgotPassword;