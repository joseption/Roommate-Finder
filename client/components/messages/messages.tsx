import { FlatList } from "react-native";
import Message from "./message";
import { useCallback, useEffect, useRef, useState } from "react";
import { authTokenHeader, env } from "../../helper";
import { Socket } from 'socket.io-client'
import { DefaultEventsMap } from '@socket.io/component-emitter';
import { SafeAreaView } from "react-native-safe-area-context";

interface Props {
  chat: any,
  userInfo: any,
  socket: Socket<DefaultEventsMap, DefaultEventsMap>
}

const Messages = ({chat, userInfo, socket}: Props) => {
  const [messages, setMessages] = useState<any[]>([]);
  const chatRef = useRef(chat);
  const userInfoRef = useRef(userInfo);
  const messagesRef = useRef(messages);
  
  useEffect(() => {
    chatRef.current = chat
    getMessages(chat.id);
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

    // Listen for typing indicator socket
    socket.on('receive_typing', (data: any) => {
      if (data.chatId !== chatRef.current.id) return;

      const typingIndicatorExists = () => {
        return messagesRef.current.length !== 0 && messagesRef.current[0].typingIndicator;
      }

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
    })
  }, [socket]);

  const getMessages = async (id: string) => {
    const tokenHeader = await authTokenHeader();
    return fetch(
      `${env.URL}/messages/${id}`, {method:'GET',headers:{'Content-Type': 'application/json', 'authorization': tokenHeader}}
    ).then(async ret => {
      let res = JSON.parse(await ret.text());
      if (res.Error) {
        console.warn("Error: ", res.Error);
        return {};
      }
      else {
        setMessages(res);
      }
    });
  }

  const renderItem = useCallback(({item}:any) => {
    return (
      <Message
        message={item}
        userInfo={userInfoRef.current}
        key={item.id}
        isTypingIndicator={item?.typingIndicator}
      />
    )
  }, []);

  return (
    <SafeAreaView style={{flex: 1}}>
      <FlatList
        data={messages}
        renderItem={renderItem}
        initialNumToRender={14}
        removeClippedSubviews
        inverted
      />
    </SafeAreaView>
  );
}

export default Messages;