import { useEffect, useState } from "react";
import { View, StyleSheet, Text } from "react-native";
import { Color } from "../../style";
import { getLocalStorage } from "../../helper";

interface Props {
  message: any
}

const Message = ({ message }: Props) => {
  const [userInfo, setUserInfo] = useState<any>();

  useEffect(() => {
    getUserInfo();
  }, [])

  const getUserInfo = async () => {
    setUserInfo(await getLocalStorage().then((res) => {return res.user}));
  }

  const isMyMessage = () => message.userId === userInfo?.id;

  return (
    <View
      style={[
        styles.myMessage, 
        isMyMessage() ? null : styles.theirMessage,
      ]}
    >
      <Text style={{color: isMyMessage() ? Color.white : undefined}}>{message.content}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  myMessage: {
    margin: 5,
    padding: 10,
    borderRadius: 10,
    maxWidth: '80%',
    backgroundColor: Color.default,
    alignSelf: 'flex-end',

    shadowColor: 'black',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: .18,
    shadowRadius: 1,
  },
  theirMessage: {
    backgroundColor: Color.grey,
    alignSelf: 'flex-start',
    color: Color.black,
  }
});

export default Message;