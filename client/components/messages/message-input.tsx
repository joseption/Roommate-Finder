import React, { useEffect, useState } from "react";
import { TextInput, View, StyleSheet } from "react-native";
import _Button from "../control/button";
import { env, getLocalStorage } from "../../helper";
import { Socket } from "socket.io-client";
import { DefaultEventsMap } from '@socket.io/component-emitter';

interface Props {
  chat: any,
  socket: Socket<DefaultEventsMap, DefaultEventsMap>
}

const MessageInput = ({chat, socket}: Props) => {
  const [newMessage, setNewMessage] = useState('');
  const [userInfo, setUserInfo] = useState<any>();

  useEffect(() => {
    getUserInfo();
  }, [])
  
  const getUserInfo = async () => {
    setUserInfo(await getLocalStorage().then((res) => {return res.user}));
  }
  
  const sendMessage = () => {
    if (newMessage === '') {
      return;
    }

    let obj = {content: newMessage, userId: userInfo.id, chatId: chat.id};
    let js = JSON.stringify(obj);

    return fetch(
      `${env.URL}/messages`, {method:'POST', body:js, headers:{'Content-Type': 'application/json'}}
    ).then(async ret => {
      let res = JSON.parse(await ret.text());
      if (res.Error) {
        console.warn("Error: ", res.Error);
      }
      else {
        const randomNum = () => {
          (Math.floor(Math.random() * 20) + 1).toString()
        }

        const data = {
          chatId: chat.id,
          content: newMessage,
          userId: userInfo.id,
          // id is temporary for rendering purposes. 
          // It provides no value otherwise.
          id: randomNum(),
        }
        await socket.emit('send_message', data);
        setNewMessage('');
      }
    });
  };

  return (
    <View style={styles.container}>
      <TextInput
        value={newMessage}
        onChangeText={setNewMessage}
        style={styles.input}
        multiline
      />
      <_Button onPress={sendMessage}>Send</_Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: 'whitesmoke',
    padding: 5,
    paddingHorizontal: 10,
    marginTop: 10,
    alignItems: 'center',
  },
  input: {
    appearance: 'none',
    flex: 1,
    backgroundColor: 'white',
    padding: 5,
    marginHorizontal: 10,

    borderRadius: 50,
    borderColor: 'lightgray',
    borderWidth: StyleSheet.hairlineWidth,
  },
});

export default MessageInput;