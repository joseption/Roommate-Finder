import React, { useEffect, useRef, useState } from 'react';
import { View, FlatList, StyleSheet, Text } from 'react-native';
import MessageTab from '../components/messages/message-tab';
import MessagePanel from '../components/messages/message-panel';
import _Button from '../components/control/button';
import _TextInput from '../components/control/text-input';
import { authTokenHeader, env, getLocalStorage } from '../helper';
import io, { Socket } from 'socket.io-client'
import { DefaultEventsMap } from '@socket.io/component-emitter';
import WavingHand from '../assets/images/waving_hand_svg';

const socket: Socket<DefaultEventsMap, DefaultEventsMap> = io(env.URL);

const MessagesScreen = (props: any, {navigation}:any) => {
  const [showPanel, updateShowPanel] = useState(false);
  const [currentChat, setCurrentChat] = useState({});
  const [chats, setChats] = useState<any[]>([]);
  const [userInfo, setUserInfo] = useState<any>();
  const [chatsHaveLoaded, setChatsHaveLoaded] = useState<boolean>(false);
  const chatsRef = useRef(chats);

  useEffect(() => {
    getUserInfo();
  }, [])
  
  useEffect(() => {
    getChats();
  }, [userInfo])

  useEffect(() => {
    chatsRef.current = chats;
  }, [chats])
  
  useEffect(() => {
    socket.on('receive_message', (data: any) => {
      updateTabs(data);
    });
  }, [socket])

  const updateTabs = async (data: any) => {
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
      if (res.Error) {
        console.warn("Error: ", res.Error);
        return {content: '', createdAt: '', userId: '',};
      }
      else {
        const message = {
          content: res.content,
          createdAt: res.createdAt,
          userId: res.userId,
        };
        return message;
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
    socket.emit('join_room', rooms)
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
      <MessagePanel showPanel={showPanel} socket={socket} userInfo={userInfo} updateShowPanel={updateShowPanel} chat={currentChat}/>
    </>
  );
};

export default MessagesScreen;