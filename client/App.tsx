import React, { FC } from 'react';
import { Color } from '../client/style'
import { Button, Dimensions, StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from './screens/login';
import HomeScreen from './screens/home';
import { useFonts } from 'expo-font';

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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  greeting: {
    fontSize: 20,
    fontWeight: 'bold',
    margin: 16
  }
});

export default App;