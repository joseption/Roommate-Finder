import React, { FC, useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from './screens/login';
import HomeScreen from './screens/home';
import { useFonts } from 'expo-font';
import { library } from '@fortawesome/fontawesome-svg-core'
import { faCheck, faXmark, faMessage, faCaretDown, faUser, faPoll, faHouseFlag, faCheckDouble } from '@fortawesome/free-solid-svg-icons'
import Navigation from './components/navigation';
import { Dimensions } from 'react-native';
import { isMobile } from './service';

library.add(faCheck, faXmark, faMessage, faCaretDown, faUser, faPoll, faHouseFlag, faCheckDouble)

const Stack = createNativeStackNavigator();

const config = {
  screens: {
    Home: '/',
    Login: '/login',
    Account: '/account',
  },
};

const linking = {
  prefixes: ['/'],
  config,
};

const App = () => {
  const [loaded] = useFonts({
    'Inter-Regular': require('./assets/fonts/Inter-Regular.ttf'),
    'Inter-Bold': require('./assets/fonts/Inter-Bold.ttf'),
  });
  
  if (!loaded) {
    return null;
  }

  const routeName = () => {
    // need logic to decide route name for now just return login screen
    return "Login"
  }

  return (
    <NavigationContainer
    linking={linking}
    >
      <Navigation/>
      <Stack.Navigator
      screenOptions={{headerShown: false}}
      initialRouteName={routeName()}
      >
        <Stack.Screen
            name="Home"
            component={HomeScreen}
          />
        <Stack.Screen
            name="Login"
            component={LoginScreen}
          />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;