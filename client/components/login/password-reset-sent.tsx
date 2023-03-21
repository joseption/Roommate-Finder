import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import _Button from '../../components/control/button';
import _Text from '../../components/control/text';
import { env } from '../../helper';
import { Color, FontSize, LoginStyle, Radius, Style } from '../../style';
import _TextInput from '../control/text-input';

const PasswordResetSent = (props: any, {navigation}:any) => {
  const [disabled,setDisabled] = useState(false);
  const [counter,setCounter] = useState('');
  const [message,setMessage] = useState('');
  const [loading,setLoading] = useState(false);

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
    setLoading(true);
    let interval: any;
      if (disabled)
        return;

      if (!props.email) {
          setMessage("You must use a valid email address");
          disableBtn(false);
          return;
      }
      else {
        interval = disableBtn(true);
        setMessage("");
      }
      
      let obj = {email:props.email};
      let js = JSON.stringify(obj);

      try
      {    
          await fetch(`${env.URL}/auth/resetPassword`,
              {method:'POST',body:js,headers:{'Content-Type': 'application/json'}}).then(async ret => {
                  let res = JSON.parse(await ret.text());
                  if (res.Error)
                  {
                      if (res.Error === "Invalid Email") {
                          setMessage("You must use a valid email address");
                          clearInterval(interval);
                      }
                      else
                          setMessage(res.Error);

                      disableBtn(false);
                  }
              });
      }
      catch(e)
      {
          disableBtn(false);
          clearInterval(interval);
          setMessage("An error occurred while attempting to send a password reset email.");
      }  
      setLoading(false);  
  };

  const styles = StyleSheet.create({
    btn: {
      marginBottom: 5
    },
    container: {
      padding: 20,
      backgroundColor: Color(props.isDarkMode).contentHolder,
      borderRadius: Radius.default,
    },
    timerText: {
      marginTop: 5,
      marginRight: 0,
      marginLeft: 'auto',
    },
    msgText: {
      fontSize: FontSize.default,
      marginBottom: 40,
      color: Color(props.isDarkMode).text,
    },
    msgHeaderText: {
      fontSize: FontSize.large,
      color: Color(props.isDarkMode).text,
      fontWeight: 'bold',
      marginBottom: 5
    }
  });
  
  return (
    <View
    style={props.style}>
      <_Text
      style={[Style(props.isDarkMode).textHuge, Style(props.isDarkMode).boldFont]}
      >
        Reset Link Sent
      </_Text>
      <_Text
      style={[Style(props.isDarkMode).textDefaultTertiary, LoginStyle(props.isDarkMode).actionText]}
      >
        Check your email for reset instructions
      </_Text>
      <View>
        <View
        style={styles.container}
        >
          <_Text
          style={styles.msgHeaderText}
          >
            Almost there!
          </_Text>
          <_Text
          style={styles.msgText}
          >
            You're just a step away from getting back into your account! A password reset link was sent to your inbox.
          </_Text>
          <_Text
          style={[Style(props.isDarkMode).textSmallSecondary, LoginStyle(props.isDarkMode).resendText]}
          >
            Still haven't received an email yet?
          </_Text>
          <View
          style={Style(props.isDarkMode).alignRight}
          >
            <_Button
            isDarkMode={props.isDarkMode}
            style={props.btnStyle(disabled)}
            onPress={() => doResendEmail()}
            value={!disabled ? 'Resend Email' : 'Email Sent'}
            disabled={disabled}
            loading={loading}
            >
            </_Button>
        </View>
        {counter ?
        <_Text
          style={[Style(props.isDarkMode).textTinyTertiary, styles.timerText]}
          >
            {counter}
          </_Text>
        : null }
        </View>
        <_Text
        style={LoginStyle(props.isDarkMode).errorMessage}
        >
            {message}
      </_Text>
      </View>
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
        onPress={() => goBackForgotPwd()}
        >forgot password</_Text>
      </View>
    </View>
  );
};

export default PasswordResetSent;