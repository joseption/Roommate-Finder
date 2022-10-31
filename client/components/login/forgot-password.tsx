import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import _Button from '../../components/control/button';
import _Text from '../../components/control/text';
import { config, validateEmail } from '../../service';
import { LoginStyle, Style } from '../../style';
import _TextInput from '../control/textinput';

const ForgotPassword = (props: any, {navigation}:any) => {
    const [message,setMessage] = useState('');
    const [disabled,setDisabled] = useState(true);
    const [emailError,setEmailError] = useState(false);

    const TEMP = () => {
      props.setEmail('');
      setDisabled(true);
      setEmailError(false);
      props.sendEmailPressed();
    }

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
        if (disabled)
          return;
        
        props.setEmail(props.email);
        setDisabled(true);
        setMessage("");
        setEmailError(false);

        let obj = {email:props.email};
        let js = JSON.stringify(obj);

        try
        {    
            await fetch(`${config.URL}/api/send-password-reset`,
                {method:'POST',body:js,headers:{'Content-Type': 'application/json'}}).then(async ret => {
                    let res = JSON.parse(await ret.text());
                    if(res.error)
                    {
                        if (res.error === "Invalid Email") {
                            setMessage("You must enter a valid email address");
                        }
                        else
                            setMessage(res.error);

                        setEmailError(true);
                        setDisabled(false);
                    }
                    else
                    {
                        props.setEmail('');
                        setDisabled(true);
                        setEmailError(false);
                        props.sendEmailPressed();
                    }

                    setDisabled(false);
                });
        }
        catch(e)
        {
            TEMP(); // JA REMOVE
            setDisabled(false);
            setMessage("An unexpected error occurred while sending the password reset email. Please try again.");
            return;
        }    
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
        onPress={() => doSendEmail()}
        disabled={disabled}
        >
          Send Email
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
          Go back to
        </_Text>
        <_Text
        style={[Style.textDefaultDefault, Style.boldFont]}
        onPress={() => backToLogin()}
        >login</_Text>
      </View>
    </View>
  );
};

export default ForgotPassword;