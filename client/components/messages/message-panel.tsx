import { useRef, useEffect, Dispatch, SetStateAction } from 'react';
import { View, StyleSheet, Animated, Easing, Dimensions } from 'react-native';
import _Button from '../control/button';
import Messages from './messages';
import MessageInput from './message-input';
import MessageTopBar from './message-top-bar';

interface Props {
  showPanel: boolean,
  updateShowPanel: Dispatch<SetStateAction<boolean>>,
  userInfo: any,
  chat: any,
  socket: any
}

const MessagePanel = ({ showPanel, updateShowPanel, userInfo, chat, socket }: Props) => {
  // These values are mapped to percentage of screen size.
  const PANEL_OUT_OF_SCREEN = Dimensions.get('window').width * 1.5;
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
            {translateX: slideAnimation},
          ]}
        ]}
      >
        <MessageTopBar chat={chat} showPanel={showPanel} updateShowPanel={updateShowPanel}/>
        <Messages chat={chat} userInfo={userInfo} socket={socket}/>
        <MessageInput chat={chat} socket={socket}/>
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