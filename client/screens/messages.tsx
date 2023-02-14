import React, { useEffect, useRef, useState } from 'react';
import { View, FlatList, TextInput, Button, StyleSheet } from 'react-native';
import MessageTab from '../components/messages/message-tab';
import MessagePanel from '../components/messages/message-panel';
import _Button from '../components/control/button';
import _TextInput from '../components/control/text-input';
import { authTokenHeader, env, getLocalStorage, NavTo, setLocalAppSettingsCurrentChat } from '../helper';
import io, { Socket } from 'socket.io-client'
import { DefaultEventsMap } from '@socket.io/component-emitter';

const MessagesScreen = (props: any, {navigation}:any) => {
  const [showPanel, updateShowPanel] = useState(false);
  const [currentChat, setCurrentChat] = useState({});
  const [chats, setChats] = useState<any[]>([]);
  const [userInfo, setUserInfo] = useState<any>();
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
    props.socket.on('receive_message', (data: any) => {
      updateTabs(data)
    });
  }, [props.socket])

  // Start - Added by Joseph for push notifications
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
    props.setCurrentChat(chatId);
  }, [currentChat, showPanel]);
  // End

  const updateTabs = async (data: any) => {
    if (chatsRef.current.length === 0) return;
    let fetchedChat = await getChat(data.chatId)
    let latestMessage = await getMessage(fetchedChat.latestMessage);
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
    setUserInfo(await getLocalStorage().then((res) => {return res.user}));
  }

  const getChat = async (chatId: string) => {
    return fetch(
      `${env.URL}/chats/${chatId}`, {method:'GET',headers:{'Content-Type': 'application/json'}}
    ).then(async ret => {
      let res = JSON.parse(await ret.text());
      if (res.Error) {
        console.warn("Error: ", res.Error);
      }
      else {
        return res;
      }
    });
  }

  const getMessage = async (id: string) => {
    return fetch(
      `${env.URL}/messages/getMessage?messageId=${id}`, {method:'GET',headers:{'Content-Type': 'application/json'}}
    ).then(async ret => {
      let res = JSON.parse(await ret.text());
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
        return {content: '', createdAt: '', userId: '',};
      }
    });
  }

  const getUser = async (id: string) => {
    let tokenHeader = await authTokenHeader();
    return fetch(
      `${env.URL}/users/profile?userId=${id}`, {method:'GET',headers:{'Content-Type': 'application/json', 'authorization': tokenHeader}}
    ).then(async ret => {
      let res = JSON.parse(await ret.text());
      if (res.Error) {
        console.warn("Error: ", res.Error);
      }
      else {
        let user = {
          first_name: res.first_name,
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
    fetch(
      `${env.URL}/chats?userId=${userInfo?.id}`, {method:'GET',headers:{'Content-Type': 'application/json'}}
    ).then(async ret => {
      let res = JSON.parse(await ret.text());
      if (res.Error) {
        console.warn("Error: ", res.Error);
      }
      else {
        let chatArray = [];
        for (let i = 0; i < res.length; i++) {
          let lastMessage = await getMessage(res[i].latestMessage);
          let users = []
          for (let j = 0; j < res[i].users.length; j++) {
            if (res[i].users[j] === userInfo?.id) {
              continue;
            }
            let user = await getUser(res[i].users[j])
            users.push(user);
          }
          let chat = {
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
      }
    });
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
      <MessagePanel showPanel={showPanel} socket={props.socket} userInfo={userInfo} updateShowPanel={updateShowPanel} chat={currentChat}/>
    </>
  );
};

export default MessagesScreen;