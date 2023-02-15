import React, { useEffect, useState } from "react";
import { TextInput, View, StyleSheet, Pressable, Text } from "react-native";
import { authTokenHeader, env, getLocalStorage } from "../../helper";
import { Socket } from "socket.io-client";
import { DefaultEventsMap } from '@socket.io/component-emitter';
import { Svg, Path } from "react-native-svg";

const sendIcon = (
  <Svg
    width={30}
    height={30}
    fill="none"
  >
    <Path
      d="M25.734 14.165 5.11 3.853a.937.937 0 0 0-1.012.112.937.937 0 0 0-.31.938L6.564 15 3.75 25.069a.938.938 0 0 0 .938 1.18.938.938 0 0 0 .421-.102l20.625-10.313a.937.937 0 0 0 0-1.669ZM6.141 23.54l2.072-7.603h8.662v-1.875H8.213L6.14 6.46 23.213 15 6.14 23.54Z"
      fill="#418DFC"
    />
  </Svg>
);

interface Props {
  chat: any,
  userInfo: any,
  socket: Socket<DefaultEventsMap, DefaultEventsMap>,
  newMessage: string,
  setNewMessage: any,
}

const MessageInput = ({chat, userInfo, socket, newMessage, setNewMessage}: Props) => {
  const [height, setHeight] = useState(0);
  const [hiddenTextWidth, setHiddenTextWidth] = useState(0);

  const randomNum = () => {
    return (Math.floor(Math.random() * 999999) + 1).toString();
  }
  
  useEffect(() => {
    setTypingIndicator();
  }, [newMessage])

  const prepareTypingIndicatorData = async (isTyping: boolean) => {
    const data = {
      chatId: chat.id,
      typingIndicator: true,
      isTyping: isTyping,
      userId: userInfo?.id,
      // id is temporary for rendering purposes. 
      // It provides no value otherwise.
      id: randomNum(),
    }
    socket.emit('send_typing', data);
  }

  const setTypingIndicator = async (remove?: boolean) => {
    if (remove) {
      await prepareTypingIndicatorData(false);
      return;
    };
    await prepareTypingIndicatorData(newMessage?.length !== 0);
  }

  const sendNotification = async () => {
    const obj = {userId: chat?.users[0].id, chatId: chat.id};
    const js = JSON.stringify(obj);
    const tokenHeader = await authTokenHeader();
    return fetch(
      `${env.URL}/notifications`, {method:'POST', body:js, headers:{'Content-Type': 'application/json', 'authorization': tokenHeader}}
    ).then(async ret => {
      let res = JSON.parse(await ret.text());
      if (res.Error) {
        console.warn("Error: ", res.Error);
      } else {
        if (!res.id) return;
        const data = {
          chatId: chat.id,
        };
        socket.emit('send_notification', data);
      }
    });
  };
  
  const sendMessage = async () => {
    if (newMessage === '') {
      return;
    }

    const data = {
      chatId: chat.id,
      content: newMessage,
      userId: userInfo.id,
      // id is temporary for rendering purposes. 
      // It provides no value otherwise.
      id: randomNum(),
    }
    await setTypingIndicator(true);
    await socket.emit('send_message', data);

    const obj = {content: newMessage, userId: userInfo.id, chatId: chat.id};
    const js = JSON.stringify(obj);
    const tokenHeader = await authTokenHeader();
    return fetch(
      `${env.URL}/messages`, {method:'POST', body:js, headers:{'Content-Type': 'application/json', 'authorization': tokenHeader}}
    ).then(async ret => {
      let res = JSON.parse(await ret.text());
      if (res.Error) {
        console.warn("Error: ", res.Error);
      }
      else {
        setNewMessage('');
        sendNotification();
      }
    });
  };

  const blockedBox = (
    <Text style={styles.blockedInput}>
      This chat has been blocked
    </Text>
  )

  const inputBox = (
    <>
      <TextInput
        value={newMessage}
        onChangeText={setNewMessage}
        onLayout={(e) => setHiddenTextWidth(e.nativeEvent.layout.width)}
        style={[styles.input, {height: height}]}
        placeholder={'Aa'}
        multiline
      />
      <View style={styles.buttonContainer}>
        <Pressable onPress={sendMessage}>
          {sendIcon}
        </Pressable>
      </View>
      <Text style={[styles.hidden, {width: hiddenTextWidth}]} onLayout={(e) => {setHeight(e.nativeEvent.layout.height)}}>
        {newMessage}
      </Text>
    </>
  )

  return (
    <View style={styles.container}>
      {(chat.blocked) ? blockedBox : inputBox}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    padding: 5,
    paddingHorizontal: 10,
    alignItems: 'center',
    minHeight: 55,
  },
  input: {
    appearance: 'none',
    flex: 1,
    backgroundColor: 'white',
    padding: 10,
    marginHorizontal: 10,

    borderRadius: 15,
    borderColor: 'lightgray',
    borderWidth: StyleSheet.hairlineWidth,
  },
  blockedInput: {
    flex: 1,
    textAlign: 'center',
    fontWeight: 'bold',
    color: 'grey'
  },
  buttonContainer: {
    display: 'flex',
    flexDirection: 'row',
    height: '100%',
    paddingBottom: 9,
    alignItems: 'flex-end'
  },
  hidden: {
    position: 'absolute',
    top: 10000,
    right: 10000,
    backgroundColor: 'transparent',
    borderColor: 'transparent',
    color: 'transparent',
    padding: 10,
    marginHorizontal: 10,
    minHeight: 41,
    maxHeight: 115,
  }
});

export default MessageInput;