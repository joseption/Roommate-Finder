import { setDefaultResultOrder } from 'dns';
import { setStatusBarStyle } from 'expo-status-bar';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Pressable, StyleSheet, Text, View, Animated, Dimensions, Image, Linking } from 'react-native';
import _Button from '../components/control/button';
import _Text from '../components/control/text';
import ActivateEmailSent from '../components/login/activate-email-sent';
import ForgotPassword from '../components/login/forgot-password';
import Login from '../components/login/login';
import PasswordResetSent from '../components/login/password-reset-sent';
import PasswordUpdated from '../components/login/password-updated';
import Register from '../components/login/register';
import UpdatePassword from '../components/login/update-password';
import { isMobile } from '../service';
import { Color, LoginStyle, Radius, Style } from '../style';

const LoginScreen = ({navigation}:any) => {
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
  const [style, setStyle] = useState({});
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

  useEffect(() => {
    if (!init) {
      getStyle();
      setup();
    }
    const subscription = Dimensions.addEventListener(
      "change",
      () => {
        getStyle();
      }
    );

    if (!init)
      setInit(true);

    return () => subscription?.remove();
  }, [style, left]);

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

  const gotoScreen = (url: string) => {
    if (url.endsWith("/login"))
      updateVisibleScreen(screen.login);
    else if (url.includes("activate_id=") ||
            url.includes("reset_id=") ||
            url.includes("update_id=")) {
      updateVisibleScreen(screen.updatePassword);
    }

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
      Linking.getInitialURL().then((url: any) => {
        setUrl(url);
        gotoScreen(url);
      }).catch(() => gotoScreen(''))
    }
  }

  const setLayout = (e: any) => {
      setWidth(e.nativeEvent.layout.width);
      getLeft();
  }

  const getStyle = () => {
    var s = [];
    s.push(styles.container);
    if (!isMobile())
      s.push(styles.dialog);
    else
      s.push(styles.full);

    setStyle(s);
  }

  const btnStyle = (disabled) => {
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
    <View style={style}>
        {isMobile() ?
        <Image
        style={LoginStyle.logo}
        source={require('../assets/images/logo.png')} />
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
            />
            <Register
              btnStyle={btnStyle}
              setEmail={setEmailValue}
              email={emailValue}
              sendEmailPressed={() => goLeft(screen.activateEmailSent)} // update to do stuff and then goLeft(1)
              loginPressed={() => goRight(screen.login)}
              style={[styles.panel, register ? null : styles.hidden]}
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
            />
            <UpdatePassword
              btnStyle={btnStyle}
              updatePasswordPressed={() => goRight(screen.passwordUpdated)} // update to do stuff and then goRight(1)
              loginPressed={() => goLeft(screen.login)}
              style={[styles.panel, updatePassword ? null : styles.hidden]}
            />
            <PasswordUpdated
              loginPressed={() => goLeft(screen.login)}
              style={[styles.panel, passwordUpdated ? null : styles.hidden]}
            />
        </Animated.View>
    </View>
  );
};

export const styles = StyleSheet.create({
    container: {
      backgroundColor: Color.white,
      margin:'auto',
      overflow:'hidden',
      padding:40,
      height: '100%'
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
    },
    full: {
      width:'100%',
      display: 'flex',
      justifyContent: 'space-between'
    },
    content: {
        display:'flex',
        flexDirection: 'row',
        width:'100%',
        gap: 42,
        flex: 1,
    },
    animateContent: {
      transition: 'transform .15s ease, opacity 2s ease',
    },
    panel: {
        width:'100%'
    },
    hidden: {
      display: 'none'
    }
  });

export default LoginScreen;