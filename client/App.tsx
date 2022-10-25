import React, { FC } from 'react';
import { Button, StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Login from './screens/login';
import Home from './screens/home';

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
  return (
    <NavigationContainer
    linking={linking}
    >
      <Stack.Navigator
      screenOptions={{headerShown: false}}
      >
        <Stack.Screen
            name="Home"
            component={Home}
          />
        <Stack.Screen
            name="Login"
            component={Login}
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