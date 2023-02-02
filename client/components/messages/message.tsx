import { View, StyleSheet, Text } from "react-native";
import { Color } from "../../style";

interface Props {
  message: any,
  userInfo: any
}

const Message = ({ message, userInfo }: Props) => {
  if (!userInfo) return <></>
  const isMyMessage = () => message.userId === userInfo?.id;

  const styles = StyleSheet.create({
    myMessage: {
      margin: 5,
      padding: 10,
      borderRadius: 10,
      maxWidth: '80%',
      backgroundColor: Color(message.isDarkMode).default,
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
      backgroundColor: Color(message.isDarkMode).grey,
      alignSelf: 'flex-start',
      color: Color(message.isDarkMode).black,
    }
  });
  
  return (
    <>
      {
        isMyMessage() ?
          <View style={styles.myMessage}>
            <Text style={{color: Color(message.isDarkMode).white}}>{message.content}</Text>
          </View>
        :
        <View style={[styles.myMessage, styles.theirMessage]}>
          <Text>{message.content}</Text>
        </View>
      }
    </>
  );
}

export default Message;