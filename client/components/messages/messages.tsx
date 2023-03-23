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

const Messages = ({typing, receiveMessage, chat, userInfo, isDarkMode, image}: Props) => {
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [typeToggle, setTypeToggle] = useState(false);
  
  useEffect(() => {
    getMessages(chat.id);
    if (messages?.length !== 0 && messages[0].chatId != chat?.id) {
      setLoading(true);
    }
  }, [chat]);

  useEffect(() => {
    if (messages && messages.length > 0) {
      let msgs = messages;
      if (msgs[0]?.userId !== userInfo.id) {
          Object.assign(msgs[0], {showImg: !isTyping()});
      }

      setTypeToggle(!typeToggle);
      setMessages(msgs);
    }
  }, [typing]);

  useEffect(() => {
    if (!receiveMessage || receiveMessage.chatId !== chat?.id) 
      return;

    let idx = messages.length;
    Object.assign(receiveMessage, {index: idx});
    let id = userInfo?.id;
    if (id) {
      if (messages[0] && messages[0].userId != receiveMessage.userId) {
        receiveMessage.firstFromInBlock = true;
      }
      else {
        receiveMessage.firstFromInBlock = false;
      }
      if (receiveMessage.userId != id) {
        receiveMessage.showImg = true;
        receiveMessage.lastFromMsg = true;
        messages[0].showImg = false;
        messages[0].lastFromMsg = false;
      }
      else {
        receiveMessage.showImg = false;
        receiveMessage.lastFromMsg = false;
      }
    }

    setMessages([receiveMessage, ...messages]);

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
        for (let i = 0; i < res.length; i++) {
          // Give last message an icon from other user
          let id = userInfo?.id;
          if (id) {
            if (res[i].userId != id && 
                (res[i - 1] && res[i - 1].userId == id) ||
                !res[i - 1] ||
                res[i - 1]?.typingIndicator) {
                  res[i].showImg = true;
                  res[i].lastFromMsg = !res[i - 1];
            }
            else {
              res[i].showImg = false;
            }
            if (res[i].userId != id && res[i + 1] && res[i + 1].userId == id) {
              res[i].firstFromInBlock = true;
            }
            else {
              res[i].firstFromInBlock = false;
            }
          }
          Object.assign(res[i], {index: i});
        }
        setMessages(res);
        setLoading(false);
      }
    });
  }

  const isTyping = () => {
    if (chat && typing) {
      if (chat.blocked) {
        return false;
      }
      
      let chattingUser = typing.find((x: any) => {
        return x.chat === chat?.id && x.user !== userInfo?.id;
      });

      return chattingUser;
    }
    else {
      return false;
    }
  }

  const renderItem = ({item}:any) => {
    return (
      <Message
        message={item}
        userInfo={userInfo}
        isTypingIndicator={item?.typingIndicator}
        isDarkMode={isDarkMode}
        key={item.index}
        image={image}
      />
    )
  }

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
      maxWidth: '80%'
    },
    theirMessage: {
      backgroundColor: Color(isDarkMode).msgFromBG,
      alignSelf: 'flex-start',
      color: Color(isDarkMode).msgFromFG,
      maxWidth: '80%',
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
        extraData={typeToggle}
        data={messages}
        renderItem={renderItem}
        initialNumToRender={50}
        maxToRenderPerBatch={50}
        removeClippedSubviews={true}
        ListHeaderComponent={indicator()}
        inverted
        style={{padding: 10}}
      />
    </View>
  );
}

export default Messages;