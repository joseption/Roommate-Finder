import { useRef, useEffect, Dispatch, SetStateAction } from 'react';
import { View, StyleSheet, Animated, Easing, Dimensions, Text } from 'react-native';
import _Button from '../control/button';
import Messages from './messages';

interface Props {
  showPanel: boolean,
  updateShowPanel: Dispatch<SetStateAction<boolean>>,
  chat: any,
}

const MessagePanel = ({ showPanel, updateShowPanel, chat }: Props) => {
  // These values are mapped to percentage of screen size.
  const PANEL_OUT_OF_SCREEN = 1.5;
  const PANEL_IN_SCREEN = 0;

  const slideAnimation = useRef(new Animated.Value(PANEL_OUT_OF_SCREEN)).current;
  
  let animationConfig = {
    toValue: PANEL_OUT_OF_SCREEN,
    duration: 400,
    easing: Easing.ease,
    useNativeDriver: true,
  };

  useEffect(() => {
    if (showPanel) {
      Animated.timing(slideAnimation, {...animationConfig, toValue: PANEL_IN_SCREEN}).start();
    } else {
      Animated.timing(slideAnimation, {...animationConfig}).start();
    }
  }, [showPanel, slideAnimation]);

  return (
    <>
      {/*
        This view prevents user from reclicking tab when panel
        animates in screen.
      */}
      <View style={(showPanel) ? styles.hiddenContainer : null}/>
      <Animated.View 
        style={[
          styles.container,
          {transform: [
            // interpolate maps integer value to string percentage.
            {translateX: slideAnimation.interpolate({
              inputRange: [0, 1],
              outputRange: ['0%', '100%']
            })},
          ]}
        ]}
      >
        <_Button onPress={() => updateShowPanel(!showPanel)}>Back</_Button>
        <Messages chat={chat}/>
      </Animated.View>
    </>
  );
};

const styles = StyleSheet.create({
  hiddenContainer: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backgroundColor: 'transparent',
  },
  container: {
    position: 'absolute',
    width: Dimensions.get('window').width - 20,
    height: '100%',
    backgroundColor: 'white',
  },
});

export default MessagePanel;