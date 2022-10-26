import React, { useEffect, useRef, useState } from 'react';
import { Pressable, StyleSheet, Text, View, Animated, Dimensions } from 'react-native';
import _Button from '../components/control/button';
import _Text from '../components/control/text';
import ForgotPassword from '../components/login/forgot-password';
import Login from '../components/login/login';
import PasswordResetSent from '../components/login/password-reset-sent';
import { Color, Radius, Style } from '../style';

const LoginScreen = ({navigation}:any) => {
    const [width, setWidth] = useState(0);
    const [left, setLeft] = useState(0);
    const goLeft = (idx: number) => {
        const oldLeft = left;
        setLeft(((width + 40) * idx) + left);
        Animated.timing(new Animated.Value(oldLeft), {
        toValue: left,
        duration: 150,
        useNativeDriver: false,
        }).start();
    };
      
    const goRight = (idx: number) => {
        const oldLeft = left;
        setLeft(-(((width + 40) * idx)) + left);
        Animated.timing(new Animated.Value(oldLeft), {
        toValue: left,
        duration: 150,
        useNativeDriver: false,
        }).start();
    };

    const setLayout = (e: any) => {
        setWidth(e.nativeEvent.layout.width);
    }

  return (
    <View style={styles.container}> 
        <Animated.View
        onLayout={(e) => setLayout(e)}
        style={[styles.content, {transform:[{translateX:left}]}]}>
            <Login
              forgotPasswordPressed={() => goRight(1)}
              style={styles.panel}
            />
            <ForgotPassword
              sendEmailPressed={() => goRight(1)}
              backToLoginPressed={() => goLeft(1)}
              style={styles.panel}
            />
            <PasswordResetSent
              sendEmailPressed={() => goLeft(2)}
              style={styles.panel}
            />
        </Animated.View>
    </View>
  );
};

export const styles = StyleSheet.create({
    container: {
      backgroundColor: Color.white,
      opacity:.95,
      padding:40,
      minWidth:400,
      minHeight:600,
      maxWidth:400,
      maxHeight:600,
      borderRadius:Radius.large,
      margin:'auto',
      overflow:'hidden',
      border:Color.border,
      shadowColor: Color.borderSecondary,
      shadowOffset: {width: -3, height: 3},
      shadowOpacity: 1,
      shadowRadius: 0,
    },
    content: {
        display:'flex',
        flexDirection: 'row',
        width:'100%',
        height:'100%',
        transition: 'ease .15s transform',
        gap: 40
    },
    panel: {
        width:'100%'
    }
  });

export default LoginScreen;