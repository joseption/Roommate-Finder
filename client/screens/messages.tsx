import React, { useEffect, useState } from 'react';
import { View, FlatList, TextInput, Button, StyleSheet } from 'react-native';
import MessageTab from '../components/messages/message-tab';
import MessagePanel from '../components/messages/message-panel';
import _Button from '../components/control/button';
import _TextInput from '../components/control/text-input';
import { env, getLocalStorage } from '../helper';

const MessagesScreen = (props: any, {navigation}:any) => {
  const [showPanel, updateShowPanel] = useState(false);
  const [currentChat, setCurrentChat] = useState({});
  const [chats, setChats] = useState<any[]>([]);
  const [userInfo, setUserInfo] = useState<any>();

  useEffect(() => {
    getUserInfo();
  }, [])
  
  useEffect(() => {
    getChats();
  }, [userInfo])

  const getUserInfo = async () => {
    setUserInfo(await getLocalStorage().then((res) => {return res.user}));
  }

  const getMessage = async (id: string) => {
    return fetch(
      `${env.URL}/messages/getMessage?messageId=${id}`, {method:'GET',headers:{'Content-Type': 'application/json'}}
    ).then(async ret => {
      let res = JSON.parse(await ret.text());
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
    });
  }

  const getUser = async (id: string) => {
    return fetch(
      `${env.URL}/users/profile?userId=${id}`, {method:'GET',headers:{'Content-Type': 'application/json'}}
    ).then(async ret => {
      let res = JSON.parse(await ret.text());
      if (res.Error) {
        console.warn("Error: ", res.Error);
      }
      else {
        let user = {
          id: res.id,
          email: res.email,
          image: res.image,
        };
        return user;
      }
    });
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
          />
        }
      />
      <MessagePanel showPanel={showPanel} updateShowPanel={updateShowPanel} chat={currentChat}/>
    </>
  );
};

export default MessagesScreen;