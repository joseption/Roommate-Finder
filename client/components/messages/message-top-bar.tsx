import { View, StyleSheet, Pressable, Text, Image } from "react-native";
import _Button from "../control/button";
import Svg, { Path } from "react-native-svg"
import Dots from "../../assets/images/dots_popup_svg";
import { useState } from "react";
import MessageSettings from "./message-settings";
import { Color } from "../../style";


const returnIcon = (
  <Svg
    width={17}
    height={16}
    viewBox="0 0 17 16"
    fill="none"
  >
    <Path
      d="M5.173 8L12.85.774a.433.433 0 000-.64.5.5 0 00-.68 0L4.15 7.68a.433.433 0 000 .64l8.02 7.545a.5.5 0 00.338.134.484.484 0 00.338-.134.433.433 0 000-.64L5.173 8z"
      fill="#418DFC"
    />
  </Svg>
)

interface Props {
  chat: any,
  userInfo: any,
  showPanel: any,
  updateShowPanel: any,
  updateBlocked: any,
  socket: any,
  isDarkMode: boolean
}

const MessageTopBar = ({isDarkMode, showPanel, userInfo, updateShowPanel, chat, socket, updateBlocked}: Props) => {
  if (!chat?.users) return <></>;

  const [showPopUp, setShowPopUp] = useState<boolean>(false);

  const styles = StyleSheet.create({
    container: {
      flexDirection: 'row',
      backgroundColor: 'white',
      padding: 5,
      paddingHorizontal: 10,
      alignItems: 'center',
      minHeight: 55,
      borderBottomWidth: 1,
      borderColor: Color(isDarkMode).separator,
      zIndex: 2,
    },
    buttonContainer: {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      width: 30,
      height: 40,
    },
    image: {
      height: 40,
      width: 40,
      borderRadius: 20,
      marginRight: 10,
    },
    name: {
      flex: 1,
      fontSize: 18,
      fontWeight: '600',
    },
  });

  return (
    <>
      <View style={styles.container}>
        <View style={styles.buttonContainer}>
          <Pressable onPress={() => updateShowPanel(!showPanel)}>
            {returnIcon}
          </Pressable>
        </View>
        <Image style={styles.image} source={{ uri: (chat?.users[0]?.image != null) ? chat?.users[0]?.image : 'https://reactnative.dev/img/tiny_logo.png'}} />
        <Text numberOfLines={1} style={styles.name}>{chat?.users[0]?.first_name + ' ' + chat?.users[0]?.last_name}</Text>
        <View style={styles.buttonContainer}>
          <Pressable onPress={() => setShowPopUp(!showPopUp)}>
            <Dots width={18} height={18}/>
          </Pressable>
        </View>
      </View>
      <MessageSettings
        chat={chat}
        userInfo={userInfo}
        showPopUp={showPopUp}
        setShowPopUp={setShowPopUp}
        updateBlocked={updateBlocked}
        socket={socket}
      />
    </>
  );
}

export default MessageTopBar;