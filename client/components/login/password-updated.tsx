import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { View } from 'react-native';
import _Button from '../../components/control/button';
import _Text from '../../components/control/text';
import { navProp, NavTo } from '../../helper';
import { LoginStyle, Style } from '../../style';
import _TextInput from '../control/text-input';

const PasswordUpdated = (props: any) => {
  const navigation = useNavigation<navProp>();
  const loginPressed = () => {
    navigation.reset({
      index: 0,
      routes: [{name: NavTo.Login}],
    });
    props.loginPressed()
  }

  return (
    <View
    style={props.style}>
      <_Text
      style={[Style(props.isDarkMode).textHuge, Style(props.isDarkMode).boldFont]}
      >
        Password Updated
      </_Text>
      <_Text
      style={[Style(props.isDarkMode).textDefaultTertiary, LoginStyle(props.isDarkMode).actionText]}
      >
        Your password has been updated
      </_Text>
        <View
        style={Style(props.isDarkMode).alignRight}
        >
            <_Button
            isDarkMode={props.isDarkMode}
            style={[Style(props.isDarkMode).buttonDefault]}
            containerStyle={LoginStyle(props.isDarkMode).submitButton}
            onPress={() => loginPressed()}
            >
            Back to Login
            </_Button>
        </View>
    </View>
  );
};

export default PasswordUpdated;