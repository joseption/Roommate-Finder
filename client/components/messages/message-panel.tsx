import { useRef, useEffect, Dispatch, SetStateAction } from 'react';
import { View, StyleSheet, Animated, Easing } from 'react-native';
import _Button from '../control/button';

interface Props {
  showPanel: boolean,
  updateShowPanel: Dispatch<SetStateAction<boolean>>,
}

const MessagePanel = ({ showPanel, updateShowPanel }: Props) => {
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
        <_Button onPress={() => updateShowPanel(!showPanel)}>Go back</_Button>
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
    width: '100%',
    height: '100%',
    backgroundColor: 'white',
  },
});

export default MessagePanel;