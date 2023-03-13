import React, { useEffect, useRef, useState } from 'react';
import { View, FlatList, StyleSheet, Text, ActivityIndicator } from 'react-native';
import MessageTab from '../components/messages/message-tab';
import MessagePanel from '../components/messages/message-panel';
import _Button from '../components/control/button';
import _TextInput from '../components/control/text-input';
import { authTokenHeader, env, getLocalStorage, navProp, NavTo, setLocalAppSettingsCurrentChat } from '../helper';
import io, { Socket } from 'socket.io-client'
import { DefaultEventsMap } from '@socket.io/component-emitter';
import WavingHand from '../assets/images/waving_hand_svg';
import { Color, DarkStyle, FontSize, Style } from '../style';
import _Text from '../components/control/text';
import { useNavigation } from '@react-navigation/native';

const MessagesScreen = (props: any) => {
  const [showPanel, updateShowPanel] = useState(false);
  const [currentChat, setCurrentChat] = useState<any>({});
  const [chats, setChats] = useState<any[]>([]);
  const [userInfo, setUserInfo] = useState<any>();
  const [chatsHaveLoaded, setChatsHaveLoaded] = useState<boolean>(false);
  const chatsRef = useRef(chats);
  const currentChatRef = useRef(currentChat);
  const showPanelRef = useRef(showPanel);
  const navigation = useNavigation<navProp>();
  const [typing, setTyping] = useState<any>([]);

  useEffect(() => {
    if (props.receiveTyping) {
      let idx = typing.findIndex((x: any) => {
        return x.chat === props.receiveTyping.chatId && x.user === props.receiveTyping.userId
      });

      if (props.receiveTyping.isTyping) {
        if (idx < 0) {
          if (props.receiveTyping) {
            let chat = props.receiveTyping.chatId;
            let user = props.receiveTyping.userId;
            if (chat && user) {
              setTyping([...typing, {chat: chat, user: user}]);
            }
          }
        }
      }
      else if (idx >= 0) {
        let typers = [] as never[];
        typing.forEach((x: any) => typers.push(x as never))
        typers.splice(idx, 1)
        setTyping(typers);
      }
    }
  }, [props.receiveTyping])

  useEffect(() => {
    getUserInfo();
  }, [])
  
  useEffect(() => {
    getChats();
  }, [userInfo])

  useEffect(() => {
    currentChatRef.current = currentChat;
    if (currentChatRef.current && currentChatRef.current?.id) {
      deleteNotifications();
    }
  }, [currentChat]);

  useEffect(() => {
    chatsRef.current = chats;
    if (props?.route?.params?.user && !chatsHaveLoaded && userInfo) {
      openOrCreateChat(props?.route?.params?.user);
    }
  }, [chats]);

  useEffect(() => {
    showPanelRef.current = showPanel;
  }, [showPanel]);

  useEffect(() => {
    const chats = chatsRef.current.filter(chat => chat.id === props.receiveMessage.chatId);
    if (chats.length !== 0 && chats[0].blocked) return;
    updateTabs(props.receiveMessage);
  }, [props.receiveMessage])
  
  useEffect(() => {
    props.socket.on('receive_block', (data: any) => {
      updateBlocked(data.chat);
    });

    props.socket.on('receive_notification', (data: any) => {
      const chats = chatsRef.current.map((chat) => {
        if (chat.id === data.chatId) {
          if (currentChatRef.current.id === chat.id && showPanelRef.current) {
            deleteNotifications();
            return chat;
          };
          props.setAddMessageCount(1);
          return {...chat, notifCount: (chat.notifCount + 1)};
        }
        return chat;
      });
      setChats(chats);
    });

    props.socket.on('receive_chat', (data: any) => {
      props.socket.emit('join_room', data.id);
      const newChats= [data, ...chatsRef.current];
      setChats(newChats);
    })
  }, [props.socket])

  // Start - Added by Joseph for push notifications
  useEffect(() => {
    if (chats && props.openChatFromPush) {
      let chat = chats.find(chat => chat.id === props.openChatFromPush);
      if (chat) {
        setCurrentChat(chat);
        updateShowPanel(true);
        props.setOpenChatFromPush('');
      }
    }
  }, [chats, props.openChatFromPush]);

  useEffect(() => {
    props.socket.emit('send_message', props.messageData);
  }, [props.messageData]);

  useEffect(() => {
    let chatId = '';
    if (currentChat) {
      chatId = (currentChat as any).id
    }
    let data = {id: chatId, is_showing: showPanel, disabled: false, current_page: NavTo.Messages};
    setLocalAppSettingsCurrentChat(data);
    props.setShowingMessagePanel(showPanel);
    props.setCurrentChat(chatId);
  }, [currentChat, showPanel]);
  // End

  useEffect(() => {
    if (props.showingMessagePanel != showPanel) {
      // JA Hacky but works to avoid changing a bunch of code 31323
      setTimeout(() => {
        updateShowPanel(props.showingMessagePanel);
      }, 0);
    }
  }, [props.showingMessagePanel])

  useEffect(() => {
    if (!props?.route?.params?.user || !userInfo) return;
    openOrCreateChat(props?.route?.params?.user);
  }, [props?.route?.params?.requestId])

  const createChat = async (userIdOne: string, userIdTwo: string) => {
    const obj = {userIdOne: userIdOne, userIdTwo: userIdTwo};
    const js = JSON.stringify(obj);
    const tokenHeader = await authTokenHeader();
    return fetch(
      `${env.URL}/chats`, {method:'POST', body:js, headers:{'Content-Type': 'application/json', 'authorization': tokenHeader}}
    ).then(async ret => {
      let res = JSON.parse(await ret.text());
      if (res.Error) {
        console.warn("Error: ", res.Error);
      }
      else {
        let chat = res;
        const users = [];
        const user = await getUser(userIdTwo);
        users.push(user);
        chat = {...chat, users: users, blocked: '', muted: [], notifCount: 0};
        props.socket.emit('create_chat', chat);
        const newChats= [chat, ...chatsRef.current];
        props.socket.emit('join_room', chat.id);
        setChats(newChats);
        setCurrentChat(chat);
        updateShowPanel(true);
      }
    });
  };
  
  const openOrCreateChat = (userId: string) => {
    let chat = chatsRef.current.filter((chat) => {
      return chat?.users[0]?.id === userId;
    })
    // Chat exists
    if (chat.length !== 0) {
      setCurrentChat(chat[0]);
      updateShowPanel(true);
      return;
    }
    createChat(userInfo.id, userId);
  };

  const deleteNotifications = async () => {
    const obj = {userId: userInfo?.id, chatId: currentChatRef.current?.id};
    const js = JSON.stringify(obj);
    const tokenHeader = await authTokenHeader();
    return fetch(
      `${env.URL}/notifications`, {method:'DELETE', body:js, headers:{'Content-Type': 'application/json', 'authorization': tokenHeader}}
    ).then(async ret => {
      let res = JSON.parse(await ret.text());
      if (res.Error) {
        console.warn("Error: ", res.Error);
      } else {
        const chats = chatsRef.current.map((chat) => {
          if (chat.id === currentChatRef.current.id) {
            let cnt = props.messageCount - chat.notifCount;
            props.setMessageCount(cnt);
            return {...chat, notifCount: 0};
          }
          return chat;
        });
        setChats(chats);
      }
    });
  };  
  
  const updateTabs = async (data: any) => {
    if (chatsRef.current.length === 0) return;
    const latestMessage = {content: data.content, userId: data.userId};
    let newChat: any;
    let newChats = chatsRef.current.filter((chat) => {
      const condition = data.chatId !== chat.id; 
      if (!condition) {
        newChat = chat;
      }
      return condition;
    })
    newChat = {...newChat, latestMessage: latestMessage};
    newChats = [newChat, ...newChats];
    setChats(newChats);
  }

  function updateBlocked(c: any) {
    if (!c) return;
    const newChats = chatsRef.current.map((chat) => {
      if (chat.id === c.id) {
        return { ...chat, blocked: c.blocked }
      }
      return chat;
    });
    setChats(newChats);
    setCurrentChat({...currentChatRef.current, blocked: c.blocked})
  }

  function updateMuted(c: any) {
    if (!c) return;
    const newChats = chatsRef.current.map((chat) => {
      if (chat.id === c.id) {
        return { ...chat, muted: c.muted }
      }
      return chat;
    });
    setChats(newChats);
    setCurrentChat({...currentChatRef.current, muted: c.muted})
  }

  const getUserInfo = async () => {
    const userInfo = await getLocalStorage().then((res) => {return (res && res.user ? res.user : null)});
    // join own user room
    props.socket.emit('join_room', userInfo.id)
    setUserInfo(userInfo);
  }

  const getMessage = async (id: string) => {
    if (!id) return;
    
    const tokenHeader = await authTokenHeader();
    return fetch(
      `${env.URL}/messages/getMessage?messageId=${id}`, {method:'GET',headers:{'Content-Type': 'application/json', 'authorization': tokenHeader}}
    ).then(async ret => {
      const res = JSON.parse(await ret.text());
      if (res) {
        if (res.Error) {
          console.warn("Error: ", res.Error);
          return {content: '', createdAt: '', userId: '',};
        }
        else {
          let message = {
            content: res.content,
            createdAt: res.createdAt,
            userId: res.userId,
          };
          return message;
        }
      }
      else {
        return {content: '', createdAt: '', userId: '',};      }
    });
  }

  const getNotifs = async (userId: string, chatId: string) => {
    if (!userId || !chatId) return;
    const tokenHeader = await authTokenHeader();
    return fetch(
      `${env.URL}/notifications?userId=${userId}&chatId=${chatId}`,
      {method:'GET',headers:{'Content-Type': 'application/json', 'authorization': tokenHeader}}
    ).then(async ret => {
      const res = JSON.parse(await ret.text());
      if (res.Error) {
        console.warn("Error: ", res.Error);
        return 0;
      } else {
        return res;
      }
    });
  }

  const getUser = async (id: string) => {
    const tokenHeader = await authTokenHeader();
    return fetch(
      `${env.URL}/users/profile?userId=${id}`, {method:'GET',headers:{'Content-Type': 'application/json', 'authorization': tokenHeader}}
    ).then(async ret => {
      const res = JSON.parse(await ret.text());
      if (res.Error) {
        console.warn("Error: ", res.Error);
      }
      else {
        const user = {
          first_name: res.first_name,
          last_name: res.last_name,
          id: res.id,
          email: res.email,
          image: res.image,
        };
        return user;
      }
    });
  }

  const connectToChatRooms = async (chats: any) => {
    if (chats.length === 0) return;
    const rooms = await chats.map((chat: any) => {
      return chat.id;
    })
    props.socket.emit('join_room', rooms)
  }

  const getChats = async () => {
    if (!userInfo?.id) return;
    const tokenHeader = await authTokenHeader();
    fetch(
      `${env.URL}/chats?userId=${userInfo?.id}`, {method:'GET',headers:{'Content-Type': 'application/json', 'authorization': tokenHeader}}
    ).then(async ret => {
      const res = JSON.parse(await ret.text());
      if (res.Error) {
        console.warn("Error: ", res.Error);
      }
      else {
        const chatArray = [];
        let totalNotifs = 0;
        for (let i = 0; i < res.length; i++) {
          const lastMessage = await getMessage(res[i].latestMessage);
          const notifCount = await getNotifs(userInfo.id, res[i].id);
          totalNotifs += notifCount;
          const users = []
          for (let j = 0; j < res[i].users.length; j++) {
            if (res[i].users[j] === userInfo?.id) {
              continue;
            }
            const user = await getUser(res[i].users[j])
            users.push(user);
          }
          const chat = {
            chatName: res[i].chatName,
            createdAt: res[i].createdAt,
            groupAdmin: res[i].groupAdmin,
            id: res[i].id,
            isGroupChat: res[i].isGroupChat,
            latestMessage: lastMessage,
            updatedAt: res.updatedAt,
            users: users,
            blocked: res[i].blocked,
            muted: res[i].muted,
            notifCount: notifCount,
          };
          chatArray.push(chat);
        }
        connectToChatRooms(chatArray);
        setChats(chatArray);
        setChatsHaveLoaded(true);
        props.setMessageCount(totalNotifs);
      }
    });
  }

  const styles = StyleSheet.create({
    noMessagesContainer: {
      display: 'flex',
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },
    textStyle: {
      fontSize: FontSize.large,
      fontWeight: 'bold',
      marginHorizontal: 40,
      textAlign: 'center',
      color: Color(props.isDarkMode).text
    },
    subTextStyle: {
      fontWeight: 'normal',
      marginTop: 10,
      marginBottom: 20,
      fontSize: FontSize.default
    },
    loadingScreen: {
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      flex: 1
    },
  });

  if (!chatsHaveLoaded) {
    return (
      <View style={styles.loadingScreen}>
        <ActivityIndicator
        size="large"
        color={Color(props.isDarkMode).gold}
        />
      </View>
    );
  }

  if (chatsHaveLoaded && chats.length === 0) {
    return (
      <View style={styles.noMessagesContainer}>
          <WavingHand width={100} height={100}/>
          <_Text
          style={styles.textStyle}
          >
            No messages
          </_Text>
          <_Text
          style={[styles.textStyle, styles.subTextStyle]}
          >
            Find your next roommate by starting a chat from a profile through the explore page!
          </_Text>
          <_Button
          style={Style(props.isDarkMode).buttonInverted}
          textStyle={Style(props.isDarkMode).buttonInvertedText}
          onPress={() => {
            props.setNavSelector(NavTo.Search);
            navigation.navigate(NavTo.Search);
          }}
          isDarkMode={props.isDarkMode}
          >
            Explore
          </_Button>
      </View>
    );
  }

  return (
    <>
      <FlatList
        data={chats}
        renderItem={({item}) => 
          <MessageTab
            showPanel={showPanel}
            updateShowPanel={updateShowPanel}
            chat={item}
            setCurrentChat={setCurrentChat}
            key={item.id}
            isDarkMode={props.isDarkMode}
            typing={typing}
          />
        }
      />
      <MessagePanel
        showPanel={showPanel}
        socket={props.socket}
        userInfo={userInfo}
        updateShowPanel={updateShowPanel}
        chat={currentChat}
        updateBlocked={updateBlocked}
        updateMuted={updateMuted}
        isDarkMode={props.isDarkMode}
        receiveMessage={props.receiveMessage}
        receiveTyping={props.receiveTyping}
        typing={typing}
      />
    </>
  );
};

export default MessagesScreen;