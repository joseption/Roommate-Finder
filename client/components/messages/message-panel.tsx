import { useRef, useEffect, Dispatch, SetStateAction, useState } from 'react';
import { View, StyleSheet, Animated, Easing, Dimensions, Text } from 'react-native';
import _Button from '../control/button';
import Messages from './messages';
import MessageInput from './message-input';
import MessageTopBar from './message-top-bar';
import BlockedChat from '../../assets/images/blocked_chat_svg';

interface Props {
  showPanel: boolean,
  updateShowPanel: Dispatch<SetStateAction<boolean>>,
  userInfo: any,
  chat: any,
  socket: any,
  updateBlocked: any,
  updateMuted: any,
  isDarkMode: boolean
  setShowingMessagePanel: any
}

const MessagePanel = ({ setShowingMessagePanel, isDarkMode, showPanel, updateShowPanel, userInfo, chat, socket, updateBlocked, updateMuted }: Props) => {
  const [newMessage, setNewMessage] = useState('');

  // These values are mapped to percentage of screen size.
  const PANEL_OUT_OF_SCREEN = Dimensions.get('window').height * 1.25;
  const PANEL_IN_SCREEN = 0;
  
  const slideAnimation = useRef(new Animated.Value(PANEL_OUT_OF_SCREEN)).current;
  
  let animationConfig = {
    toValue: PANEL_OUT_OF_SCREEN,
    duration: 150,
    easing: Easing.linear,
    useNativeDriver: true,
  };

  useEffect(() => {
    if (showPanel) {
      Animated.timing(slideAnimation, {...animationConfig, toValue: PANEL_IN_SCREEN}).start();
    } else {
      Animated.timing(slideAnimation, {...animationConfig}).start();
    }
  }, [showPanel, slideAnimation]);

  const image = () => {
    if (chat && chat.users && chat.users.length > 0) {
      return chat.users[0].image;
    }
    return "";
  }

  return (
    <>
      {/*
        This view prevents user from reclicking tab when panel
        animates in screen.
      */}
      <View style={(showPanel) ? styles.hiddenContainer : {display: 'none'}}/>
      <Animated.View 
        style={[
          styles.container,
          {transform: [
            // interpolate maps integer value to string percentage.
            {translateY: slideAnimation},
          ]}
        ]}
      >
        <MessageTopBar
          chat={chat}
          userInfo={userInfo}
          showPanel={showPanel}
          updateShowPanel={updateShowPanel}
          updateBlocked={updateBlocked}
          updateMuted={updateMuted}
          socket={socket}
          isDarkMode={isDarkMode}
          setShowingMessagePanel={setShowingMessagePanel}
        />
        <Messages
          chat={chat}
          userInfo={userInfo}
          socket={socket}
          isDarkMode={isDarkMode}
          image={image()}
        />
        <MessageInput
          chat={chat}
          userInfo={userInfo}
          socket={socket}
          newMessage={newMessage}
          setNewMessage={setNewMessage}
          isDarkMode={isDarkMode}
        />
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
  noMessagesContainer: {
    display: 'flex',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f4f4f4',
  },
  textStyle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginHorizontal: 40,
    textAlign: 'center',
  },
});

export default MessagePanel;