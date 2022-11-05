import { NavigationContainer, StackRouter, useLinkProps, useNavigation } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from './screens/home';
import { useFonts } from 'expo-font';
import { library } from '@fortawesome/fontawesome-svg-core'
import Navigation from './components/navigation/navigation';
import React, { createContext, useEffect, useState } from 'react';
import { Dimensions, Linking, ScrollView, StyleSheet, Text, View } from 'react-native';
import 'react-native-gesture-handler';
import {StackNavigationProp} from '@react-navigation/stack';
import AccountScreen from './screens/account';
import ProfileScreen from './screens/profile';
import SurveyScreen from './screens/survey';
import ListingsScreen from './screens/listings';
import MessagesScreen from './screens/messages';
import MatchesScreen from './screens/matches';
import ExploreScreen from './screens/explore';
import { Color, Content } from './style';
import { config, isMobile, linking, NavTo, Page, Stack } from './service';
import LogoutScreen from './screens/logout';
import LoginScreen from './screens/login';

export const App = () => {
  const [navDimensions,setNavDimensions] = useState({height: 0, width: 0});
  const [style,setStyle] = useState({});
  const [containerStyle,setContainerStyle] = useState({});
  const [mobile,setMobile] = useState(false);
  const [page,setPage] = useState('');
  const [init,setInit] = useState(false);
  const [adjustedPos,setAdjustedPos] = useState(0);
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

    if (!init) {
      Linking.getInitialURL().then((url: any) => {
        if (url && url.toLowerCase().includes(config.screens.Login)) {
          setPage(NavTo.Login);
        }
      });
      setInit(true);
    }

    prepareStyle();
    return () => subscription?.remove();
  }, [navDimensions.height, page, mobile, adjustedPos]);
  
  if (!loaded) {
    return null;
  }

  const routeName = (): keyof Page => {
    // JA TODO need logic to decide route name for now just return home
    return NavTo.Account;
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
    var paddingLeft = 0;
    var paddingRight = 0;
    var backgroundColor = Color.holder;
    var translate = adjustedPos;
    if (mobile) {
      backgroundColor = Color.white;
      paddingLeft = 10;
      paddingRight = 10;
      translate = 0;
    }
    var paddingTop = page === NavTo.Login ? 0 : 10;

    var content = {
      paddingLeft: paddingLeft,
      paddingRight: paddingRight,
      paddingTop: paddingTop,
      transform: [{translateX: translate}]
    };
    var container = {
      backgroundColor: backgroundColor,
      marginTop: navDimensions.height,
    }
    setStyle(content);
    setContainerStyle(container);
  }

  const scroll = (e: any) => {
      getOffset(e.nativeEvent.contentSize.width);
  }

  return (
    <NavigationContainer
    linking={linking}
    >
      <ScrollView
      contentContainerStyle={styles.scrollParentContainer}
      style={[containerStyle, styles.container]}
      onScroll={(e) => scroll(e)}
      scrollEventThrottle={100}
      onContentSizeChange={(w, h) => getScrollDims(w, h)}
      >
        <View
        style={[style, styles.stack]}
        >
          <Stack.Navigator
          screenOptions={{headerShown: false, contentStyle: {backgroundColor: mobile ? Color.white : Color.holder}}}
          initialRouteName={routeName()}
          screenListeners={{
            state: (e: any) => state(e)
          }}
          >
            <Stack.Screen
                name={NavTo.Home}
            >
            {(props: any) => <HomeScreen {...props} mobile={mobile} />}
            </Stack.Screen>
            <Stack.Screen
                name={NavTo.Login}
            >
                {(props: any) => <LoginScreen {...props} mobile={mobile} />}
            </Stack.Screen>
            <Stack.Screen
                name={NavTo.Account}
            >
            {(props: any) => <AccountScreen {...props} mobile={mobile} />}
            </Stack.Screen>
            <Stack.Screen
                name={NavTo.Profile}
            >
            {(props: any) => <ProfileScreen {...props} mobile={mobile} />}
            </Stack.Screen> 
            <Stack.Screen
                name={NavTo.Survey}
            >
            {(props: any) => <SurveyScreen {...props} mobile={mobile} />}
            </Stack.Screen>
            <Stack.Screen
                name={NavTo.Matches}
            > 
            {(props: any) => <MatchesScreen {...props} mobile={mobile} />}
            </Stack.Screen>
            <Stack.Screen
                name={NavTo.Explore}
            > 
            {(props: any) => <ExploreScreen {...props} mobile={mobile} />}
            </Stack.Screen>
            <Stack.Screen
                name={NavTo.Listings}
            >
            {(props: any) => <ListingsScreen {...props} mobile={mobile} />}
            </Stack.Screen>
            <Stack.Screen
                name={NavTo.Messages}
            >
            {(props: any) => <MessagesScreen {...props} mobile={mobile} />}
            </Stack.Screen> 
            <Stack.Screen
                name={NavTo.Logout}
            >
            {(props: any) => <LogoutScreen {...props} mobile={mobile} />}
            </Stack.Screen>
          </Stack.Navigator>
        </View>
      </ScrollView>
      <Navigation
      dimensions={navDimensions}
      setDimensions={setNavDimensions}
      mobile={mobile}
      >
      </Navigation>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  stack: {
    marginLeft: 'auto',
    marginRight: 'auto',
    width: '100%',
    maxWidth: Content.width,
    height: '100%'
  },
  container: {
    flex: 1,
    height: '100%',
  },
  scrollParentContainer: {
    height: '100%',
  },
});

export default App;