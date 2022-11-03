import { NavigationContainer, StackRouter, useLinkProps, useNavigation } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from './screens/home';
import { useFonts } from 'expo-font';
import { library } from '@fortawesome/fontawesome-svg-core'
import { faCheck, faXmark, faMessage, faCaretDown, faUser, faPoll, faHouseFlag, faCheckDouble, faEdit, faGlobe, faPaintBrush, faSignOut } from '@fortawesome/free-solid-svg-icons'
import Navigation from './components/navigation/navigation';
import React, { createContext, useEffect, useState } from 'react';
import { Dimensions, Linking, StyleSheet, View } from 'react-native';
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
import { isMobile } from './service';
import LogoutScreen from './screens/logout';
import LoginScreen from './screens/login';

library.add(faCheck, faXmark, faMessage, faCaretDown, faUser, faPoll, faHouseFlag, faCheckDouble, faEdit, faGlobe, faSignOut)

export const Context = createContext({} as any); 
export type navProp = StackNavigationProp<Page>;
export const NavTo = {
  Home: 'Home' as never,
  Login: 'Login' as never,
  Account: 'Account' as never,
  Profile: 'Profile' as never,
  Survey: 'Survey' as never,
  Matches: 'Matches' as never,
  Explore: 'Explore' as never,
  Listings: 'Listings' as never,
  Messages: 'Messages' as never,
  Logout: 'Logout' as never,
}

export type Page = {
  Home: undefined;
  Login: undefined;
  Account: undefined;
  Profile: undefined;
  Survey: undefined;
  Matches: undefined;
  Explore: undefined;
  Listings: undefined;
  Messages: undefined;
  Logout: undefined;
}

const Stack = createNativeStackNavigator<Page>();

const config = {
  screens: {
    Home: '/',
    Login: '/login',
    Account: '/account',
    Profile: '/profile',
    Survey: '/survey',
    Matches: '/matches',
    Explore: '/explore',
    Listings: '/listings',
    Messages: '/messages',
    Logout: '/logout',
  },
};

const linking = {
  prefixes: ['/'],
  config,
};

export const App = () => {
  const [navDimensions,setNavDimensions] = useState({height: 0, width: 0});
  const [style,setStyle] = useState({});
  const [containerStyle,setContainerStyle] = useState({});
  const [mobile,setMobile] = useState(false);
  const [page,setPage] = useState('');
  const [init,setInit] = useState(false);
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
        if (url.toLowerCase().includes(config.screens.Login)) {
          setPage(NavTo.Login);
        }
      });
      setInit(true);
    }

    prepareStyle();
    return () => subscription?.remove();
  }, [navDimensions.height, page, mobile]);
  
  if (!loaded) {
    return null;
  }

  const routeName = (): keyof Page => {
    // JA TODO need logic to decide route name for now just return home
    return NavTo.Home;
  }

  const state = (e: any) => {
    if (init) {
      var routes = e.data.state.routes;
      if (routes.length > 0) {
        setPage(routes[routes.length - 1].name);
        prepareStyle();
      }
    }
  }

  function prepareStyle() {
    // var padding = (navDimensions.width - Content.width) / 2;
    // if (padding < 0)
    //   padding = 0;

    var paddingLeft = 0;
    var paddingRight = 0;
    var backgroundColor = Color.holder;
    if (mobile) {
      backgroundColor = Color.white;
      paddingLeft = 10;
      paddingRight = 10;
    }
    var paddingTop = page === NavTo.Login ? 0 : 10;

    var content = {
      paddingLeft: paddingLeft,
      paddingRight: paddingRight,
      paddingTop: paddingTop,
    };
    var container = {
      backgroundColor: backgroundColor,
      marginTop: navDimensions.height,
    }
    setStyle(content);
    setContainerStyle(container);
  }

  return (
    <NavigationContainer
    linking={linking}
    >
      <View
      style={[containerStyle, styles.container]}
      >
        <View
        style={[style, styles.stack]}
        >
          <Stack.Navigator
          screenOptions={{headerShown: false}}
          initialRouteName={routeName()}
          screenListeners={{
            state: (e) => state(e)
          }}
          >
            <Stack.Screen
                name={NavTo.Home}
            >
            {(props: any) => <HomeScreen {...props} mobile={mobile} />}
            </Stack.Screen>
            <Stack.Screen
                name={NavTo.Login}>
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
      </View>
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
  },
  container: {
    flex: 1,
  }
});

export default App;