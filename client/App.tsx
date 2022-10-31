import React, { FC, useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from './screens/login';
import HomeScreen from './screens/home';
import { useFonts } from 'expo-font';
import { library } from '@fortawesome/fontawesome-svg-core'
import { } from '@fortawesome/free-solid-svg-icons/faSquareCheck'
import { faCheck, faXmark } from '@fortawesome/free-solid-svg-icons'

library.add(faCheck, faXmark)

const Stack = createNativeStackNavigator();

const config = {
  screens: {
    Home: '/',
    Login: '/login',
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
  return (
    <NavigationContainer
    linking={linking}
    >
      <Stack.Navigator
      screenOptions={{headerShown: false}}
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