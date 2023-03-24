import React, { useEffect, useState } from "react";
import { TextInput, View, StyleSheet, Pressable, Text, TouchableHighlight } from "react-native";
import { authTokenHeader, env, getLocalStorage, isDarkMode } from "../../helper";
import { Socket } from "socket.io-client";
import { DefaultEventsMap } from '@socket.io/component-emitter';
import { Svg, Path } from "react-native-svg";
import _TextInput from "../control/text-input";
import { Color, Radius } from "../../style";

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
  isDarkMode: boolean
}

const MessageInput = ({chat, userInfo, socket, newMessage, setNewMessage, isDarkMode}: Props) => {
  const [msgHeight, setMsgHeight] = useState(40);
  const [wasTyping, setWasTyping] = useState(false);
  
  useEffect(() => {
    setTypingIndicator();
  }, [newMessage])

  const prepareTypingIndicatorData = async (isTyping: boolean) => {
    const data = {
      chatId: chat.id,
      typingIndicator: true,
      isTyping: isTyping,
      userId: userInfo?.id,
    }
    socket.emit('send_typing', data);
    setWasTyping(isTyping);
  }

  const setTypingIndicator = async (remove?: boolean) => {
    if (remove) {
      await prepareTypingIndicatorData(false);
      return;
    };
    if (wasTyping && newMessage?.length !== 0)
      return;

    await prepareTypingIndicatorData(newMessage?.length !== 0);
  }

  // const sendNotification = async () => {
  //   const obj = {userId: chat?.userInfo?.id, chatId: chat.id};
  //   const js = JSON.stringify(obj);
  //   const tokenHeader = await authTokenHeader();
  //   const data = {
  //     userId: obj.userId,
  //     chatId: chat.id,
  //   };
  //   socket.emit('send_notification', data);
  //   return fetch(
  //     `${env.URL}/notifications`, {method:'POST', body:js, headers:{'Content-Type': 'application/json', 'authorization': tokenHeader}}
  //   ).then(async ret => {
  //     let res = JSON.parse(await ret.text());
  //     if (res.Error) {
  //       console.warn("Error: ", res.Error);
  //     }
  //   });
  // };
  
  const sendMessage = async () => {
    console.log("send message");
    let msg = newMessage.trim();
    if (msg === '') {
      return;
    }

    const obj = {content: msg, userId: userInfo.id, chatId: chat.id, sendToId: chat?.userInfo?.id};
    const js = JSON.stringify(obj);
    
    try {
      const tokenHeader = await authTokenHeader();
      fetch(
        `${env.URL}/messages`, {method:'POST', body:js, headers:{'Content-Type': 'application/json', 'authorization': tokenHeader}}
      ).then(async ret => {
        let res = JSON.parse(await ret.text());
        if (res.Error) {
          console.warn("Error: ", res.Error);
        }
      });
    } catch (e) {
      console.warn("Error: failed sending message request. ", e);
    }
    const dataSend = {
      chatId: chat.id,
      content: newMessage,
      userId: userInfo.id,
    }
    socket.emit('send_message', dataSend);
    const dataNotif = {
      userId: obj.userId,
      chatId: chat.id,
    };
    socket.emit('send_notification', dataNotif);
    setNewMessage('');
    giveMsgHeight(0);
    await setTypingIndicator(true);
  };

  const giveMsgHeight = (height: number) => {
    let h = 40;
    if (height >= h)
      h = height;
    if (height > 200)
      h = 200;
    setMsgHeight(h);
  }

  const styles = StyleSheet.create({
    container: {
      flexDirection: 'row',
      paddingLeft: 10,
      paddingRight: 5,
      alignItems: 'center',
      backgroundColor: Color(isDarkMode).contentBackgroundSecondary,
      paddingVertical: 10
    },
    blockedInput: {
      flex: 1,
      textAlign: 'center',
      fontWeight: 'bold',
      color: Color(isDarkMode).textTertiary
    },
    buttonContainer: {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      marginLeft: 5,
      borderRadius: Radius.round,
      padding: 10
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

  const blockedBox = (
    <Text style={styles.blockedInput}>
      Unable to contact user
    </Text>
  )

  const inputBox = (
    <>
      <_TextInput
        value={newMessage}
        onChangeText={setNewMessage}
        style={{paddingTop: 8}}
        placeholder='Message'
        multiline={true}
        isDarkMode={isDarkMode}
        containerStyle={{width: '100%', flexDirection: 'row', flex: 1}}
        innerContainerStyle={{width: '100%'}}
        onContentSizeChange={(e: any) => giveMsgHeight(e.nativeEvent.contentSize.height)}
        height={msgHeight}
      />
      <TouchableHighlight
        underlayColor={Color(isDarkMode).underlayMask}
        style={styles.buttonContainer}
        onPress={() => sendMessage()}>
          {sendIcon}
      </TouchableHighlight>
    </>
  )

  return (
    <View style={styles.container}>
      {(chat.blocked) ? blockedBox : inputBox}
    </View>
  );
}

export default MessageInput;