import { NavigationContainer, NavigationContainerRef } from '@react-navigation/native';
import HomeScreen from './screens/home';
import { useFonts } from 'expo-font';
import Navigation from './components/navigation/navigation';
import React, { useEffect, useRef, useState } from 'react';
import { Animated, AppState, BackHandler, Button, Dimensions, Easing, Keyboard, KeyboardAvoidingView, Linking, Platform, ScrollView, StatusBar, StyleSheet, TouchableWithoutFeedback, View } from 'react-native';
import 'react-native-gesture-handler';
import AccountScreen from './screens/account';
import ProfileScreen from './screens/profile';
import SurveyScreen from './screens/survey';
import ListingsScreen from './screens/listings';
import MessagesScreen from './screens/messages';
import SearchScreen from './screens/search';
import FiltersScreen from './screens/filters';
import MyProfileScreen from './screens/my-profile';
import { Color, Content } from './style';
import { env as environ, getLocalStorage, isMobile, linking, NavTo, Page, setLocalStorage, Stack, isLoggedIn as isLoggedInHelper, isDarkMode as isDarkModeHelper, navProp, authTokenHeader, userId, setLocalAppSettingsPushMessageToken, getPushMessageToken, getCurrentChat, setLocalAppSettingsCurrentChat, setLocalAppSettingsOpenPushChat, getOpenPushChat } from './helper';
import LogoutScreen from './screens/logout';
import LoginScreen from './screens/login';
import _Text from './components/control/text';
import _Button from './components/control/button';
import AuthScreen from './screens/auth';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import * as Notifications from 'expo-notifications';
import { env } from 'process';
import { io, Socket } from "socket.io-client";
import { DefaultEventsMap } from '@socket.io/component-emitter';

Notifications.setNotificationHandler({
  handleNotification: async () => {
    return {
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: true
    };
  },
});

export const ThemeContext = React.createContext(null);

