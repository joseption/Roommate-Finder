import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen, { styles } from './screens/login';
import HomeScreen from './screens/home';
import { useFonts } from 'expo-font';
import { library } from '@fortawesome/fontawesome-svg-core'
import { faCheck, faXmark, faMessage, faCaretDown, faUser, faPoll, faHouseFlag, faCheckDouble, faEdit, faGlobe, faPaintBrush } from '@fortawesome/free-solid-svg-icons'
import Navigation from './components/navigation/navigation';
import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
import 'react-native-gesture-handler';
import {StackNavigationProp} from '@react-navigation/stack';
import AccountScreen from './screens/account';
import ProfileScreen from './screens/profile';
import SurveyScreen from './screens/survey';
import SearchScreen from './screens/explore';
import ListingsScreen from './screens/listings';
import MessagesScreen from './screens/messages';
import MatchesScreen from './screens/matches';
import ExploreScreen from './screens/explore';

library.add(faCheck, faXmark, faMessage, faCaretDown, faUser, faPoll, faHouseFlag, faCheckDouble, faEdit, faGlobe)

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
  },
};

const linking = {
  prefixes: ['/'],
  config,
};

export const App = () => {
  const [navDimensions,setNavDimensions] = useState({height: 0, width: 0});
  const [style,setStyle] = useState({});
  const [loaded] = useFonts({
    'Inter-Regular': require('./assets/fonts/Inter-Regular.ttf'),
    'Inter-Bold': require('./assets/fonts/Inter-Bold.ttf'),
    'Inter-SemiBold': require('./assets/fonts/Inter-SemiBold.ttf'),
    'Inter-Thin': require('./assets/fonts/Inter-Thin.ttf'),
  });

  useEffect(() => {
    var nav = {
      marginTop: navDimensions.height,
      flex: 1,
    };
    setStyle(nav);
  }, [navDimensions.height]);
  
  if (!loaded) {
    return null;
  }

  const routeName = (): keyof Page => {
    // JA TODO need logic to decide route name for now just return home
    return "Home";
  }

  return (
    <NavigationContainer
    linking={linking}
    >
      <View
      style={style}
      >
        <Stack.Navigator
        screenOptions={{headerShown: false}}
        initialRouteName={routeName()}
        >
          <Stack.Screen
              name={NavTo.Home}
              component={HomeScreen}
          />
          <Stack.Screen
              name={NavTo.Login}
              component={LoginScreen}
          />
          <Stack.Screen
              name={NavTo.Account}
              component={AccountScreen}
          />
          <Stack.Screen
              name={NavTo.Profile}
              component={ProfileScreen}
          /> 
          <Stack.Screen
              name={NavTo.Survey}
              component={SurveyScreen}
          /> 
          <Stack.Screen
              name={NavTo.Matches}
              component={MatchesScreen}
          /> 
          <Stack.Screen
              name={NavTo.Explore}
              component={ExploreScreen}
          /> 
          <Stack.Screen
              name={NavTo.Listings}
              component={ListingsScreen}
          /> 
          <Stack.Screen
              name={NavTo.Messages}
              component={MessagesScreen}
          /> 
        </Stack.Navigator>
      </View>
      <Navigation
      dimensions={navDimensions}
      setDimensions={setNavDimensions}
      >
      </Navigation>
    </NavigationContainer>
  );
};

export default App;