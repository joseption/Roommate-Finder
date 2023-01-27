import { FlatList } from "react-native";
import Message from "./message";
import { useEffect, useState } from "react";
import { env } from "../../helper";
import io, { Socket } from 'socket.io-client'
import { DefaultEventsMap } from '@socket.io/component-emitter';

interface Props {
  chat: any,
  socket: Socket<DefaultEventsMap, DefaultEventsMap>
}

const Messages = ({chat, socket}: Props) => {
  const [messages, setMessages] = useState<any[]>([]);
  
  useEffect(() => {
    getMessages(chat.id);
  }, [chat])

  
  useEffect(() => {
    socket.on('receive_message', (data: any) => {
      setMessages([data, ...messages]);
    });
  }, [socket, messages])

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
    <FlatList
      data={messages}
      renderItem={({ item }) => <Message message={item} />}
      inverted
    />
  );
}

export default Messages;