export const App = (props: any) => {
  const [socket, setSocket] = useState<Socket<DefaultEventsMap, DefaultEventsMap> | null>(null);
  const [navHeight,setNavHeight] = useState(0);
  const [navWidth,setNavWidth] = useState(0);
  const [containerStyle,setContainerStyle] = useState({});
  const [mobile,setMobile] = useState(false);
  const [adjustedPos,setAdjustedPos] = useState(0);
  const [accountView,setAccountView] = useState();
  const [isMatches,setIsMatches] = useState(false);
  const [ref,setRef] = useState(React.createRef<NavigationContainerRef<Page>>());
  const [isLoggedIn,setIsLoggedIn] = useState(false);
  const [isLoggingOut,setIsLoggingOut] = useState(false);
  const [accountAction,setAccountAction] = useState(false);
  const [isSetup,setIsSetup] = useState(false);
  const [isLoaded,setIsLoaded] = useState(false);
  const [prompt,setPrompt] = useState(false);
  const [setupStep,setSetupStep] = useState('');
  const [scrollY,setScrollY] = useState(0);
  const [navSelector,setNavSelector] = useState('');
  const [route,setRoute] = useState('');
  const [isDarkMode,setIsDarkMode] = useState(false);
  const [keyboardVisible,setKeyboardVisible] = useState(false);
  const [updatePicture,setUpdatePicture] = useState('');
  const [backCount,setBackCount] = useState(0);
  const [backTimer,setBackTimer] = useState(0);
  const [loginViewChanged,setLoginViewChanged] = useState('');
  const [messageCount,setMessageCount] = useState(0);
  const [addMessageCount,setAddMessageCount] = useState(0);
  const [messageData,setMessageData] = useState({});
  const [currentChat,setCurrentChat] = useState('');
  const [showingMessagePanel,setShowingMessagePanel] = useState(false);
  const [enableScroll,setEnableScroll] = useState(true);
  const [openChatFromPush,setOpenChatFromPush] = useState('');
  const [receiveMessage,setReceiveMessage] = useState(null);
  const [receiveTyping,setReceiveTyping] = useState(null);
  const appState = useRef(AppState.currentState);
  const [forceUpdateAccount, setForceUpdateAccount] = useState(false);
  const [loaded] = useFonts({
    'Inter-Regular': require('./assets/fonts/Inter-Regular.ttf'),
    'Inter-Bold': require('./assets/fonts/Inter-Bold.ttf'),
    'Inter-SemiBold': require('./assets/fonts/Inter-SemiBold.ttf'),
    'Inter-Thin': require('./assets/fonts/Inter-Thin.ttf'),
  });

  useEffect(() => {
    const newSocket: Socket<DefaultEventsMap, DefaultEventsMap> = io(environ.URL);
    setSocket(newSocket);
    return () => {newSocket.close()};
  }, [setSocket]);

  useEffect(() => {
    if (addMessageCount === 0) {
      return;
    }
    if (addMessageCount > 0) {
      setMessageCount(messageCount + addMessageCount);
    }
    setAddMessageCount(0);
  }, [addMessageCount])

  useEffect(() => {
    if (messageCount < 0) {
      setMessageCount(0);
    }
  }, [messageCount])

  useEffect(() => {
    if (Platform.OS === 'android') {
      const subscription = AppState.addEventListener('change', async (nextAppState) => {
        if (appState.current === 'active' && nextAppState !== 'active') {
          let data = await getCurrentChat();
          if (data) {
            data.disabled = true;
          }
          setLocalAppSettingsCurrentChat(data);
        }
        else if (nextAppState === 'active') {
          let data = await getCurrentChat();
          if (data) {
            data.disabled = false;
            if (data.id && data.is_showing) {
              checkDismissNotifications(data.id);
            }
            else {
              data = null;
            }  
            
            setLocalAppSettingsCurrentChat(data);
          }
        }
      });

      return () => {
        subscription.remove();
      };
    }
  }, []);

  useEffect(() => {
    checkDarkMode();
    const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', () => setKeyboardVisible(true));
    const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => setKeyboardVisible(false));

    return () => {
      keyboardDidHideListener.remove();
      keyboardDidShowListener.remove();
    };
  }, []);

  useEffect(() => {
    if (Platform.OS === 'android')
      checkDismissNotifications(currentChat);
  }, [currentChat, showingMessagePanel]);

  useEffect(() => {
    if (Platform.OS === 'android' && !showingMessagePanel)
      Keyboard.dismiss()
  }, [showingMessagePanel]);

  useEffect(() => {
    if (Platform.OS === 'android')
      updateNavForPushNotifications();

    contentStyle();
  }, [navSelector]);

  // Get device push notification permissions when the app launches
  useEffect(() => {
    if (Platform.OS === 'android') {
      Notifications.getPermissionsAsync()
      .then((statusObj) => {
        if (statusObj.status !== "granted") {
          return Notifications.requestPermissionsAsync();
        }
        return statusObj;
      })
      .then((statusObj) => {
        if (statusObj.status !== "granted") {
          throw new Error("Permission not granted.");
        }
      })
      .then(() => {
        return Notifications.getDevicePushTokenAsync();
      })
      .then((response) => {
        const token = response.data;
        setLocalAppSettingsPushMessageToken(token);
        storePushTokenToUser(token);
      })
      .catch((err) => {
        return null;
      });
    }
  }, []);

  useEffect(() => {
    if (Platform.OS === 'android') {
      if (loaded && ref && ref.current && openChatFromPush) {
        setTimeout(() => {
          if (ref && ref.current)
            ref.current.navigate(NavTo.Messages);
        }, 500);
      }
    }
  }, [openChatFromPush, ref.current])

  useEffect(() => {
    if (Platform.OS === 'android') {
      const backgroundSubscription =
      Notifications.addNotificationResponseReceivedListener(async (response: Notifications.NotificationResponse) => {
        let identifier = response.notification.request.identifier;
        let idx = identifier.lastIndexOf("-");
        let id = identifier.substring(0, idx);

        if (response.userText) {
          sendMessage(id, response.userText, true);
          Notifications.dismissNotificationAsync(response.notification.request.identifier);
        }
        else if (response.actionIdentifier === Notifications.DEFAULT_ACTION_IDENTIFIER) {
          setOpenChatFromPush(id);
        }
      });
  
      const foregroundSubscription =
        Notifications.addNotificationReceivedListener(async (notification) => {
          let idx = notification.request.identifier.lastIndexOf("-");
          let id = notification.request.identifier.substring(0, idx);
          let data = await getCurrentChat();
          if (data && data.id === id && data.is_showing === true && data.current_page === NavTo.Messages) {
            await Notifications.dismissNotificationAsync(notification.request.identifier);
            return;
          }

          await Notifications.getPresentedNotificationsAsync().then(async (res: Notifications.Notification[]) => {
            let ids = [];
            let count = 0;
            let body = notification.request.content.body + "\n";
            if (res.length > 0) {
              for (let i = res.length - 1; i >= 0; i--) {
                if (res[i].request.identifier.startsWith(id) &&
                    res[i].request.identifier != notification.request.identifier) {
                  body += res[i].request.content.body;
                  if (i > 0)
                    body += "\n";
                  ids.push(res[i].request.identifier);
                  count++;
                }
              }
            }

            if (count > 0) {
              let identifier = id + "-" + new Date().getTime();
              let data = notification.request.content;
              for (let i = 0; i < ids.length; i++) {
                await Notifications.dismissNotificationAsync(ids[i]);
              }

              await Notifications.dismissNotificationAsync(notification.request.identifier);
              await updateGroupedPushNotification(data.title, body, identifier)
            }
          });
      });

      Notifications.setNotificationChannelAsync('Messaging', {
        name: 'Messaging',
        importance: Notifications.AndroidImportance.MAX,
      });

      Notifications.setNotificationCategoryAsync('New Message', [
        {
          buttonTitle: 'Reply',
          identifier: 'reply',
          textInput: {
            submitButtonTitle: 'Send'
            /*
            Breaks with placeholder, leave out (known bug)
            Issue: https://github.com/expo/expo/issues/20500
            */
          },
          options: {
            opensAppToForeground: false
          }
        },
      ])

      return () => {
        backgroundSubscription.remove();
        foregroundSubscription.remove();
      };
    }
  }, []);

  useEffect(() => {
    const dimsChanged = Dimensions.addEventListener("change", (e) => setMobile(isMobile()));
    const back = BackHandler.addEventListener('hardwareBackPress', onBackPress);
    return () => {
      back.remove();
      dimsChanged?.remove();
    }
  });

  useEffect(() => {
    prepareStyle(); 
  }, [isDarkMode]);

  useEffect(() => {
    let rt = getRouteName();
    setRoute(rt);
    if (route != rt &&
      rt != NavTo.Auth ||
      rt != NavTo.ConfirmEmail ||
      rt != NavTo.ResetPassword ||
      rt != NavTo.UpdatePassword ||
      rt != NavTo.Logout ||
      rt != NavTo.Login) {
      checkLoggedIn();
    }
  }, [navSelector, ref.current]);

  useEffect(() => {
    setMobile(isMobile());
    prepareStyle(); 
  }, [navHeight, adjustedPos, prompt, navSelector, ref.current]);

  // Store the push token to the user
  async function storePushTokenToUser(token: string) {
    let hasError = false;
    try
    {   
      let obj = {pushToken: token};
      let js = JSON.stringify(obj);
      let tokenHeader = await authTokenHeader();
      await fetch(`${environ.URL}/users/updatePushToken`,
      {method:'POST',body:js,headers:{'Content-Type': 'application/json', 'authorization': tokenHeader}}).then(async ret => {
        let res = JSON.parse(await ret.text());
        if (res.Error)
        {
          hasError = true;
        }
      });
    }
    catch(e)
    {
      hasError = true;
    }  
  }

  useEffect(() => {
    if (socket === null) return;

    // Listen for messages being sent over socket
    socket.on('receive_message', (data: any) => {
      setReceiveMessage(data);
    });

    // Listen for typing indicator socket
    socket.on('receive_typing', (data: any) => {
      setReceiveTyping(data);
    });
  }, [socket]);

  // Resend all combined unread messages as one to the current user
  const updateGroupedPushNotification = async (title: any, message: any, tag: string) => {
    let hasError = false;
    try
    {   
      let msgToken = await getPushMessageToken();
      if (!msgToken) {
        await Notifications.getDevicePushTokenAsync().then((response) => {
          const token = response.data;
          setLocalAppSettingsPushMessageToken(token);
          storePushTokenToUser(token);
          msgToken = token;
        })
      }
      let obj = {message: message, title: title, tag: tag, pushToken: msgToken};
      let js = JSON.stringify(obj);
      let tokenHeader = await authTokenHeader();
      await fetch(`${environ.URL}/messages/sendUpdatedPushNotification`,
      {method:'POST',body:js,headers:{'Content-Type': 'application/json', 'authorization': tokenHeader}}).then(async ret => {
        let res = JSON.parse(await ret.text());
        if (res.Error)
        {
          hasError = true;
        }
      });
    }
    catch(e)
    {
      hasError = true;
    } 

    return !hasError;
  }

  const randomNum = () => {
    return (Math.floor(Math.random() * 100000) + 1).toString();
  }

  async function sendMessage(chatId: string, reply: any, update: boolean) {
    let user = await userId();
    let hasError = false;
    if (user) {
      try
      {       
        let id = randomNum();
        let obj = {content:reply, userId:user, chatId: chatId, id: id};
        let js = JSON.stringify(obj);
        let tokenHeader = await authTokenHeader();
        await fetch(`${environ.URL}/messages`,
            {method:'POST',body:js,headers:{'Content-Type': 'application/json', 'authorization': tokenHeader}}).then(async ret => {
                let res = JSON.parse(await ret.text());
                if (res.Error)
                {
                  hasError = true;
                }
                else if (update) {
                  setMessageData(obj);
                }
            });
      }
      catch(e)
      {
        hasError = true;
      }  
    }  
  }

  async function updateNavForPushNotifications() {
    let data = await getCurrentChat();
    if (data) {
      data.current_page = navSelector;
      setLocalAppSettingsCurrentChat(data);
      checkDismissNotifications(data.id);
    }
  }

  function checkDismissNotifications(chatId: string) {
    if (chatId && showingMessagePanel) {
      Notifications.getPresentedNotificationsAsync().then(async (res: Notifications.Notification[]) => {
        res.forEach(msg => {
          let identifier = msg.request.identifier;
          let idx = identifier.lastIndexOf("-");
          let id = identifier.substring(0, idx);
          if (id === chatId) {
            Notifications.dismissNotificationAsync(identifier);
          }
        })
      });
    }
  }
  
  if (!loaded) {
    return null;
  }

  const onBackPress = () => {
    setShowingMessagePanel(false);
    let current = getRouteName();
    let name = getPreviousRouteName();
    if (name) {
      if (current == NavTo.Login) {
        let view = getRouteView();
        if (!view) {
          BackHandler.exitApp();
        }
        else {
          ref?.current?.goBack();
          let uView = getRouteView();
          if (!uView) {
            uView = 'login'
          }
          setLoginViewChanged(uView); 
        }
        return true;
      }
      setNavSelector(name);
    }
    let time = new Date().getTime();
    if (backTimer == 0 || (time - backTimer) < 250) {
      if (backCount == 1) {
        if (ref && ref.current) {
          ref.current.navigate(NavTo.Logout);
        }
        setBackCount(0);
        setBackTimer(0);
      }
      else {
        if (backTimer == 0) {
          setBackTimer(time);
        }
        setBackCount(backCount + 1);
      }
    }
    else {
      setBackCount(1);
      setBackTimer(time);
    }

    return false;
  };

  async function checkDarkMode() { 
    let darkMode = await isDarkModeHelper();
    setIsDarkMode(darkMode);
  }

  function getRouteName() {
    if (ref.current) {
      let route = ref.current.getCurrentRoute();
      if (route)
        return route.name;
    }
    return '';
  }

  const getRouteView = () => {
    let route = ref.current?.getCurrentRoute();
    if (route && route.params) {
      let params = route.params as never;
      if (params['view'])
        return params['view'];
    }
    return '';
  }

  const getPreviousRouteName = () => {
    let routes = ref.current?.getState()?.routes;
    if (routes) {
      if (routes.length > 2) {
        return routes[routes.length - 2].name;
      }
      else if (routes.length == 1) {
        return routes[0].name;
      }
    }
    return NavTo.MyProfile;
  }

  const navigateToSetupStep = (step: string) => {
      if (!step)
        step = "info";
      ref.current?.navigate(NavTo.Account, {view: step} as never);
  }

  async function checkLoggedIn() {
    if (!isLoggingOut) {
      let hasError = false;
      let data = await getLocalStorage();
      if (data) {
        let obj = {refreshToken:data.refreshToken, accessToken: data.accessToken, mobile: true};
        let js = JSON.stringify(obj);

        try
        {   
            await fetch(`${environ.URL}/auth/checkAuth`,
            {method:'POST',body:js,headers:{'Content-Type': 'application/json'}}).then(async ret => {
              let res = JSON.parse(await ret.text());
              if (res.Error)
              {
                hasError = true;
              }
              else
              {
                let aToken;
                await fetch(`${environ.URL}/auth/refreshToken`,
                {method:'POST',body:js,headers:{'Content-Type': 'application/json'}}).then(async ret => {
                  let res = JSON.parse(await ret.text());
                  if (res.Error)
                  {
                    hasError = true;
                  }
                  else if (res.accessToken) {
                    aToken = res.accessToken;
                  }
                });

                if (aToken && res)
                  res.accessToken = aToken;
                await setLocalStorage(res);
                let l_isSetup = res.user.is_setup == true ? true : false;
                let l_setupStep = res.user.setup_step != null ? res.user.setup_step : '';
                setIsSetup(l_isSetup);
                setSetupStep(l_setupStep);
                setIsLoggedIn(true);
                if (!l_isSetup)
                  navigateToSetupStep(l_setupStep);
              }
            });
        }
        catch(e)
        {
          hasError = true;
        }   
      }
      else {
        hasError = true;
      }
      if (hasError) {
        if (ref && ref.current) {
          let route = ref.current.getCurrentRoute();
          if (route && route.name !== NavTo.Login) {
            await setLocalStorage(null);
            ref.current.navigate(NavTo.Login, {timeout: 'yes'} as never);
            setIsLoggedIn(false);
            setIsSetup(false);
              try {
                ref.current.resetRoot();
              }
              catch (e) {
                // Can't reset root
              }
            if (isLoggedIn)
              setIsLoggedIn(false);
          }
        }
      }
    }
    else
      setIsLoggingOut(false);
  }

  const getOffset = (scrollView: number) => {
    var window = Dimensions.get("window").width;
      if (scrollView < window) {
        setAdjustedPos((window - scrollView) / 2);
      }
      else {
        setAdjustedPos(0);
      }
  }

  const getScrollDims = (w: number, h: number) => {
    getOffset(w);
  }

  function prepareStyle() {
    var backgroundColor = Color(isDarkMode).background;
    var marginTop = Platform.OS === 'web' ? navHeight : 0;
    if (mobile) {
      backgroundColor = Color(isDarkMode).contentBackgroundSecondary;
    }

    var overflow = 'auto';
    if (prompt) {
      overflow = 'hidden';
    }

    var container = {
      backgroundColor: backgroundColor,
      marginTop: marginTop,
      overflowY: overflow
    }

    setContainerStyle(container);
  }

  const scroll = (e: any) => {
      getOffset(e.nativeEvent.contentSize.width);
      let offset = e.nativeEvent.contentOffset;
      let y = offset.y;
      if (y > 0)
        y -= navHeight;
      setScrollY(y)
  }

  const header = (props: any) => {
    if (Platform.OS !== 'web')
      return <Navigation
      {...props}
      screen={props.options.title} 
      setAccountView={setAccountView}
      height={navHeight}
      setHeight={setNavHeight}
      width={navWidth}
      setWidth={setNavWidth}
      setIsMatches={setIsMatches}
      mobile={mobile}
      isLoaded={isLoaded}
      isSetup={isSetup}
      isLoggedIn={isLoggedIn}
      navSelector={navSelector}
      setNavSelector={setNavSelector}
      isDarkMode={isDarkMode}
      setUpdatePicture={setUpdatePicture}
      updatePicture={updatePicture}
      messageCount={messageCount}
      showingMessagePanel={showingMessagePanel}
      />
    else
      return <View></View>;
  }

  function contentStyle() {
    var style = [];
    style.push(styles.contentStyle);
    var paddingTop = (getRouteName() === NavTo.Login) ? 0 : 10;
    var backgroundColor = Color(isDarkMode).background;
    var paddingLeft = 0;
    var paddingRight = 0;
    var translate = !mobile ? adjustedPos : 0;

    if (mobile) {
      backgroundColor = Color(isDarkMode).contentBackgroundSecondary;
      paddingLeft = 10;
      paddingRight = 10;

      // Don't add padding for message app on mobile
      let rn = getRouteName();
      if (rn == NavTo.Messages || rn == NavTo.Listings || rn == NavTo.Search || rn == NavTo.Profile || rn == NavTo.Filters) {
        paddingLeft = 0;
        paddingRight = 0;
        paddingTop = 0;
      }
    }

    var content = {
      backgroundColor: backgroundColor,
      paddingLeft: paddingLeft,
      paddingRight: paddingRight,
      transform: [{translateX: translate}],
      paddingTop: paddingTop,
    }
    
    style.push(content);
    return style;
  }

  const scrollParentContainerStyle = () => {
    var style = [];
    style.push(styles.scrollParentContainer);
    return style;
  }

  const getMainStyle = () => {
    let style = [];
    style.push(containerStyle);
    style.push(styles.container);

    return style;
  }

  const checkKeyboardDismiss = () => {
    if (Platform.OS !== 'web')
      Keyboard.dismiss();
  }

  const MyTheme = () => {
    return {
      dark: Color(isDarkMode),
      colors: {
        background: isMobile() ? Color(isDarkMode).contentBackgroundSecondary : Color(isDarkMode).background
      },
    }
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView
      style={styles.safe}
      >
        <View
        style={styles.safe}
        >
        <NavigationContainer
        linking={linking}
        ref={ref}
        theme={MyTheme()}
        >
          <KeyboardAvoidingView
          keyboardVerticalOffset={StatusBar.currentHeight}
          behavior='padding'
          style={styles.avoidContainer}>
          <TouchableWithoutFeedback onPress={(e:any) => checkKeyboardDismiss()}>
            <ScrollView
            contentContainerStyle={scrollParentContainerStyle()}
            style={getMainStyle()}
            onScroll={(e) => scroll(e)}
            scrollEventThrottle={100}
            onContentSizeChange={(w, h) => getScrollDims(w, h)}
            keyboardShouldPersistTaps={'handled'}
            scrollEnabled={navSelector !== NavTo.Messages && navSelector !== NavTo.Listings && navSelector !== NavTo.Search && navSelector !== NavTo.Filters}
            >
              <View
                style={styles.stack}
              >
                <StatusBar
                  backgroundColor={Color(isDarkMode).statusBar}
                  barStyle={isDarkMode ? "light-content" : "dark-content"}
                />
                <Stack.Navigator
                screenOptions={{header: (e: any) => header(e), contentStyle: contentStyle(), navigationBarColor: Color(isDarkMode).statusBar}}
                initialRouteName={NavTo.Login}
                >
                  <Stack.Screen
                      name={NavTo.Home}
                      options={{title: NavTo.Home, animation: 'none'}}
                  >
                  {(props: any) => <HomeScreen
                  {...props}
                  mobile={mobile}
                  isDarkMode={isDarkMode}
                  setNavSelector={setNavSelector}
                  />}
                  </Stack.Screen>
                  <Stack.Screen
                      name={NavTo.Auth}
                      options={{title: NavTo.Auth, animation: 'none'}}
                  >
                  {(props: any) => <AuthScreen
                  {...props}
                  mobile={mobile}
                  setIsLoggedIn={setIsLoggedIn}
                  setIsSetup={setIsSetup}
                  isDarkMode={isDarkMode}
                  setNavSelector={setNavSelector}
                  />}
                  </Stack.Screen>
                  <Stack.Screen
                      name={NavTo.Login}
                      options={{title: NavTo.Login, animation: 'none'}}
                  >
                      {(props: any) => <LoginScreen
                      {...props}
                      mobile={mobile}
                      setIsLoggedIn={setIsLoggedIn}
                      setIsSetup={setIsSetup}
                      accountAction={accountAction}
                      setAccountAction={setAccountAction}
                      setNavSelector={setNavSelector}
                      loginViewChanged={loginViewChanged}
                      setLoginViewChanged={setLoginViewChanged}
                      isDarkMode={isDarkMode}
                      setIsDarkMode={setIsDarkMode}
                      keyboardVisible={keyboardVisible}
                      />}
                  </Stack.Screen>
                  <Stack.Screen
                      name={NavTo.Account}
                      options={{title: NavTo.Account, animation: 'none'}}
                  >
                  {(props: any) => <AccountScreen
                  {...props}
                  accountView={accountView}
                  setAccountView={setAccountView}
                  mobile={mobile}
                  isSetup={isSetup}
                  setupStep={setupStep}
                  setPrompt={setPrompt}
                  scrollY={scrollY}
                  setIsLoggedIn={setIsLoggedIn}
                  setIsSetup={setIsSetup}
                  isDarkMode={isDarkMode}
                  setIsDarkMode={setIsDarkMode}
                  setNavSelector={setNavSelector}
                  setUpdatePicture={setUpdatePicture}
                  setForceUpdateAccount={setForceUpdateAccount}
                  />}
                  </Stack.Screen>
                  <Stack.Screen
                      name={NavTo.Profile}
                      options={{title: NavTo.Profile, animation: 'none'}}
                  >
                  {(props: any) => <ProfileScreen
                  {...props}
                  mobile={mobile}
                  isDarkMode={isDarkMode}
                  setNavSelector={setNavSelector}
                  navSelector={navSelector}
                  setShowingMessagePanel={setShowingMessagePanel}
                  />}
                  </Stack.Screen> 
                  <Stack.Screen
                      name={NavTo.Survey}
                      options={{title: NavTo.Survey, animation: 'none'}}
                  >
                  {(props: any) => <SurveyScreen
                  {...props}
                  mobile={mobile}
                  setIsLoggedIn={setIsLoggedIn}
                  setIsSetup={setIsSetup}
                  isDarkMode={isDarkMode}
                  setNavSelector={setNavSelector}
                  />}
                  </Stack.Screen>
                  <Stack.Screen
                      name={NavTo.Search}
                      options={{title: NavTo.Search, animation: 'none'}}
                  > 
                  {(props: any) => <SearchScreen
                  {...props}
                  mobile={mobile}
                  isMatches={isMatches}
                  setIsMatches={setIsMatches}
                  isDarkMode={isDarkMode}
                  setNavSelector={setNavSelector}
                  />}
                  </Stack.Screen>
                  <Stack.Screen
                  name={NavTo.Filters}
                  options={{ title: NavTo.Filters, animation: 'none' }}
                >
                  {(props: any) => <FiltersScreen
                    {...props}
                    mobile={mobile}
                    isMatches={isMatches}
                    setIsMatches={setIsMatches}
                    isDarkMode={isDarkMode}
                    setNavSelector={setNavSelector}
                  />}
                  </Stack.Screen>
              <Stack.Screen
                  name={NavTo.MyProfile}
                  options={{ title: NavTo.MyProfile, animation: 'none' }}
                >
                  {(props: any) => <MyProfileScreen
                    {...props}
                    mobile={mobile}
                    isMatches={isMatches}
                    setIsMatches={setIsMatches}
                    isDarkMode={isDarkMode}
                    setForceUpdateAccount={setForceUpdateAccount}
                    forceUpdateAccount={forceUpdateAccount}
                  />}
              </Stack.Screen>
                  <Stack.Screen
                      name={NavTo.Listings}
                      options={{title: NavTo.Listings, animation: 'none'}}
                  >
                  {(props: any) => <ListingsScreen
                  {...props}
                  mobile={mobile}
                  isDarkMode={isDarkMode}
                  setNavSelector={setNavSelector}
                  />}
                  </Stack.Screen>
                  <Stack.Screen
                      name={NavTo.Messages}
                      options={{title: NavTo.Messages, animation: 'none'}}
                  >
                  {(props: any) => <MessagesScreen
                  {...props}
                  mobile={mobile}
                  isDarkMode={isDarkMode}
                  setNavSelector={setNavSelector}
                  navSelector={navSelector}
                  socket={socket}
                  setMessageCount={setMessageCount}
                  messageCount={messageCount}
                  messageData={messageData}
                  setCurrentChat={setCurrentChat}
                  setShowingMessagePanel={setShowingMessagePanel}
                  openChatFromPush={openChatFromPush}
                  setOpenChatFromPush={setOpenChatFromPush}
                  receiveMessage={receiveMessage}
                  receiveTyping={receiveTyping}
                  setAddMessageCount={setAddMessageCount}
                  showingMessagePanel={showingMessagePanel}
                  />}
                  </Stack.Screen> 
                  <Stack.Screen
                      name={NavTo.Logout}
                      options={{title: NavTo.Logout, animation: 'none'}}
                  >
                  {(props: any) => <LogoutScreen
                  {...props}
                  mobile={mobile}
                  setIsLoggedIn={setIsLoggedIn}
                  setIsSetup={setIsSetup}
                  isDarkMode={isDarkMode}
                  setNavSelector={setNavSelector}
                  />}
                  </Stack.Screen>
                </Stack.Navigator>
              </View>
            </ScrollView>
            </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
            {Platform.OS === 'web' ?
            <Navigation
            setAccountView={setAccountView}
            height={navHeight}
            setHeight={setNavHeight}
            width={navWidth}
            setWidth={setNavWidth}
            setIsMatches={setIsMatches}
            mobile={mobile}
            isLoaded={isLoaded}
            isSetup={isSetup}
            isLoggedIn={isLoggedIn}
            navSelector={navSelector}
            setNavSelector={setNavSelector}
            isDarkMode={isDarkMode}
            setUpdatePicture={setUpdatePicture}
            updatePicture={updatePicture}
            messageCount={messageCount}
            showingMessagePanel={showingMessagePanel}
            />    
            : null} 
        </NavigationContainer>
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  safe: {
    flex: 1,
  },
  avoidContainer: {
    flex: 1,
  },
  stack: {
    width: '100%',
    height: '100%',
  },
  container: {
    flex: 1,
    height: '100%',
  },
  scrollParentContainer: {
    height: '100%',
  },
  contentStyle: {
    maxWidth: Content.width,
    marginLeft: 'auto',
    marginRight: 'auto',
    width: '100%',
    height: '100%',
  }
});

export default App;