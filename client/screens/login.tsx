import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Animated, Linking, Platform, SafeAreaView, Image, ScrollView } from 'react-native';
import _Button from '../components/control/button';
import _Image from '../components/control/image';
import _Text from '../components/control/text';
import ActivateEmailSent from '../components/login/activate-email-sent';
import ForgotPassword from '../components/login/forgot-password';
import Login from '../components/login/login';
import PasswordResetSent from '../components/login/password-reset-sent';
import PasswordUpdated from '../components/login/password-updated';
import Register from '../components/login/register';
import UpdatePassword from '../components/login/update-password';
import { Color, LoginStyle, Radius, Style } from '../style';
import * as DeepLinking from 'expo-linking';
import { env } from '../helper';
import { verify } from 'crypto';

const LoginScreen = (props:any, {navigation}:any) => {
  enum screen {
    activateEmailSent,
    register,
    login,
    forgotPassword,
    passwordResetSent,
    updatePassword,
    passwordUpdated
  }

  const [init, setInit] = useState(false);
  const [initScreen, setInitScreen] = useState(false);
  const [width, setWidth] = useState(0);
  const [left, setLeft] = useState(0);
  const [opacity, setOpacity] = useState(0);
  const [moved, setMoved] = useState(false);
  const [activateEmailSent, setActivateEmailSent] = useState(false);
  const [register, setRegister] = useState(false);
  const [login, setLogin] = useState(false);
  const [forgotPassword, setForgotPassword] = useState(false);
  const [passwordResetSent, setPasswordResetSent] = useState(false);
  const [updatePassword, setUpdatePassword] = useState(false);
  const [passwordUpdated, setPasswordUpdated] = useState(false);
  const [currentScreen, setCurrentScreen] = useState(screen.login);
  const [emailValue, setEmailValue] = useState('');
  const [stopInterval,setStopInterval] = useState(-1);
  const [url,setUrl] = useState('');
  const [isRegistering,setIsRegistering] = useState(false);
  const [registerEmail, setRegisterEmail] = useState('');
  const [token, setToken] = useState('');
  const [autoResend, setAutoResend] = useState(false);

  useEffect(() => {
    if (!init) {
      setup();
      setInit(true);
    }
  }, [left, init]);

  const setup = () => {
    const oldOpacity = opacity;
    setOpacity(1);
    Animated.timing(new Animated.Value(oldOpacity), {
      toValue: 1,
      duration: 150,
      useNativeDriver: false,
    }).start();
  };

  const goLeft = (s: screen) => {
      setMoved(true);
      updateVisibleScreen(s, true);
      setLeft(-width - 42);
      Animated.timing(new Animated.Value(0), {
        toValue: left,
        duration: 150,
        useNativeDriver: false,
      }).start();

       setTimeout(() => {
        setMoved(false);
        updateVisibleScreen(s);
        setLeft(0);
        Animated.timing(new Animated.Value(-width - 42), {
          toValue: 0,
          duration: 0,
          useNativeDriver: false,
        }).start();
       }, 25);
  };
    
  const goRight = (s: screen) => {
      setMoved(true);
      updateVisibleScreen(s, true);
      setLeft(width + 42);
      Animated.timing(new Animated.Value(0), {
      toValue: left,
      duration: 150,
      useNativeDriver: false,
      }).start();

       setTimeout(() => {
        setMoved(false);
        updateVisibleScreen(s);
        setLeft(0);
        Animated.timing(new Animated.Value(width + 42), {
          toValue: 0,
          duration: 0,
          useNativeDriver: false,
        }).start();
      }, 25);
  };

  const hasValidToken = async (token: any, type: any) => 
  {
      let isValid = false;

      try
      {    
          if (type == "confirm") {
            let obj = {emailToken:token};
            let js = JSON.stringify(obj);
            
            await fetch(`${env.URL}/auth/confirmEmail`,
            {method:'POST',body:js,headers:{'Content-Type': 'application/json'}}).then(async ret => {
                let res = JSON.parse(await ret.text());
                if (!res.Error) {
                    isValid = true;
                }
            });
          }
          else if (type == "reset") {
            let obj = {resetToken:token};
            let js = JSON.stringify(obj);  
                  
            await fetch(`${env.URL}/auth/validateResetToken`,
            {method:'POST',body:js,headers:{'Content-Type': 'application/json'}}).then(async ret => {
                let res = JSON.parse(await ret.text());
                if (!res.Error) {
                    isValid = true;
                }
            });
          }
      }
      catch(e)
      {
        // Do stuff
      }    
      return isValid;
  };

  const getType = (url: string) => {
    if (url.includes("confirmEmail"))
      return "confirm";
    else if (url.includes("reset"))
      return "reset";
    else if (url.includes("update"))
      return "update";
  }

  const gotoScreen = async (url: string) => {
      if (url != null && (url.includes("confirmEmail?token=") ||
            url.includes("reset?token=") ||
            url.includes("update?token="))) {
        let type = getType(url) as string;
        let uToken;
        let uEmail;
        var params = DeepLinking.parse(url);
        if (params.queryParams?.token) {
          uToken = params.queryParams.token as string;
          setToken(uToken);
        }
        if (params.queryParams?.email) {
          uEmail = params.queryParams.email as string;
          setRegisterEmail(params.queryParams?.email as string);
        }
        if (await hasValidToken(uToken, type)) {
          if (type == "confirm")
            setIsRegistering(true);
          updateVisibleScreen(screen.updatePassword);
        }
        else {
          if (type == "confirm") {
            setEmailValue(uEmail as string);
            setAutoResend(true);
            setIsRegistering(true);
            updateVisibleScreen(screen.activateEmailSent);
          }
          else if (type == "reset")
          // JA TODO NEED TO SETUP FAIL CASE LIKE CONFIRM
            updateVisibleScreen(screen.passwordResetSent);
        }
      }
      else
        updateVisibleScreen(screen.login);

    setInitScreen(true);
  }

  const updateVisibleScreen = (s: screen, delay = false) => {
    setActivateEmailSent(s == screen.activateEmailSent || delay && currentScreen == screen.activateEmailSent);
    setRegister(s == screen.register || delay && currentScreen == screen.register);
    setLogin(s == screen.login || delay && currentScreen == screen.login);
    setForgotPassword(s == screen.forgotPassword || delay && currentScreen == screen.forgotPassword);
    setPasswordResetSent(s == screen.passwordResetSent || delay && currentScreen == screen.passwordResetSent);
    setUpdatePassword(s == screen.updatePassword || delay && currentScreen == screen.updatePassword);
    setPasswordUpdated(s == screen.passwordUpdated || delay && currentScreen == screen.passwordUpdated);
    setCurrentScreen(s);
  }

  const getLeft = () => {
    if (!initScreen) {
      setUrl(props.url);
      gotoScreen(props.url);
    }
  }

  const setLayout = (e: any) => {
      setWidth(e.nativeEvent.layout.width);
      getLeft();
  }

  const style = () => {
    var style = [];
    style.push(styles.container);
    if (!props.mobile)
      style.push(styles.dialog);
    else {
      style.push(styles.full);
      style.push(styles.containerMobile);
    }

    return style
  }

  const btnStyle = (disabled: boolean) => {
    var style = [];
    style.push(LoginStyle.submitButton);
    if (disabled) {
      style.push(Style.buttonDisabled);
    }
    else {
      style.push(Style.buttonSuccess);
    }

    return style;
  }

  return (
      <View
      style={styles.outerContainer}
      >
        <View
        style={style()}
        >
          {props.mobile ?
          <_Image
          style={LoginStyle.logo}
          source={require('../assets/images/logo.png')}
          height={30}
          />
          : null
          }
          <Animated.View
          onLayout={(e) => setLayout(e)}
          style={[moved ? null : styles.animateContent, styles.content, {opacity: opacity, transform:[{translateX: left}]}]}>
              <ActivateEmailSent
                btnStyle={btnStyle}
                setStopInterval={setStopInterval}
                stopInterval={stopInterval}
                setEmail={setEmailValue}
                email={emailValue}
                registerPressed={() => goRight(screen.register)}
                style={[styles.panel, activateEmailSent ? null : styles.hidden]}
                autoResend={autoResend}
              />
              <Register
                btnStyle={btnStyle}
                setEmail={setEmailValue}
                email={emailValue}
                sendEmailPressed={() => goLeft(screen.activateEmailSent)} // update to do stuff and then goLeft(1)
                loginPressed={() => goRight(screen.login)}
                style={[styles.panel, register ? null : styles.hidden]}
                setIsRegistering={setIsRegistering}
              />
              <Login
                url={url}
                btnStyle={btnStyle}
                forgotPasswordPressed={() => goRight(screen.forgotPassword)}
                registerPressed={() => goLeft(screen.register)}
                style={[styles.panel, login ? null : styles.hidden]}
              />
              <ForgotPassword
                btnStyle={btnStyle}
                setEmail={setEmailValue}
                email={emailValue}
                sendEmailPressed={() => goRight(screen.passwordResetSent)} // update to do stuff and then goRight(1)
                loginPressed={() => goLeft(screen.login)}
                style={[styles.panel, forgotPassword ? null : styles.hidden]}
              />
              <PasswordResetSent
                btnStyle={btnStyle}
                setStopInterval={setStopInterval}
                stopInterval={stopInterval}
                passwordPressed={() => goLeft(screen.forgotPassword)}
                style={[styles.panel, passwordResetSent ? null : styles.hidden]}
                email={emailValue}
              />
              <UpdatePassword
                btnStyle={btnStyle}
                updatePasswordPressed={() => goRight(screen.passwordUpdated)} // update to do stuff and then goRight(1)
                loginPressed={() => goLeft(screen.login)}
                style={[styles.panel, updatePassword ? null : styles.hidden]}
                isRegistering={isRegistering}
                setIsRegistering={setIsRegistering}
                email={emailValue}
                setEmail={setEmailValue}
                registerPressed={() => goLeft(screen.register)}
                registerEmail={registerEmail}
                token={token}
              />
              <PasswordUpdated
                loginPressed={() => goLeft(screen.login)}
                style={[styles.panel, passwordUpdated ? null : styles.hidden]}
              />
            </Animated.View>
          </View>
      </View>
  );
};

