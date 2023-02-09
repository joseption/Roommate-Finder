import { View, StyleSheet, Pressable, Dimensions, Text } from "react-native";
import BlockChat from "../../assets/images/block_chat_svg";
import UnblockChat from "../../assets/images/unblock_chat_svg";
import { authTokenHeader, env } from "../../helper";

interface Props {
  chat: any,
  userInfo: any,
  showPopUp: boolean,
  setShowPopUp: any,
  updateBlocked: any
}

const MessageSettings = ({ chat, userInfo, showPopUp, setShowPopUp, updateBlocked }: Props) => {
  const dim = Dimensions.get('window')

  const styles = StyleSheet.create({
    popUpBackground: {
      zIndex: 3,
      position: 'absolute',
      width: '100%',
      height: '100%',
      backgroundColor: 'transparent',
    },
    popUp: {
      zIndex: 3,
      position: 'absolute',
      width: 130,
      transform: [{translateX: (dim.width - 150)}, {translateY: 35}],
  
      backgroundColor: 'white',
      borderRadius: 10,
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 3,
      },
      shadowOpacity: 0.29,
      shadowRadius: 4.65,
      elevation: 7,
    },
    tabContainer: {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      padding: 5,
      borderRadius: 10,
    },
    blockChatImage: {
      marginRight: 5,
    },
    tabText: {
      fontWeight: '400'
    }
  });

  const blockAction = async () => {
    const obj = { chatId: chat.id, userId: userInfo.id };
    const js = JSON.stringify(obj);
    const tokenHeader = await authTokenHeader();
    const method = (chat.blocked) ? 'DELETE' : 'POST';
    return fetch(
      `${env.URL}/block`, {method: method, body:js, headers:{'Content-Type': 'application/json', 'authorization': tokenHeader}}
    ).then(async ret => {
      let res = JSON.parse(await ret.text());
      if (res.Error) {
        console.warn("Error: ", res.Error);
      } else {
        updateBlocked(chat.id);
      }
    });
  }

  const BlockedTab = ({ block }: any) => {
    return (
      <Pressable style={styles.tabContainer} onPress={() => {blockAction(); setShowPopUp(false)}}>
        <>
          <View style={styles.blockChatImage}>
            {(block) ? <UnblockChat/> : <BlockChat/>}
          </View>
          {<Text style={styles.tabText}>{(block) ? 'Unblock Chat' : 'Block Chat'}</Text>}
        </>
      </Pressable>
    )
  }
  
  return (
    <>
      <Pressable onPress={() => setShowPopUp(false)} style={showPopUp ? styles.popUpBackground : {display: 'none'}}/>
      <View style={showPopUp ? styles.popUp : {display: 'none'}}>
        <BlockedTab block={chat.blocked}/>
      </View>
    </>
  );
}

export default MessageSettings;