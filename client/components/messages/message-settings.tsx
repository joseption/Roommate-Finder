import { View, StyleSheet, Pressable, Dimensions, Text } from "react-native";
import BlockChat from "../../assets/images/block_chat_svg";
import UnblockChat from "../../assets/images/unblock_chat_svg";
import { TouchableHighlight } from "react-native-gesture-handler";

interface Props {
  chat: any,
  showPopUp: boolean,
  setShowPopUp: any,
}

const MessageSettings = ({ chat, showPopUp, setShowPopUp }: Props) => {
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

  const BlockedTab = (block: any) => {
    return (
      <TouchableHighlight underlayColor="gainsboro" style={styles.tabContainer} onPress={() => {console.log('block'); setShowPopUp(false)}}>
        <>
          <View style={styles.blockChatImage}>
            {(block) ? <UnblockChat/> : <BlockChat/>}
          </View>
          {<Text style={styles.tabText}>{(block) ? 'Unblock Chat' : 'Block Chat'}</Text>}
        </>
      </TouchableHighlight>
    )
  }
  
  return (
    <>
      <Pressable onPress={() => setShowPopUp(false)} style={showPopUp ? styles.popUpBackground : {display: 'none'}}/>
      <View style={showPopUp ? styles.popUp : {display: 'none'}}>
        <BlockedTab block={true}/>
      </View>
    </>
  );
}

export default MessageSettings;