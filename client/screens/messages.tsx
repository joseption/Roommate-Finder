import React, { useEffect, useRef, useState } from 'react';
import { View, FlatList, StyleSheet, Text } from 'react-native';
import MessageTab from '../components/messages/message-tab';
import MessagePanel from '../components/messages/message-panel';
import _Button from '../components/control/button';
import _TextInput from '../components/control/text-input';
import { authTokenHeader, env, getLocalStorage, NavTo, setLocalAppSettingsCurrentChat } from '../helper';
import io, { Socket } from 'socket.io-client'
import { DefaultEventsMap } from '@socket.io/component-emitter';
import WavingHand from '../assets/images/waving_hand_svg';

const MessagesScreen = (props: any, {navigation}:any) => {
  const [showPanel, updateShowPanel] = useState(false);
  const [currentChat, setCurrentChat] = useState<any>({});
  const [chats, setChats] = useState<any[]>([]);
  const [userInfo, setUserInfo] = useState<any>();
  const [chatsHaveLoaded, setChatsHaveLoaded] = useState<boolean>(false);
  const chatsRef = useRef(chats);
  const currentChatRef = useRef(currentChat);
  const showPanelRef = useRef(showPanel);

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
  }, [chats]);

  useEffect(() => {
    showPanelRef.current = showPanel;
  }, [showPanel]);
  
  useEffect(() => {
    props.socket.on('receive_message', (data: any) => {
      const chats = chatsRef.current.filter(chat => chat.id === data.chatId);
      if (chats.length !== 0 && chats[0].blocked) return;
      updateTabs(data);
    });

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
          return {...chat, notifCount: (chat.notifCount + 1)};
        }
        return chat;
      });
      setChats(chats);
    });
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
            return {...chat, notifCount: 0};
          }
          return chat;
        });
        setChats(chats);
      }
    });
  };  const updateTabs = async (data: any) => {
    if (chatsRef.current.length === 0) return;
    const fetchedChat = await getChat(data.chatId)
    const latestMessage = await getMessage(fetchedChat.latestMessage);
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
    const userInfo = await getLocalStorage().then((res) => {return res.user});
    setUserInfo(userInfo);
  }

  const getChat = async (chatId: string) => {
    const tokenHeader = await authTokenHeader();
    return fetch(
      `${env.URL}/chats/${chatId}`, {method:'GET',headers:{'Content-Type': 'application/json', 'authorization': tokenHeader}}
    ).then(async ret => {
      const res = JSON.parse(await ret.text());
      if (res.Error) {
        console.warn("Error: ", res.Error);
      }
      else {
        return res;
      }
    });
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
        for (let i = 0; i < res.length; i++) {
          const lastMessage = await getMessage(res[i].latestMessage);
          const notifCount = await getNotifs(userInfo.id, res[i].id);
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
      fontSize: 18,
      fontWeight: 'bold',
      marginHorizontal: 40,
      textAlign: 'center',
    },
  });

  if (chatsHaveLoaded && chats.length === 0) {
    return (
      <View style={styles.noMessagesContainer}>
          <WavingHand width={200} height={200}/>
          <Text style={styles.textStyle}>
            Find your next roommate by starting a chat through their profile!
          </Text>
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
      />
    </>
  );
};

export default MessagesScreen;