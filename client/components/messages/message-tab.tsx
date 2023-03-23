import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableHighlight } from 'react-native';
import { getLocalStorage } from '../../helper';
import { Color, FontSize, Radius } from '../../style';
import _Image from '../control/image';
import _Text from '../control/text';

interface Props {
  chat: any,
  setCurrentChat: any,
  showPanel: boolean,
  updateShowPanel: Dispatch<SetStateAction<boolean>>,
  isDarkMode: boolean,
  typing: any,
}

const MessageTab = ({typing, chat, setCurrentChat, showPanel, updateShowPanel, isDarkMode}: Props) => {
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
    if (chat?.userInfo?.id === id) {
      return chat.userInfo.first_name + ': ';
    }
    return '';
  }

  const getContent = (content: string) => {
    if (!content) return '';
    return content;
  }

  const displayNotification = (count: number) => {
    if (count === 0) return <></>
    return (
      <View style={styles.notification}>
        <Text style={styles.notificationText}>
          {(count > 9) ? '9+' : count}
        </Text>
      </View>
    );
  };

  const getUserIcon = () => {
    if (chat?.userInfo?.image)
      return {uri: chat.userInfo.image};
    else
      return require('../../assets/images/user.png');
  }

  const unreadText = () => {
    let style = [];
    if (chat && chat.notificationCount > 0) {
      style.push(styles.unreadText);
    }

    return style;
  }

  const imgStyle = () => {
    let style = [];
    if (chat?.userInfo?.image) {
      style.push({});
    }
    else {
      style.push({
        height: 40,
        width: 40,
      })
    }

    return style;
  }

  const styles = StyleSheet.create({
    unreadText: {
      fontWeight: 'bold'
    },
    touchable: {
      flex: 1,
      flexDirection: 'row',
      padding: 10,
      alignItems: 'center',
    },
    content: {
      flexDirection: 'row',
      flex: 1,
    },
    image: {
      height: 50,
      width: 50,
      borderRadius: Radius.round,
      backgroundColor: Color(isDarkMode).userIcon
    },
    imageContainerStyle: {
      height: 50,
      width: 50,
      marginRight: 10,
      borderRadius: Radius.round,
      borderColor: Color(isDarkMode).separator,
      borderWidth: 1,
      backgroundColor: Color(isDarkMode).userIcon,
      justifyContent: 'center',
      alignItems: 'center'
    },
    text: {
      display: 'flex',
      justifyContent: 'center',
      flex: 1,
    },
    msgText: {
      fontSize: FontSize.default,
      color: Color(isDarkMode).text,
    },
    notificationContainer: {
      display: 'flex',
      justifyContent: 'center',
      marginLeft: 10
    },
    notification: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: 25,
      width: 25,
      backgroundColor: Color(isDarkMode).danger,
      borderRadius: Radius.round,
    },
    notificationText: {
      color: 'white',
    },
    typeContainer: {
      backgroundColor: Color(isDarkMode).msgFromBG,
      position: 'absolute',
      bottom: -1,
      right: 7,
      paddingVertical: 1,
      paddingHorizontal: 2,
      borderRadius: 10
    }
  });

  const isTyping = () => {
    if (chat && typing) {
      if (chat.blocked) {
        return false;
      }

      let chattingUser = typing.find((x: any) => {
        if (userInfo) {
          return x.chat === chat.id && x.user !== userInfo.id;
        }
        else {
          return null;
        }
      });

      return chattingUser;
    }
    else {
      return false;
    }
  }

  return (
    <TouchableHighlight
      style={styles.touchable}
      underlayColor={Color(isDarkMode).underlayMask}
      onPress={() => {
        updateShowPanel(!showPanel);
        setCurrentChat(chat);
      }}
    >
      <View style={styles.content}>
        <View>
          <_Image
          height={chat?.userInfo?.image ? 50 : 40}
          width={chat?.userInfo?.image ? 50 : 40}
          style={[styles.image, imgStyle()]}
          containerStyle={styles.imageContainerStyle}
          source={getUserIcon()}
          />
          {isTyping() ?
          <View
          style={styles.typeContainer}
          >
            <_Image width={25} source={!isDarkMode ? require('../../assets/images/indicator_light.gif') : require('../../assets/images/indicator_dark.gif')}></_Image>
          </View>
          : null}
        </View>
        <View
        style={styles.text}
        >
          <_Text
          numberOfLines={1}
          style={[styles.msgText, unreadText()]}
          >
            {chat?.userInfo?.first_name + ' ' + chat?.userInfo?.last_name}
          </_Text>
          <_Text
          numberOfLines={1}
          style={[styles.msgText, unreadText()]}
          >
            {getPrefix(chat.lastMessage?.userId) + getContent(chat.lastMessage?.content)}
          </_Text>
        </View>
        <View
        style={styles.notificationContainer}
        >
          {displayNotification(chat.notificationCount)}
        </View>
      </View>
    </TouchableHighlight>
  );
};

export default MessageTab;