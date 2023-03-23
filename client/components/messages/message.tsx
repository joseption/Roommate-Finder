import { View, StyleSheet } from "react-native";
import { Color, Radius } from "../../style";
import _Text from "../control/text";
import _Image from "../control/image";

interface Props {
  message: any,
  userInfo: any
  isTypingIndicator: boolean,
  isDarkMode: boolean,
  image: any
}

const Message = ({ message, userInfo, isTypingIndicator, isDarkMode, image }: Props) => {
  if (!userInfo) return <></>
  
  const isMyMessage = () => message?.userId === userInfo?.id;

  const getUserIcon = () => {
    if (image)
      return {uri: image};
    else
      return require('../../assets/images/user.png');
  }

  const msgStyle = () => {
    let style = [];
    if (!message?.showImg && !isTypingIndicator) {
      style.push({
        marginLeft: 47
      });
    }

    return style;
  }

  const msgContainerStyle = () => {
    let style = [];
    if (message?.firstFromInBlock) {
      style.push({
        marginTop: 20
      });
    }
    if (message?.showImg && !message?.lastFromMsg) {
      style.push({
        marginBottom: 20
      });
    }

    return style;
  }

  const styles = StyleSheet.create({
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
    theirNoImgLine: {
      marginRight: 43
    },
    typingIndicatorImage: {
      width: 28,
      height: 18,
    },
    indicator: {
      backgroundColor: Color(isDarkMode).msgFromFG,
      height: 5,
      width: 5,
      borderRadius: Radius.round,
      margin: 1
    },
    indicatorContainer: {
      flexDirection: 'row',
      padding: 10
    },
    fromMsg: {
        color: Color(isDarkMode).msgFromFG,
        wordBreak: 'break-all'
    },
    toMsg: {
      color: Color(isDarkMode).msgToFG,
      wordBreak: 'break-all'
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
  });

  if (isTypingIndicator) {
    return null; // Handle typing indicator in main messages it should always stay at the bottom and not show multiple times
  }
  
  return (
    <View
    style={msgContainerStyle()}
    >
      {
        isMyMessage() ?
          <View style={[styles.myMessage]}>
            <_Text
            style={styles.toMsg}
            >
              {message.content}
            </_Text>
          </View>
        :
        <View
        style={styles.fromMsgContainer}
        >
          {message.showImg ? 
          <_Image
            height={image ? 35 : 30}
            width={image ? 35 : 30}
            style={styles.image}
            containerStyle={styles.imageContainerStyle}
            source={getUserIcon()}
          />
          : null }
          <View style={[styles.myMessage, styles.theirMessage, styles.theirNoImgLine, msgStyle()]}>
            <_Text
            style={styles.fromMsg}
            >
              {message.content}
            </_Text>
          </View>
        </View>
      }
    </View>
  );
}

export default Message;