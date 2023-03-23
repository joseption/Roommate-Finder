import { View, StyleSheet, Pressable, Text, Image, TouchableHighlight } from "react-native";
import _Button from "../control/button";
import Svg, { Path } from "react-native-svg"
import Dots from "../../assets/images/dots_popup_svg";
import { useEffect, useState } from "react";
import { NavTo, navProp } from "../../helper";
import MessageSettings from "./message-settings";
import { Color, FontSize, Radius } from "../../style";
import _Image from "../control/image";
import _Text from "../control/text";
import { useNavigation } from "@react-navigation/native";



const returnIcon = (
  <Svg
    width={20}
    height={20}
    viewBox="0 0 22 20"
    fill="none"
  >
    <Path
      d="M5.173 8L12.85.774a.433.433 0 000-.64.5.5 0 00-.68 0L4.15 7.68a.433.433 0 000 .64l8.02 7.545a.5.5 0 00.338.134.484.484 0 00.338-.134.433.433 0 000-.64L5.173 8z"
      fill="#418DFC"
      stroke="#418DFC"
      strokeLinecap="round"
      strokeWidth={2}
    />
  </Svg>
)

interface Props {
  chat: any,
  userInfo: any,
  showPanel: any,
  updateShowPanel: any,
  updateBlocked: any,
  updateMuted: any,
  socket: any,
  isDarkMode: boolean,
}

const MessageTopBar = ({isDarkMode, showPanel, userInfo, updateShowPanel, chat, socket, updateBlocked, updateMuted}: Props) => {
  if (!chat?.users) return <></>;

  const [showPopUp, setShowPopUp] = useState<boolean>(false);
  const navigation = useNavigation<navProp>();

  const getUserIcon = () => {
    if (chat?.userInfo.image)
      return {uri: chat?.userInfo?.image};
    else
      return require('../../assets/images/user.png');
  }

  const hasImage = () => {
    return chat?.userInfo?.image;
  }

  const styles = StyleSheet.create({
    container: {
      flexDirection: 'row',
      backgroundColor: Color(isDarkMode).contentBackgroundSecondary,
      padding: 5,
      paddingHorizontal: 5,
      alignItems: 'center',
      borderBottomWidth: .5,
      borderColor: Color(isDarkMode).separator,
      zIndex: 2,
    },
    buttonContainer: {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
    },
    backContent: {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 10,
      borderRadius: Radius.round,
    },
    name: {
      fontSize: FontSize.default,
      fontWeight: 'bold',
      color: Color(isDarkMode).text
    },
    profileInfo: {
      borderRadius: Radius.round,
    },
    image: {
      height: hasImage() ? 35 : 30,
      width: hasImage() ? 35 : 30,
      borderRadius: Radius.round,
    },
    imageContainerStyle: {
      minWidth: 35,
      minHeight: 35,
      justifyContent: 'center',
      alignItems: 'center',
      flexDirection: 'row',
      marginRight: 10,
      borderRadius: Radius.round,
      borderColor: Color(isDarkMode).separator,
      borderWidth: 1,
      backgroundColor: Color(isDarkMode).userIcon,
    },
    menu: {
      padding: 10,
      borderRadius: Radius.round,
    },
    nameContent: {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 10,
      paddingVertical: 0,
      marginLeft: -10
    },
    optionsContent: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      flex: 1
    }
  });

  return (
    <>
      <View style={styles.container}>
        <View style={[styles.buttonContainer, {marginRight: 5}]}>
          <TouchableHighlight
            underlayColor={Color(isDarkMode).underlayMask}
            onPress={() => updateShowPanel(!showPanel)}
            style={styles.backContent}
          >
            {returnIcon}
          </TouchableHighlight>
        </View>
        <View
        style={styles.optionsContent}
        >
          <TouchableHighlight
            style={styles.profileInfo}
            underlayColor={Color(isDarkMode).underlayMask}
            onPress={() => {
              updateShowPanel(false);
              setTimeout(() => {
                navigation.navigate(NavTo.Profile, { profile: chat?.userInfo?.id, fromChat: 'true' } as never);
              }, 0);
            }}
          >
            <View
            style={styles.nameContent}
            >
              <_Image
              height={hasImage() ? 35 : 30}
              width={hasImage() ? 35 : 30}
              style={styles.image}
              containerStyle={styles.imageContainerStyle}
              source={getUserIcon()}
              />
              <_Text
              numberOfLines={1}
              style={styles.name}
              >
                {chat?.userInfo?.first_name + ' ' + chat?.userInfo?.last_name}
              </_Text>
            </View>
          </TouchableHighlight>
          <View style={styles.buttonContainer}>
            <TouchableHighlight
            underlayColor={Color(isDarkMode).underlayMask}
            onPress={() => setShowPopUp(!showPopUp)}
            style={styles.menu}
            >
              <Dots color={Color(isDarkMode).text} width={20} height={20}/>
            </TouchableHighlight>
          </View>
        </View>
      </View>
      <MessageSettings
        chat={chat}
        userInfo={userInfo}
        showPopUp={showPopUp}
        setShowPopUp={setShowPopUp}
        updateBlocked={updateBlocked}
        updateMuted={updateMuted}
        socket={socket}
        isDarkMode={isDarkMode}
      />
    </>
  );
}

export default MessageTopBar;