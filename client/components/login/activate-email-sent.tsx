import React, { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import _Button from '../../components/control/button';
import _Text from '../../components/control/text';
import { env } from '../../helper';
import { Color, FontSize, LoginStyle, Radius, Style } from '../../style';
import _TextInput from '../control/text-input';

const ActivateEmailSent = (props: any, {navigation}:any) => {
  const [disabled,setDisabled] = useState(false);
  const [counter,setCounter] = useState('');
  const [message,setMessage] = useState('');
  const [sentMsg,setSentMsg] = useState('');
  const [autoResent,setAutoResent] = useState(false);
  const [loading,setLoading] = useState(false);

  useEffect(() => {
      if (props.autoResend)
          setSentMsg(`The verification link either doesn't exist or has expired. A new email with a link to activate your account has been sent to you.`);
      else
          setSentMsg(`You're just a step away from finding your ideal roommates! An email with a link to activate your account has been sent to you.`);

      if (!autoResent && props.autoResend) {
        setAutoResent(true);
        doResendEmail(true);
        disableBtn(false);
      }
  }, [props.autoResend]);

  const btnTimer = (disabled: boolean, time: number, force: boolean = false) => {
    let interval: any;
    if (disabled) {
      interval = setInterval(() => {
            if (Date.now() - time >= 60000) {
                setDisabled(false);
                setCounter("");
                clearInterval(interval);
            }
            else if (!force) {
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

  const disableBtn = (disable: boolean, force: boolean = false) => {
      if (!force)
        setDisabled(disable);
      return btnTimer(disable, disable ? Date.now() : 0, force);
  }

  const goBackRegister = () => {
    clearInterval(props.stopInterval);
    disableBtn(false);
    setMessage('');
    props.registerPressed();
  }

  const doResendEmail = async (force: boolean = false) => 
  {
      setLoading(true);
      if (disabled)
        return;

      let interval = disableBtn(true, force);
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
          await fetch(`${env.URL}/auth/sendConfirmationEmail`,
              {method:'POST',body:js,headers:{'Content-Type': 'application/json'}}).then(async ret => {
                  let res = JSON.parse(await ret.text());
                  if(res.error)
                  {
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
        {!props.autoResend ? "Activation Email Sent" : "Activation Email Resent"}
      </_Text>
      <_Text
      style={[Style(props.isDarkMode).textDefaultTertiary, LoginStyle(props.isDarkMode).actionText]}
      >
        Check your email to verify your account
      </_Text>
      <View
      style={styles.container}
      >
        <_Text
        style={styles.msgHeaderText}
        >
          {!props.autoResend ? 'Almost there!' : 'Let\'s try this again...' }
        </_Text>
        <_Text
        style={styles.msgText}
        >
          {sentMsg}
        </_Text>
      <View>
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
          style={[props.btnStyle(disabled), styles.btn]}
          onPress={() => doResendEmail()}
          disabled={disabled}
          loading={loading}
          >
          Resend Email
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
      </View>
        <_Text
        style={LoginStyle(props.isDarkMode).errorMessage}
        >
            {message}
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
        onPress={() => goBackRegister()}
        >register</_Text>
      </View>
    </View>
  );
};

export default ActivateEmailSent;