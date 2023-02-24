import { View, StyleSheet, Pressable, Dimensions, Text, TouchableHighlight } from "react-native";
import BlockChat from "../../assets/images/block_chat_svg";
import UnblockChat from "../../assets/images/unblock_chat_svg";
import { authTokenHeader, env } from "../../helper";
import UnmuteChat from "../../assets/images/unmute_chat_svg";
import MuteChat from "../../assets/images/mute_chat_svg";
import { Color, Radius } from "../../style";
import _Text from "../control/text";

interface Props {
  chat: any,
  userInfo: any,
  showPopUp: boolean,
  setShowPopUp: any,
  updateBlocked: any,
  updateMuted: any,
  socket: any,
  isDarkMode: boolean
}

const MessageSettings = ({ isDarkMode, chat, userInfo, showPopUp, setShowPopUp, socket, updateBlocked, updateMuted }: Props) => {
  const dim = Dimensions.get('window');

  const styles = StyleSheet.create({
    popUpBackground: {
      zIndex: 3,
      position: 'absolute',
      width: '100%',
      height: '100%',
      backgroundColor: 'transparent',
    },
    popUp: {
      backgroundColor: isDarkMode ? Color(isDarkMode).contentDialogBackgroundSecondary : Color(isDarkMode).actualWhite,
      borderRadius: Radius.default,
      elevation: 3,
      padding: 5,
      marginRight: 10,
      borderColor: Color(isDarkMode).separator,
      borderWidth: 1
    },
    popUpContainer: {
      justifyContent: 'flex-end',
      flexDirection: 'row',
      zIndex: 3,
      position: 'absolute',
      right: 0,
      top: 40
    },
    tabContainer: {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      padding: 10,
      borderRadius: 10,
    },
    blockChatImage: {
      marginRight: 10,
    }
  });

  const blockAction = async () => {
    const obj = { chatId: chat.id, userId: userInfo.id };
    const js = JSON.stringify(obj);
    const tokenHeader = await authTokenHeader();
    const blockType = (chat.blocked) ? 'unblock' : 'block';
    return fetch(
      `${env.URL}/chats/${blockType}`, {method: 'PUT', body:js, headers:{'Content-Type': 'application/json', 'authorization': tokenHeader}}
    ).then(async ret => {
      let res = JSON.parse(await ret.text());
      if (res.Error) {
        console.warn("Error: ", res.Error);
      } else {
        const data = {
          chatId: chat.id,
          chat: {
            id: chat.id,
            blocked: res.blocked,
          }
        };
        await socket.emit('send_block', data);
        updateBlocked(res);
      }
    });
  }

  const muteAction = async () => {
    const obj = { chatId: chat.id, userId: userInfo.id };
    const js = JSON.stringify(obj);
    const tokenHeader = await authTokenHeader();
    const muteType = (chat.muted.includes(userInfo.id)) ? 'unmute' : 'mute';
    return fetch(
      `${env.URL}/chats/${muteType}`, {method: 'PUT', body:js, headers:{'Content-Type': 'application/json', 'authorization': tokenHeader}}
    ).then(async ret => {
      let res = JSON.parse(await ret.text());
      if (res.Error) {
        console.warn("Error: ", res.Error);
      } else {
        updateMuted(res);
      }
    });
  }

  const isDisabled = (block: any) => {
    if (!block) return false;
    return block !== userInfo.id;
  }

  const BlockedTab = ({ block }: any) => {
    if (isDisabled(block)) return <></>;
    return (
      <TouchableHighlight
        underlayColor={Color(isDarkMode).underlayMask} 
        style={styles.tabContainer}
        onPress={() => {
          blockAction();
          setShowPopUp(false);
        }}
      >
        <>
          <View style={styles.blockChatImage}>
            {(block) ? <UnblockChat/> : <BlockChat/>}
          </View>
          {<_Text isDarkMode={isDarkMode}>{(block) ? 'Unblock User' : 'Block User'}</_Text>}
        </>
      </TouchableHighlight>
    )
  }

  const MuteTab = ({ block, mute }: any) => {
    if (isDisabled(block)) return <></>;
    return (
      <TouchableHighlight 
        underlayColor={Color(isDarkMode).underlayMask} 
        style={styles.tabContainer}
        onPress={() => {
          muteAction();
          setShowPopUp(false);
        }}
      >
        <>
          <View style={styles.blockChatImage}>
            {(mute && mute.includes(userInfo.id)) ? <UnmuteChat/> : <MuteChat/>}
          </View>
          {<_Text isDarkMode={isDarkMode}>{(mute && mute.includes(userInfo.id)) ? 'Unmute Chat' : 'Mute Chat'}</_Text>}
        </>
      </TouchableHighlight>
    )
  }
  
  return (
    <>
    {!isDisabled(chat.blocked) ?
    <>
      <Pressable onPress={() => setShowPopUp(false)} style={showPopUp ? styles.popUpBackground : {display: 'none'}}/>
      <View style={showPopUp ? styles.popUpContainer : {display: 'none'}}>
        <View style={styles.popUp}>
          <BlockedTab block={chat.blocked}/>
          <MuteTab block={chat.blocked} mute={chat.muted}/>
        </View>
      </View>
    </>
    : null}
    </>
  );
}

export default MessageSettings;