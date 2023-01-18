import { NavigationContainer, NavigationContainerRef, StackRouter, useLinkProps, useNavigation } from '@react-navigation/native';
import HomeScreen from './screens/home';
import { useFonts } from 'expo-font';
import Navigation from './components/navigation/navigation';
import React, { useEffect, useState } from 'react';
import { Dimensions, Platform, ScrollView, StatusBar, StyleSheet, View } from 'react-native';
import 'react-native-gesture-handler';
import AccountScreen from './screens/account';
import ProfileScreen from './screens/profile';
import SurveyScreen from './screens/survey';
import ListingsScreen from './screens/listings';
import MessagesScreen from './screens/messages';
import SearchScreen from './screens/search';
import { Color, Content } from './style';
import { env, getLocalStorage, isMobile, linking, NavTo, Page, setLocalStorage, Stack } from './helper';
import LogoutScreen from './screens/logout';
import LoginScreen from './screens/login';
import _Text from './components/control/text';
import * as DeepLinking from 'expo-linking';

export const App = (props: any) => {
  const [navDimensions,setNavDimensions] = useState({height: 0, width: 0});
  const [containerStyle,setContainerStyle] = useState({});
  const [mobile,setMobile] = useState(false);
  const [adjustedPos,setAdjustedPos] = useState(0);
  const [accountView,setAccountView] = useState();
  const [isMatches,setIsMatches] = useState(false);
  const [ref,setRef] = useState(React.createRef<NavigationContainerRef<Page>>());
  const [initURL, setInitURL] = useState('');
  const [isLoggedIn,setIsLoggedIn] = useState(false);
  const [currentNav,setCurrentNav] = useState('');
  const [accountAction,setAccountAction] = useState(false);
  const [loaded] = useFonts({
    'Inter-Regular': require('./assets/fonts/Inter-Regular.ttf'),
    'Inter-Bold': require('./assets/fonts/Inter-Bold.ttf'),
    'Inter-SemiBold': require('./assets/fonts/Inter-SemiBold.ttf'),
    'Inter-Thin': require('./assets/fonts/Inter-Thin.ttf'),
  });

  useEffect(() => {
    setMobile(isMobile());
    const subscription = Dimensions.addEventListener(
      "change",
      (e) => {
          setMobile(isMobile());
      }
    );
    if (!initURL) {
      DeepLinking.getInitialURL().then(async (link: any) => {
        if (link)
          setInitURL(link);
      });
    }
      
    if (ref.current)
      setup();

    return () => subscription?.remove();
  }, [navDimensions.height, mobile, adjustedPos, ref, isLoggedIn, currentNav]);
  
  if (!loaded) {
    return null;
  }

  const getRouteName = () => {
    return ref.current?.getCurrentRoute()?.name;
  }

  function setup() {
      if (initURL && initURL.toLowerCase().includes('/auth')) {
          var route = DeepLinking.parse(initURL);
          var path = route.path?.substring(route.path?.lastIndexOf('/') + 1);
          if (route?.queryParams)
            route.queryParams.path = path;
          ref.current?.navigate(NavTo.Login, route.queryParams as never);
          setAccountAction(true);
          return;
      }
      checkLoggedIn();
      prepareStyle();
  }

  async function checkLoggedIn() {
    let error = false;
    let data = await getLocalStorage();
    if (data) {
      let obj = {refreshToken:data.refreshToken, accessToken: data.accessToken};
      let js = JSON.stringify(obj);

      try
      {   
          await fetch(`${env.URL}/auth/checkAuth`,
          {method:'POST',body:js,headers:{'Content-Type': 'application/json'}}).then(async ret => {
            let res = JSON.parse(await ret.text());
            if (res.Error)
            {
              error = true;
            }
            else
            {
              data.accessToken = res.accessToken;
              await setLocalStorage(data);
              setIsLoggedIn(true);
            }
          });
      }
      catch(e)
      {
        error = true;
      }   
    }
    else {
      error = true;
    }
    if (error && ref.current?.getCurrentRoute()?.name !== NavTo.Login) {
      await setLocalStorage(null);
      ref.current?.navigate(NavTo.Login, {timeout: 'yes'} as never);
      setIsLoggedIn(false);
    }
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
    var backgroundColor = Color.holder;
    var marginTop = Platform.OS === 'web' ? navDimensions.height : 0;
    if (mobile) {
      backgroundColor = Color.white;
    }

    var container = {
      backgroundColor: backgroundColor,
      marginTop: marginTop,
    }

    setContainerStyle(container);
  }

  const scroll = (e: any) => {
      getOffset(e.nativeEvent.contentSize.width);
  }

  const header = (e: any) => {
    if (Platform.OS !== 'web')
      return <Navigation
      screen={e.options.title} 
      setAccountView={setAccountView}
      dimensions={navDimensions}
      setDimensions={setNavDimensions}
      mobile={mobile} />
    else
      return <View></View>;
  }

  const contentStyle = () => {
    var style = [];
    style.push(styles.contentStyle);
    var paddingTop = (getRouteName() === NavTo.Login) ? 0 : 10;
    var backgroundColor = Color.holder;
    var paddingLeft = 0;
    var paddingRight = 0;
    var translate = !mobile ? adjustedPos : 0;

    if (mobile) {
      backgroundColor = Color.white;
      paddingLeft = 10;
      paddingRight = 10;

      // Don't add padding for message app on mobile
      if (getRouteName() == NavTo.Messages) {
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
      paddingTop: paddingTop
    }
    
    style.push(content);
    return style;
  }

  const scrollParentContainerStyle = () => {
    var style = [];
    style.push(styles.scrollParentContainer);
    return style;
  }

  const nav = () => {
    return ref.current;
  }

  return (
    <NavigationContainer
    linking={linking}
    ref={ref}
    >
        <ScrollView
        contentContainerStyle={scrollParentContainerStyle()}
        style={[containerStyle, styles.container]}
        onScroll={(e) => scroll(e)}
        scrollEventThrottle={100}
        onContentSizeChange={(w, h) => getScrollDims(w, h)}
        >
          <View
          style={styles.stack}
          >
            <StatusBar
              backgroundColor={Color.white}
              barStyle="dark-content"
            />
            <Stack.Navigator
            screenOptions={{header: (e: any) => header(e), contentStyle: contentStyle()}}
            initialRouteName={NavTo.Login}
            >
              <Stack.Screen
                  name={NavTo.Home}
                  options={{title: NavTo.Home, animation: 'none'}}
              >
              {(props: any) => <HomeScreen
              {...props}
              mobile={mobile}
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
                  accountAction={accountAction}
                  setAccountAction={setAccountAction}
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
              />}
              </Stack.Screen>
              <Stack.Screen
                  name={NavTo.Profile}
                  options={{title: NavTo.Profile, animation: 'none'}}
              >
              {(props: any) => <ProfileScreen
              {...props}
              mobile={mobile}
              />}
              </Stack.Screen> 
              <Stack.Screen
                  name={NavTo.Survey}
                  options={{title: NavTo.Survey, animation: 'none'}}
              >
              {(props: any) => <SurveyScreen
              {...props}
              mobile={mobile}
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
              />}
              </Stack.Screen>
              <Stack.Screen
                  name={NavTo.Listings}
                  options={{title: NavTo.Listings, animation: 'none'}}
              >
              {(props: any) => <ListingsScreen
              {...props}
              mobile={mobile}
              />}
              </Stack.Screen>
              <Stack.Screen
                  name={NavTo.Messages}
                  options={{title: NavTo.Messages, animation: 'none'}}
              >
              {(props: any) => <MessagesScreen
              {...props}
              mobile={mobile}
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
              />}
              </Stack.Screen>
            </Stack.Navigator>
          </View>
        </ScrollView>
        {Platform.OS === 'web' ?
        <Navigation
        {...props}
        setAccountView={setAccountView}
        dimensions={navDimensions}
        setDimensions={setNavDimensions}
        setIsMatches={setIsMatches}
        navigation={nav()}
        isLoggedIn={isLoggedIn}
        setCurrentNav={setCurrentNav}
        mobile={mobile} />
        : null} 
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
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