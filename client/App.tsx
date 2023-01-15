import { NavigationContainer, NavigationContainerRef, StackRouter, useLinkProps, useNavigation } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from './screens/home';
import { useFonts } from 'expo-font';
import { library } from '@fortawesome/fontawesome-svg-core'
import Navigation from './components/navigation/navigation';
import React, { createContext, useEffect, useState } from 'react';
import { Alert, Dimensions, Linking, Platform, ScrollView, StatusBar, StyleSheet, Text, View } from 'react-native';
import 'react-native-gesture-handler';
import {Header, StackNavigationProp} from '@react-navigation/stack';
import AccountScreen from './screens/account';
import ProfileScreen from './screens/profile';
import SurveyScreen from './screens/survey';
import ListingsScreen from './screens/listings';
import MessagesScreen from './screens/messages';
import MatchesScreen from './screens/matches';
import ExploreScreen from './screens/explore';
import { Color, Content, Style } from './style';
import { config, isMobile, linking, navProp, NavTo, Page, Stack } from './helper';
import LogoutScreen from './screens/logout';
import LoginScreen from './screens/login';
import _Text from './components/control/text';
import * as DeepLinking from 'expo-linking';
import { setDefaultResultOrder } from 'dns/promises';

export const App = (props: any) => {
  const [navDimensions,setNavDimensions] = useState({height: 0, width: 0});
  const [style,setStyle] = useState({});
  const [containerStyle,setContainerStyle] = useState({});
  const [mobile,setMobile] = useState(false);
  const [page,setPage] = useState('');
  const [init,setInit] = useState(false);
  const [route,setRoute] = useState('');
  const [adjustedPos,setAdjustedPos] = useState(0);
  const [url,setUrl] = useState('');
  const [accountView,setAccountView] = useState();
  const [loaded] = useFonts({
    'Inter-Regular': require('./assets/fonts/Inter-Regular.ttf'),
    'Inter-Bold': require('./assets/fonts/Inter-Bold.ttf'),
    'Inter-SemiBold': require('./assets/fonts/Inter-SemiBold.ttf'),
    'Inter-Thin': require('./assets/fonts/Inter-Thin.ttf'),
  });
  const navigationRef = React.createRef<NavigationContainerRef<Page>>();

  useEffect(() => {
    setMobile(isMobile());
    const subscription = Dimensions.addEventListener(
      "change",
      (e) => {
          setMobile(isMobile());
      }
    );

    DeepLinking.getInitialURL().then((url: any) => {
      setUrl(url); // JA not working on android. get url returns null
      if (url) {
        if (url.toLowerCase().includes('/auth')) {
            var params = DeepLinking.parse(url);
            navigationRef.current?.navigate(NavTo.Login, params.queryParams as never);
        }
        else if (url.toLowerCase().includes(config.screens.Login)) {
          setPage(NavTo.Login);
        }
      }
    });

    prepareStyle();

    return () => subscription?.remove();
  }, [navDimensions.height, page, mobile, adjustedPos, route, url]);
  
  if (!loaded) {
    return null;
  }

  const routeName = (): keyof Page => {
    // JA TODO need logic to decide route name for now just return home
    return NavTo.Login;
  }

  const state = (e: any) => {
    if (init) {
      var routes = e.data.state.routes;
      if (routes && routes.length > 0) {
        setPage(routes[routes.length - 1].name);
        prepareStyle();
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
    var paddingTop = (page === NavTo.Login) ? 0 : 10;
    var backgroundColor = Color.holder;
    var paddingLeft = 0;
    var paddingRight = 0;
    var translate = !mobile ? adjustedPos : 0;

    if (mobile) {
      backgroundColor = Color.white;
      paddingLeft = 10;
      paddingRight = 10;
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

  return (
    <NavigationContainer
    linking={linking}
    ref={navigationRef}
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
            initialRouteName={routeName()}
            screenListeners={{
              state: (e: any) => state(e)
            }}
            >
              <Stack.Screen
                  name={NavTo.Home}
                  options={{title: NavTo.Home, animation: 'none'}}
              >
              {(props: any) => <HomeScreen
              {...props}
              mobile={mobile}
              url={url}
              />}
              </Stack.Screen>
              <Stack.Screen
                  name={NavTo.Login}
                  options={{title: NavTo.Login, animation: 'none'}}
              >
                  {(props: any) => <LoginScreen
                  {...props}
                  mobile={mobile}
                  url={url}
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
              url={url}
              />}
              </Stack.Screen>
              <Stack.Screen
                  name={NavTo.Profile}
                  options={{title: NavTo.Profile, animation: 'none'}}
              >
              {(props: any) => <ProfileScreen
              {...props}
              mobile={mobile}
              url={url}
              />}
              </Stack.Screen> 
              <Stack.Screen
                  name={NavTo.Survey}
                  options={{title: NavTo.Survey, animation: 'none'}}
              >
              {(props: any) => <SurveyScreen
              {...props}
              mobile={mobile}
              url={url}
              />}
              </Stack.Screen>
              <Stack.Screen
                  name={NavTo.Matches}
                  options={{title: NavTo.Matches, animation: 'none'}}
              > 
              {(props: any) => <MatchesScreen
              {...props}
              mobile={mobile}
              url={url} 
              />}
              </Stack.Screen>
              <Stack.Screen
                  name={NavTo.Explore}
                  options={{title: NavTo.Explore, animation: 'none'}}
              > 
              {(props: any) => <ExploreScreen
              {...props}
              mobile={mobile}
              url={url}
              />}
              </Stack.Screen>
              <Stack.Screen
                  name={NavTo.Listings}
                  options={{title: NavTo.Listings, animation: 'none'}}
              >
              {(props: any) => <ListingsScreen
              {...props}
              mobile={mobile}
              url={url}
              />}
              </Stack.Screen>
              <Stack.Screen
                  name={NavTo.Messages}
                  options={{title: NavTo.Messages, animation: 'none'}}
              >
              {(props: any) => <MessagesScreen
              {...props}
              mobile={mobile}
              url={url}
              />}
              </Stack.Screen> 
              <Stack.Screen
                  name={NavTo.Logout}
                  options={{title: NavTo.Logout, animation: 'none'}}
              >
              {(props: any) => <LogoutScreen
              {...props}
              mobile={mobile}
              url={url}
              />}
              </Stack.Screen>
            </Stack.Navigator>
          </View>
        </ScrollView>
        {Platform.OS === 'web' ?
        <Navigation
        setAccountView={setAccountView}
        dimensions={navDimensions}
        screen={page}
        setDimensions={setNavDimensions}
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