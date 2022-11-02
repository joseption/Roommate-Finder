import React, { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import _Button from '../../components/control/button';
import _Text from '../../components/control/text';
import { config } from '../../service';
import { LoginStyle, Style } from '../../style';
import _TextInput from '../control/text-input';

const PasswordResetSent = (props: any, {navigation}:any) => {
  const [disabled,setDisabled] = useState(false);
  const [counter,setCounter] = useState('');
  const [message,setMessage] = useState('');

  const btnTimer = (disabled: boolean, time: number) => {
    let interval: any;
    if (disabled) {
      interval = setInterval(() => {
            if (Date.now() - time >= 60000) {
                setDisabled(false);
                setCounter("");
                clearInterval(interval);
            }
            else {
                setCounter("Try again in " + Math.abs(Math.round(60 - ((Date.now() - time) / 1000))) + " seconds");
                setDisabled(true);
            }
        }, 1000);
        props.setStopInterval(interval);
    }
    else {
        if (interval)
            clearInterval(interval);
        setCounter("");
        setDisabled(false);
    }
    return interval;
  }

  const disableBtn = (disable: boolean) => {
    setDisabled(disable);
    return btnTimer(disable, disable ? Date.now() : 0);
  }

  const goBackForgotPwd = () => {
    clearInterval(props.stopInterval);
    disableBtn(false);
    setMessage('');
    props.passwordPressed();
  }

  const doResendEmail = async () => 
  {
      if (disabled)
        return;

      let interval = disableBtn(true); 
      disableBtn(true);
      setMessage("");
      if (!props.email) {
          setMessage("You must use a valid email address");
          clearInterval(interval);
          disableBtn(false);
          return;
      }
      
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
                          setMessage("You must use a valid email address");
                          clearInterval(interval);
                      }
                      else
                          setMessage(res.error);

                      disableBtn(false);
                  }
              });
      }
      catch(e)
      {
          disableBtn(false);
          clearInterval(interval);
          setMessage("An error occurred while attempting to send a password reset email!");
          return;
      }    
  };
  
  return (
    <View
    style={props.style}>
      <_Text
      style={[Style.textHuge, Style.boldFont]}
      >
        Reset Link Sent
      </_Text>
      <_Text
      style={[Style.textDefaultTertiary, LoginStyle.actionText]}
      >
        Check your email for reset instructions
      </_Text>
      <View
      style={LoginStyle.mainContent}
      >
        <_Text
        style={[Style.textSmallSecondary, LoginStyle.resendText]}
        >
          Still haven't received an email yet?
        </_Text>
        <View
        style={Style.alignRight}
        >
          <_Button
          style={props.btnStyle(disabled)}
          onPress={() => doResendEmail()}
          value={!disabled ? 'Resend Email' : 'Email Sent'}
          disabled={disabled}
          >
          </_Button>
      </View>
      <_Text
        style={[Style.textTinyTertiary, LoginStyle.timerText]}
        >
          {counter}
        </_Text>
        <_Text
        style={LoginStyle.errorMessage}
        >
            {message}
      </_Text>
      </View>
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
        onPress={() => goBackForgotPwd()}
        >forgot password</_Text>
      </View>
    </View>
  );
};

export default PasswordResetSent;