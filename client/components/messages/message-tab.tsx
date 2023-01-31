import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableHighlight } from 'react-native';
import { getLocalStorage } from '../../helper';

interface Props {
  chat: any,
  setCurrentChat: any,
  showPanel: boolean,
  updateShowPanel: Dispatch<SetStateAction<boolean>>,
}

const MessageTab = ({chat, setCurrentChat, showPanel, updateShowPanel}: Props) => {
  const [userInfo, setUserInfo] = useState<any>();

  useEffect(() => {
    getUserInfo();
  }, [])

  const getUserInfo = async () => {
    setUserInfo(await getLocalStorage().then((res) => {return res.user}));
  }
  
  const getPrefix = (id: string) => {
    if (!userInfo) return '';
    if (id === userInfo.id) {
      return 'You: ';
    }
    for (let i = 0; i < chat.users.length; i++) {
      if (chat.users[i].id === id) {
        return chat.users[i].first_name + ': ';
      }
    }
    return '';
  }

  return (
    <TouchableHighlight
      style={styles.touchable}
      underlayColor="gainsboro"
      onPress={() => {
        updateShowPanel(!showPanel);
        setCurrentChat(chat);
      }}
    >
      <View style={styles.content}>
        <Image style={styles.image} source={{ uri: (chat?.users[0]?.image != null) ? chat?.users[0]?.image : 'https://reactnative.dev/img/tiny_logo.png'}} />
        <View style={styles.text}>
            <Text numberOfLines={1} style={styles.name}>{chat.chatName}</Text>
            <Text numberOfLines={2}>{getPrefix(chat.latestMessage.userId) + chat.latestMessage.content}</Text>
        </View>
      </View>
    </TouchableHighlight>
  );
};

const styles = StyleSheet.create({
  touchable: {
    flex: 1,
    flexDirection: 'row',
    marginHorizontal: 5,
    paddingHorizontal: 10,
    paddingVertical: 5,
    height: 70,
    borderRadius: 10,
    alignItems: 'center',
  },
  content: {
    flexDirection: 'row',
    flex: 1,
  },
  image: {
    height: 60,
    width: 60,
    borderRadius: 30,
    marginRight: 10,
  },
  text: {
    flex: 1,
    marginRight: 45,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
  }
});

export default MessageTab;