export const styles = StyleSheet.create({
    outerContainer: {
      ...Platform.select({
        web: {
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          height: '100%',
        },
      }),
    },
    container: {
      backgroundColor: Color.white,
      margin:'auto',
      overflow:'hidden',
      height: '100%',
      padding: 10,
    },
    containerMobile: {
      paddingLeft:10,
      paddingRight:10,
      paddingTop: 40,
      paddingBottom: 40,
    },
    dialog: {
      opacity:.95,
      minWidth:400,
      minHeight:600,
      maxWidth:400,
      maxHeight:600,
      borderRadius:Radius.large,
      borderColor:Color.border,
      borderWidth: 1,
      shadowColor: Color.borderSecondary,
      shadowOffset: {width: -3, height: 3},
      shadowOpacity: 1,
      shadowRadius: 0,
      padding: 40
    },
    full: {
      width:'100%',
      display: 'flex',
      ...Platform.select({
        web: {
          justifyContent: 'space-between'
        }
      }),
    },
    content: {
        display:'flex',
        flexDirection: 'row',
        width:'100%',
        flex: 1,
        marginLeft: -21
    },
    animateContent: {
      ...Platform.select({
        web: {
          transition: 'transform .15s ease, opacity 2s ease', // JA this is temporary and needs to be replaced with animation
        }
      }),
    },
    panel: {
        width:'100%',
        marginLeft: 21,
        marginRight: 21,
    },
    hidden: {
      display: 'none'
    }
  });

export default LoginScreen;