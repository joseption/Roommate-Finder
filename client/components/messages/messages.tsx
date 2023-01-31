import { FlatList } from "react-native";
import Message from "./message";
import { useEffect, useRef, useState } from "react";
import { env } from "../../helper";
import { Socket } from 'socket.io-client'
import { DefaultEventsMap } from '@socket.io/component-emitter';
import { SafeAreaView } from "react-native-safe-area-context";

interface Props {
  chat: any,
  socket: Socket<DefaultEventsMap, DefaultEventsMap>
}

const Messages = ({chat, socket}: Props) => {
  const [messages, setMessages] = useState<any[]>([]);
  const chatRef = useRef(chat);
  const messagesRef = useRef(messages);
  
  useEffect(() => {
    chatRef.current = chat
    getMessages(chat.id);
  }, [chat])

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

  return (
    <SafeAreaView style={{flex: 1}}>
      <FlatList
        data={messages}
        renderItem={({ item }) => <Message message={item} key={item.id}/>}
        inverted
      />
    </SafeAreaView>
  );
}

export default Messages;