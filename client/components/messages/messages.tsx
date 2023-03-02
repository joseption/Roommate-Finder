import { FlatList, StyleSheet, View,Image, ActivityIndicator } from "react-native";
import Message from "./message";
import { useCallback, useEffect, useRef, useState } from "react";
import { authTokenHeader, env, isDarkMode, userId } from "../../helper";
import { Socket } from 'socket.io-client'
import { DefaultEventsMap } from '@socket.io/component-emitter';
import { SafeAreaView } from "react-native-safe-area-context";
import { Color, Radius } from "../../style";
import _Image from "../control/image";

interface Props {
  chat: any,
  userInfo: any,
  socket: Socket<DefaultEventsMap, DefaultEventsMap>
  isDarkMode: boolean,
  image: string,
  receiveTyping: any,
  receiveMessage: any,
  typing: any
}

const Messages = ({typing, receiveTyping, receiveMessage, chat, userInfo, socket, isDarkMode, image}: Props) => {
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const chatRef = useRef(chat);
  const userInfoRef = useRef(userInfo);
  const messagesRef = useRef(messages);
  
  useEffect(() => {
    chatRef.current = chat
    getMessages(chat.id);
    if (messages?.length !== 0 && messages[0].chatId != chatRef.current.id) {
      setLoading(true);
    }
  }, [chat]);

  useEffect(() => {
    userInfoRef.current = userInfo
  }, [userInfo])

  useEffect(() => {
    messagesRef.current = messages;
  }, [messages])

  useEffect(() => {
    if (receiveMessage) {
      if (receiveMessage.chatId !== chatRef.current.id) return;
      setMessages([receiveMessage, ...messagesRef.current]);
    }
  }, [receiveMessage])

  const getMessages = async (id: string) => {
    if (!id) return;
    const tokenHeader = await authTokenHeader();
    return fetch(
      `${env.URL}/messages/${id}`, {
        method:'GET',
        headers:{'Content-Type': 'application/json', 'authorization': tokenHeader}
      }
    ).then(async ret => {
      let res = JSON.parse(await ret.text());
      if (res?.Error) {
        console.warn("Error: ", res.Error);
        return {};
      }
      else {
        setMessages(res);
        setLoading(false);
      }
    });
  }

  const isTyping = () => {
    if (chatRef && chatRef.current && typing) {
      if (chatRef.current.blocked) {
        return false;
      }
      
      let chattingUser = typing.find((x: any) => {
        return x.chat === chatRef.current.id && x.user !== userInfoRef.current.id;
      });

      return chattingUser;
    }
    else {
      return false;
    }
  }

  const renderItem = useCallback(({item}:any) => {
    let idx = messages.findIndex(x => item.id === x.id);
    if (idx > -1) {
      // Give last message an icon from other user
      let id = userInfoRef?.current?.id;
      if (id && messages && messages.length > 0) {
        if (item.userId != id && 
            (messages[idx - 1] && messages[idx - 1].userId == id) ||
            !messages[idx - 1] ||
            messages[idx - 1]?.typingIndicator) {
              item.showImg = true;
              item.lastFromMsg = !messages[idx - 1];
        }
        else {
          item.showImg = false;
        }
        if (item.userId != id && messages[idx + 1] && messages[idx + 1].userId == id) {
          item.firstFromInBlock = true;
        }
        else {
          item.firstFromInBlock = false;
        }
      }
    }

    return (
      <Message
        message={item}
        userInfo={userInfoRef.current}
        key={item.id}
        isTypingIndicator={item?.typingIndicator}
        isDarkMode={isDarkMode}
        image={image}
      />
    )
  }, [isDarkMode, messagesRef?.current]);

  const styles = StyleSheet.create({
    loading: {
      height: '100%'
    },
    image: {
      height: image ? 35 : 30,
      width: image ? 35 : 30,
      borderRadius: Radius.round,
    },
    imageContainerStyle: {
      minHeight: 35,
      minWidth: 35,
      marginRight: 10,
      borderRadius: Radius.round,
      borderColor: Color(isDarkMode).separator,
      borderWidth: 1,
      backgroundColor: Color(isDarkMode).userIcon,
      justifyContent: 'center',
      alignItems: 'center',
      flexDirection: 'row'
    },
    fromMsgContainer: {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'flex-end',
    },
    myMessage: {
      marginVertical: 1,
      paddingVertical: 7,
      paddingHorizontal: 10,
      borderRadius: Radius.default,
      backgroundColor: Color(isDarkMode).msgToBG,
      color: Color(isDarkMode).msgToFG,
      alignSelf: 'flex-end',
      maxWidth: '60%'
    },
    theirMessage: {
      backgroundColor: Color(isDarkMode).msgFromBG,
      alignSelf: 'flex-start',
      color: Color(isDarkMode).msgFromFG,
      maxWidth: '60%',
    },
  });

  const getUserIcon = () => {
    if (image)
      return {uri: image};
    else
      return require('../../assets/images/user.png');
  }

  const indicator = () => {
    return <>
    {isTyping() ?
      <View>
        <View
        style={styles.fromMsgContainer}
        >
          <_Image
            height={image ? 35 : 30}
            width={image ? 35 : 30}
            style={styles.image}
            containerStyle={styles.imageContainerStyle}
            source={getUserIcon()}
          />
          <View style={[styles.myMessage, styles.theirMessage]}>
            <_Image width={25} source={!isDarkMode ? require('../../assets/images/indicator_light.gif') : require('../../assets/images/indicator_dark.gif')}></_Image>
        </View>
      </View>
    </View>
    : null }
    </>
  }

  if (loading) {
    return (
      <View style={{flex: 1, backgroundColor: Color(isDarkMode).contentBackgroundSecondary}}>
        <ActivityIndicator style={styles.loading} color={Color(false).gold} size="large"/>
      </View>
    );
  }

  return (
    <View style={{flex: 1, zIndex: 1, backgroundColor: Color(isDarkMode).contentBackgroundSecondary}}>
      <FlatList
        data={messages}
        renderItem={renderItem}
        initialNumToRender={50}
        removeClippedSubviews
        ListHeaderComponent={indicator()}
        inverted
        style={{padding: 10}}
      />
    </View>
  );
}

export default Messages;