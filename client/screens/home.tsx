import React from 'react';
import { Button, StyleSheet, Text, View } from 'react-native';
import _Button from '../components/control/button';
import { Style } from '../style';

const HomeScreen = ({navigation}:any) => {
  return (
    <View>
        <_Button
            style={Style.buttonSuccess}
            navigateTo='Login'
            navigation={navigation}
        >
            Login
        </_Button>
    </View>
  );
};

export default HomeScreen;