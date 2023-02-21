import { FlatList, StyleSheet, View,Image, ActivityIndicator } from "react-native";
import Message from "./message";
import { useCallback, useEffect, useRef, useState } from "react";
import { authTokenHeader, env, isDarkMode, userId } from "../../helper";
import { Socket } from 'socket.io-client'
import { DefaultEventsMap } from '@socket.io/component-emitter';
import { SafeAreaView } from "react-native-safe-area-context";
import { Color } from "../../style";

interface Props {
  chat: any,
  userInfo: any,
  socket: Socket<DefaultEventsMap, DefaultEventsMap>
  isDarkMode: boolean,
  image: string
}

const Messages = ({chat, userInfo, socket, isDarkMode, image}: Props) => {
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const chatRef = useRef(chat);
  const userInfoRef = useRef(userInfo);
  const messagesRef = useRef(messages);
  
  useEffect(() => {
    chatRef.current = chat
    getMessages(chat.id);
    if (messages?.length !== 0 && messages[0].chatId != chatRef.current.id) {
      setLoading(true)
    }
  }, [chat])

  useEffect(() => {
    userInfoRef.current = userInfo
  }, [userInfo])

  useEffect(() => {
    messagesRef.current = messages;
  }, [messages])
  
  useEffect(() => {
    // Listen for messages being sent over socket
    socket.on('receive_message', (data: any) => {
      if (data.chatId !== chatRef.current.id) return;
      setMessages([data, ...messagesRef.current]);
    });

    const typingIndicatorExists = () => {
      return messagesRef.current.length !== 0 && messagesRef.current[0].typingIndicator;
    }


    // Listen for typing indicator socket
    socket.on('receive_typing', (data: any) => {
      if (data.chatId !== chatRef.current.id) return;
      if (chatRef.current.blocked) return;
      if (data.userId === userInfoRef.current.id) return;

      if (data.isTyping) {
        if (!typingIndicatorExists()) {
          setMessages([data, ...messagesRef.current])
        }
      } else {
        if (typingIndicatorExists()) {
          let newMessages = [...messagesRef.current]
          newMessages.shift();
          setMessages(newMessages);
        }
      }
    });

    socket.on("connect_error", (err) => {
      if (typingIndicatorExists()) {
        let newMessages = [...messagesRef.current]
        newMessages.shift();
        setMessages(newMessages);
      }
    });
  }, [socket]);

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

  const renderItem = useCallback(({item}:any) => {
    let idx = messages.findIndex(x => item.id === x.id);
    if (idx > -1) {
      // Give last message an icon from other user
      let id = userInfoRef?.current?.id;
      if (id && messages && messages.length > 0) {
        if (item.userId != id && 
            (messages[idx - 1] && messages[idx - 1].userId == id) ||
            !messages[idx - 1]) {
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
    }
  });

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
        inverted
        style={{padding: 10}}
      />
    </View>
  );
}

export default Messages;