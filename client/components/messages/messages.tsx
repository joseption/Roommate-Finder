import { FlatList } from "react-native";
import Message from "./message";
import { useCallback, useEffect, useRef, useState } from "react";
import { env } from "../../helper";
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
    socket.on('receive_message', (data: any) => {
      if (data.chatId === chatRef.current.id) {
        setMessages([data, ...messagesRef.current]);
      }
    });
  }, [socket])

  const getMessages = async (id: string) => {
    return fetch(
      `${env.URL}/messages/${id}`, {method:'GET',headers:{'Content-Type': 'application/json'}}
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

  const renderItem = useCallback(({item}:any) => {return <Message message={item} userInfo={userInfoRef.current} key={item.id}/>}, []);

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