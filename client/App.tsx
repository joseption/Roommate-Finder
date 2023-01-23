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
import { Context, env, getLocalStorage, isMobile, linking, NavTo, Page, setLocalStorage, Stack } from './helper';
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
  const [isLoggedIn,setIsLoggedIn] = useState(false);
  const [currentNav,setCurrentNav] = useState('');
  const [accountAction,setAccountAction] = useState(false);
  const [init,setInit] = useState(false);
  const [initLink,setInitLink] = useState('');
  const [isSetup,setIsSetup] = useState(false);
  const [isLoaded,setIsLoaded] = useState(false);
  const [prompt,setPrompt] = useState(false);
  const [setupStep,setSetupStep] = useState('');
  const [scrollY,setScrollY] = useState(0);
  const [loaded] = useFonts({
    'Inter-Regular': require('./assets/fonts/Inter-Regular.ttf'),
    'Inter-Bold': require('./assets/fonts/Inter-Bold.ttf'),
    'Inter-SemiBold': require('./assets/fonts/Inter-SemiBold.ttf'),
    'Inter-Thin': require('./assets/fonts/Inter-Thin.ttf'),
  });

  useEffect(() => {
    setIsSetup(true); // ja remove
    setMobile(isMobile());
    const subscription = Dimensions.addEventListener(
      "change",
      (e) => {
          setMobile(isMobile());
      }
    );
    if (!initLink) {
      DeepLinking.getInitialURL().then(async (link: any) => {
        if (link) {
          setInitLink(link);
          checkLoggedIn();
        }
      });
    }
    else if (!init) {
      setInit(true);
      setup(initLink);
    }
    else
      setup();

    return () => subscription?.remove();
  }, [navDimensions.height, mobile, adjustedPos, ref, isLoggedIn, currentNav, prompt]);
  
  if (!loaded) {
    return null;
  }

  const getRouteName = () => {
    return ref.current?.getCurrentRoute()?.name;
  }

  function setup(link: string = '') {
      if (ref && ref.current && link && link.toLowerCase().includes('/auth')) {
          var cRoute = DeepLinking.parse(link);
          var path = cRoute.path?.substring(cRoute.path?.lastIndexOf('/') + 1);
          if (cRoute?.queryParams)
            cRoute.queryParams.path = path;
          ref.current?.navigate(NavTo.Login, cRoute.queryParams as never);
          setAccountAction(true);
          return;
      }
      checkLoggedIn();
      prepareStyle();
      if (!isLoaded)
        setIsLoaded(true);
  }

  const navigateToSetupStep = (step: string) => {
      if (!step)
        step = "info";
      ref.current?.navigate(NavTo.Account, {view: step} as never);
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
              await setLocalStorage(res);
              let l_isSetup = res.user.is_setup == true ? true : false;
              let l_setupStep = res.user.setup_step != null ? res.user.setup_step : '';
              setIsSetup(l_isSetup);
              setSetupStep(l_setupStep);
              setIsLoggedIn(true);
              if (!l_isSetup) {
                navigateToSetupStep(l_setupStep);
              }
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
    if (error) {
      if (ref && ref.current) {
        let route = ref.current.getCurrentRoute();
        if (route && route.name !== NavTo.Login) {
          await setLocalStorage(null);
          ref.current.navigate(NavTo.Login, {timeout: 'yes'} as never);
            try {
              ref.current.resetRoot();
            }
            catch (e) {
              // Can't reset root
            }
          setIsLoggedIn(false);
        }
      }
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
        y -= navDimensions.height;
      setScrollY(y)
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

  const nav = () => {
    return ref.current;
  }

  const getMainStyle = () => {
    let style = [];
    style.push(containerStyle);
    style.push(styles.container);

    return style;
  }

  return (
    <NavigationContainer
    linking={linking}
    ref={ref}
    >
        <ScrollView
        contentContainerStyle={scrollParentContainerStyle()}
        style={getMainStyle()}
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
              isSetup={isSetup}
              setupStep={setupStep}
              setPrompt={setPrompt}
              scrollY={scrollY}
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
        setAccountView={setAccountView}
        dimensions={navDimensions}
        setDimensions={setNavDimensions}
        setIsMatches={setIsMatches}
        navigation={nav()}
        isLoggedIn={isLoggedIn}
        setCurrentNav={setCurrentNav}
        mobile={mobile}
        isSetup={isSetup}
        setIsSetup={setIsSetup}
        isLoaded={isLoaded}
        />
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