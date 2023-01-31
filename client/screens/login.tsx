import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Animated, Platform, ActivityIndicator } from 'react-native';
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
import { env, LoginNavTo, navProp, NavTo } from '../helper';
import { useNavigation } from '@react-navigation/native';

const LoginScreen = (props:any) => {
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
  const [currentScreen, setCurrentScreen] = useState(LoginNavTo.Login);
  const [emailValue, setEmailValue] = useState('');
  const [stopInterval,setStopInterval] = useState(-1);
  const [url,setUrl] = useState('');
  const [passwordUpdateType,setPasswordUpdateType] = useState('');
  const [registerEmail, setRegisterEmail] = useState('');
  const [token, setToken] = useState('');
  const [autoResend, setAutoResend] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [forgotError, setForgotError] = useState('');
  const navigation = useNavigation<navProp>();

  useEffect(() => {
    if (!init) {
      setup();
      setInit(true);
    }
    else if (props.accountAction) {
      gotoScreen();
      if (props.accountAction)
        props.setAccountAction(false);
    }
    let rt = route();
    if (rt && rt.name == NavTo.Login && rt.params && rt.params['view']) {
      let email = rt.params['email'];
      if (email) {
        setEmailValue((email));
      }
      let view = rt.params['view'];
      if (view as typeof LoginNavTo && currentScreen != view && view != LoginNavTo.Login) {
        updateVisibleScreen(view, false);
      }
    }
    else if (props.loginViewChanged) {
      let uView = props.loginViewChanged;
      if (uView == 'login')
        uView = '';
      updateVisibleScreen(uView, false);
      props.setLoginViewChanged('');
    }
  }, [left, init, navigation, props.accountAction, currentScreen, props.loginViewChanged]);

  const setup = () => {
    const oldOpacity = opacity;
    setOpacity(1);
    Animated.timing(new Animated.Value(oldOpacity), {
      toValue: 1,
      duration: 150,
      useNativeDriver: false,
    }).start();
  };

  const goLeft = (s: typeof LoginNavTo) => {
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
    
  const goRight = (s: typeof LoginNavTo) => {
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
          if (type == "confirmEmail") {
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
          else if (type == "reset" || type == "update" ) {
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
      catch(e) {}    

      return isValid;
  };

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

  const gotoScreen = async () => {
    setIsLoading(true);
    let rt = route();
    let timeout;
    if (rt && rt.name == NavTo.Login && rt.params) {
      if (rt.params['timeout'])
        timeout = rt.params['timeout'];
      if (!timeout) {
        let uToken = rt.params['token'];
        let uEmail = rt.params['email'];
        let uPath = rt.params['path'];
        if (uToken) {
          setToken(uToken);
          if (uEmail) {
            uEmail = rt.params['email'];
            setRegisterEmail(uEmail);
          }
          setPasswordUpdateType(uPath);
          if (await hasValidToken(uToken, uPath)) {
            updateVisibleScreen(LoginNavTo.UpdatePassword);
          }
          else {
            if (uPath == "confirmEmail") {
              setEmailValue(uEmail as string);
              setAutoResend(true);
              updateVisibleScreen(LoginNavTo.ActivateEmailSent);
            }
            else if (uPath == "reset") {
              updateVisibleScreen(LoginNavTo.ForgotPassword);
              setForgotError("Password reset failed, please enter your email and try again.");
            }
            else if (uPath == "update") {
              updateVisibleScreen(LoginNavTo.ForgotPassword);
              setForgotError("Password update failed, please enter your email and try again.");
            }
          }
        }
      }
      else {
        updateVisibleScreen(LoginNavTo.Login);
      }
    }
    else
      updateVisibleScreen(LoginNavTo.Login);

    setInitScreen(true);
    setIsLoading(false);
  }

  const updateVisibleScreen = (s: typeof LoginNavTo, delay = false) => {
    setActivateEmailSent(s == LoginNavTo.ActivateEmailSent || delay && currentScreen == LoginNavTo.ActivateEmailSent);
    setRegister(s == LoginNavTo.Register || delay && currentScreen == LoginNavTo.Register);
    setLogin(s == LoginNavTo.Login || delay && currentScreen == LoginNavTo.Login);
    setForgotPassword(s == LoginNavTo.ForgotPassword || delay && currentScreen == LoginNavTo.ForgotPassword);
    setPasswordResetSent(s == LoginNavTo.PasswordResetSent || delay && currentScreen == LoginNavTo.PasswordResetSent);
    setUpdatePassword(s == LoginNavTo.UpdatePassword || delay && currentScreen == LoginNavTo.UpdatePassword);
    setPasswordUpdated(s == LoginNavTo.PasswordUpdated || delay && currentScreen == LoginNavTo.PasswordUpdated);
    setCurrentScreen(s as never);
  }

  const getLeft = () => {
    if (!initScreen) {
      gotoScreen();
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
    //style.push(LoginStyle(props.isDarkMode).submitButton);
    if (disabled) {
      style.push(Style(props.isDarkMode).buttonDisabled);
    }
    else {
      style.push(Style(props.isDarkMode).buttonGold);
    }

    return style;
  }

  const passwordContainerStyle = () => {
    let style = [];
    style.push(styles.passwordPromptContainer);
    if (props.mobile) {
        style.push(styles.passwordPromptContainerMobile);
    }
    return style;
  }

  const passwordContentStyle = () => {
      let style = [];
      style.push(styles.passwordContainerContent);
      let top = props.scrollY ? props.scrollY : 0;
      style.push({
          top: top
      });
      return style;
  }

  const styles = StyleSheet.create({
    passwordPromptContainer: {
      backgroundColor: Color(props.isDarkMode).promptMaskMobile,
      height: '100%',
      width: '100%',
      position: 'absolute',
      top:0,
      left:0,
      zIndex:99,
      ...Platform.select({
          android: {
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center'
          }
      }),
  },
  passwordContainerContent: {
      ...Platform.select({
          web: {
              height: '100%'
          },
      }),
  },
  passwordPromptContainerMobile: {
      backgroundColor: Color(props.isDarkMode).whiteMask
  },
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
    backgroundColor: Color(props.isDarkMode).contentBackground,
    margin:'auto',
    overflow:'hidden',
    height: '100%',
    padding: 10,
  },
  containerMobile: {
    backgroundColor: Color(props.isDarkMode).contentBackgroundSecondary,
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
    borderColor:Color(props.isDarkMode).contentBackground,
    borderWidth: 1,
    shadowColor: Color(props.isDarkMode).holderSecondary,
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

  return (
      <View
      style={styles.outerContainer}
      >
        {isLoading ?
        <View
        style={passwordContainerStyle()}
        >
          <View
          style={passwordContentStyle()}
          >
                <ActivityIndicator
                size="large"
                color={Color(props.isDarkMode).gold}
                style={Style(props.isDarkMode).maskLoading}
                />  
          </View>
        </View>
        : null}
        <View
        style={style()}
        >
          {props.mobile ?
          <_Image
          style={LoginStyle(props.isDarkMode).logo}
          source={props.isDarkMode ? require('../assets/images/logo_w.png') : require('../assets/images/logo.png')}
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
                registerPressed={() => {
                    navigation.push(NavTo.Login, {view: LoginNavTo.Register, email: emailValue} as never);
                    goRight(LoginNavTo.Register);
                  }
                }
                style={[styles.panel, activateEmailSent ? null : styles.hidden]}
                autoResend={autoResend}
                isDarkMode={props.isDarkMode}
              />
              <Register
                btnStyle={btnStyle}
                setEmail={setEmailValue}
                email={emailValue}
                sendEmailPressed={() => {
                    navigation.push(NavTo.Login, {view: LoginNavTo.ActivateEmailSent, email: emailValue} as never);
                    goLeft(LoginNavTo.ActivateEmailSent);
                  }
                }
                loginPressed={() => {
                    navigation.reset({
                      index: 0,
                      routes: [{name: NavTo.Login}],
                    });
                    goRight(LoginNavTo.Login);
                  }
                }
                style={[styles.panel, register ? null : styles.hidden]}
                setPasswordUpdateType={setPasswordUpdateType}
                isDarkMode={props.isDarkMode}
              />
              <Login
                url={url}
                btnStyle={btnStyle}
                forgotPasswordPressed={() => {
                    navigation.push(NavTo.Login, {view: LoginNavTo.ForgotPassword} as never);
                    goRight(LoginNavTo.ForgotPassword);
                  }
                }
                registerPressed={() => {
                    navigation.push(NavTo.Login, {view: LoginNavTo.Register} as never);
                    goLeft(LoginNavTo.Register);
                  }
                }
                style={[styles.panel, login ? null : styles.hidden]}
                setIsLoggedIn={props.setIsLoggedIn}
                setIsSetup={props.setIsSetup}
                setNavSelector={props.setNavSelector}
                isDarkMode={props.isDarkMode}
              />
              <ForgotPassword
                btnStyle={btnStyle}
                setEmail={setEmailValue}
                email={emailValue}
                sendEmailPressed={() => {
                    navigation.push(NavTo.Login, {view: LoginNavTo.PasswordResetSent, email: emailValue} as never);
                    goRight(LoginNavTo.PasswordResetSent);
                  } 
                }
                loginPressed={() => {
                    navigation.reset({
                      index: 0,
                      routes: [{name: NavTo.Login}],
                    });
                    goLeft(LoginNavTo.Login);
                  }
                }
                style={[styles.panel, forgotPassword ? null : styles.hidden]}
                forgotError={forgotError}
                isDarkMode={props.isDarkMode}
              />
              <PasswordResetSent
                btnStyle={btnStyle}
                setStopInterval={setStopInterval}
                stopInterval={stopInterval}
                passwordPressed={() => {
                    navigation.push(NavTo.Login, {view: LoginNavTo.ForgotPassword, email: emailValue} as never);
                    goLeft(LoginNavTo.ForgotPassword);
                  }
                }
                style={[styles.panel, passwordResetSent ? null : styles.hidden]}
                email={emailValue}
                isDarkMode={props.isDarkMode}
              />
              <UpdatePassword
                setIsPasswordReset={props.setIsPasswordReset}
                btnStyle={btnStyle}
                updatePasswordPressed={() => {
                    navigation.push(NavTo.Login, {view: LoginNavTo.PasswordUpdated} as never);
                    goRight(LoginNavTo.PasswordUpdated);
                  }
                }
                loginPressed={() => {
                    navigation.reset({
                      index: 0,
                      routes: [{name: NavTo.Login}],
                    });
                    goLeft(LoginNavTo.Login);
                  }
                }
                style={[styles.panel, updatePassword ? null : styles.hidden]}
                passwordUpdateType={passwordUpdateType}
                setPasswordUpdateType={setPasswordUpdateType}
                email={emailValue}
                setEmail={setEmailValue}
                registerPressed={() => {
                    navigation.push(NavTo.Login, {view: LoginNavTo.Register} as never);
                    goLeft(LoginNavTo.Register);
                  }
                }
                registerEmail={registerEmail}
                token={token}
                setAccountAction={props.setAccountAction}
                isDarkMode={props.isDarkMode}
              />
              <PasswordUpdated
                loginPressed={() => {
                    navigation.reset({
                      index: 0,
                      routes: [{name: NavTo.Login}],
                    });
                    goLeft(LoginNavTo.Login);
                  }
                }
                style={[styles.panel, passwordUpdated ? null : styles.hidden]}
                isDarkMode={props.isDarkMode}
              />
            </Animated.View>
          </View>
      </View>
  );
};

export default LoginScreen;