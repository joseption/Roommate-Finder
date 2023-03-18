import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  Button,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Platform,
  TouchableHighlight,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import _Button from "../components/control/button";
import _TextInput from "../components/control/text-input";
import { Style, Color, FontSize, Radius } from "../style";
import _Image from "../components/control/image";
import { env, navProp, NavTo, authTokenHeader, getAge } from "../helper";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import _Group from "../components/control/group";
import _Text from "../components/control/text";

const ProfileScreen = (props: any) => {
  /*
  Daniyal: Add all content for the single page view here,
  If you need to make reusable components, create a folder
  in the components folder named "profile" and add your compo>nent files there
  */

  const [profile, setProfile] = useState<any>({});
  const [tags, setTags] = useState<any[]>([]);
  const [tagsFetched, setTagsFetched] = useState(false);
  const [match, setMatch] = useState(0);
  const navigation = useNavigation<navProp>();

  useEffect(() => {
    let rt = route();
    if (rt && rt.params && rt.name && rt.name == NavTo.Profile) {
      if (rt.params['profile']) {
        props.setNavSelector(NavTo.Search);
        getUser(rt.params['profile']);
      }
      setMatch(rt.params['match'] ? rt.params['match'] : 0);
    }
  }, [props.route])

  useEffect(() => {
    getTags();
  }, [profile]);

  const route = () => {
    if (navigation) {
      let state = navigation.getState();
      if (state && state.routes) {
        return state.routes[state.index];
      }
    }
    return null;
  };

  const getTags = async () => {
    try {
      if (profile.id) {
        await fetch(`${env.URL}/users/getBioAndTagsMob?userId=${profile.id}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            authorization: await authTokenHeader(),
          },
        }).then(async (ret) => {
          let res = JSON.parse(await ret.text());
          if (res.Error) {
            console.warn("Error: ", res.Error);
          } else {
            setTags(res.tags);
            setTagsFetched(true);
          }
        });
      }
    } catch (e) {
      return;
    }
  };

  const getUser = async (id: string) => {
    const tokenHeader = await authTokenHeader();
    return fetch(
      `${env.URL}/users/profile?userId=${id}`, {method:'GET',headers:{'Content-Type': 'application/json', 'authorization': tokenHeader}}
    ).then(async ret => {
      const res = JSON.parse(await ret.text());
      if (res.Error) {
        console.warn("Error: ", res.Error);
      } else {
        setProfile(res);
      }
    });
  }

  const generateRequestId = () => {
    return Math.floor(Math.random() * 9999999) + 1;
  };

  const tag = () => {
    return tags.map((tag, key) =>
    <View
    key={key}
    >
      <_Text
      style={styles.tagText}
      isDarkMode={props.isDarkMode}
      >
        {tag?.tag}
      </_Text>
    </View>
    )
  }

  const styles = StyleSheet.create({
    loadingScreen: {
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      flex: 1
    },
    rowContent: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    profileImg: {
      width: 300,
      height: 300,
      borderWidth: 1,
      borderRadius: Radius.large,
      borderColor: Color(props.isDarkMode).separator,
      backgroundColor: Color(props.isDarkMode).userIcon
    },
    name: {
      fontSize: FontSize.large,
      fontWeight: 'bold',
      marginRight: 5,
    },
    interestsHeading: {
      fontSize: FontSize.default,
      fontWeight: 'bold',
      paddingBottom: 5,
      paddingTop: 20,
    },
    heading: {
      fontSize: FontSize.default,
      fontWeight: 'bold',
      paddingTop: 20,
    },
    tagsRow: {
      flexDirection: 'row',
      alignItems: 'center',
      flexWrap: 'wrap'
    },
    tagText: {
      marginRight: 5,
      marginBottom: 5,
      borderRadius: Radius.round,
      paddingVertical: 5,
      paddingHorizontal: 15,
      color: Color(props.isDarkMode).text,
      fontSize: FontSize.default,
      backgroundColor: props.isDarkMode ? Color(props.isDarkMode).holder : Color(props.isDarkMode).holderSecondary,
    },
    mainContent: {
      marginTop: 50,
      width: '100%',
      flex: 1,
    },
    group: {
      flex: 1,
      marginTop: -50,
    },
    imageContainer: {
      zIndex: 3,
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'center'
    },
    view: {
      flexDirection: 'column-reverse',
      padding: 10,
      flex: 1
    },
    icon: {
      ...Platform.select({
          web: {
              outlineStyle: 'none'
          }
      }),
    },
    btnContent: {
      justifyContent: 'center',
      alignItems: 'center',
      flexDirection: 'row',
    },
    btnText: {
      marginLeft: 5,
      color: Color(props.isDarkMode).actualWhite
    },
    matchText: {
      color: Color(props.isDarkMode).actualWhite,
      fontSize: FontSize.tiny,
      fontWeight: 'bold'
    },
    matchContainer: {
      position: 'absolute',
      height: '100%',
      width: '100%',
    },
    backIcon: {
      ...Platform.select({
        web: {
          outlineStyle: 'none'
        }
      }),
    },
    button: {
      padding: 10,
      borderRadius: Radius.round,
      margin: 5,
      position: 'absolute',
      zIndex: 5
    },
    bio: {
      width: '100%'
    },
    msgButton: {
      padding: 10,
      borderRadius: Radius.round,
      backgroundColor: Color(props.isDarkMode).default
    },
    nameContainer: {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      flex: 1
    },
    matchInnerContent: {
      height: '100%',
      alignItems: 'center',
      justifyContent: 'center',
      width: '100%',
    },
    empty: {
      height: '100%',
      flex: 1,
    },
    innerGroup: {
      height: '100%'
    },
    container: {
      flex: 1,
    },
    iconLabel: {
      flexDirection: 'row',
      alignItems: 'center'
    },
    labelIcon: {
      marginRight: 5
    },
    firstLabelContainer: {
    },
    outerMatchContainer: {
      marginRight: 5,
      justifyContent: 'center',
      alignItems: 'center'
    },
    leftHeader: {
      flexDirection: 'row',
      alignItems: 'center'
    },
    nameContent: {
      flex: 1,
      alignItems:'center'
    }
  });

  const goBack = () => {
    let rt = route();
    if (rt && rt.params && rt.name && rt.name == NavTo.Profile &&
      rt.params['fromChat'] && rt.params['fromChat'] === 'true' && rt.params['profile']) {
      props.setShowingMessagePanel(true);
      navigation.navigate(NavTo.Messages, {user: rt.params['profile'], requestId: generateRequestId()} as never);
    }
    else {
      navigation.goBack();
    }
  }

  if (!profile.id) {
    return (
      <View style={styles.loadingScreen}>
        <ActivityIndicator
        size="large"
        color={Color(props.isDarkMode).gold}
        />
      </View>
    );
  }

  return (
    <ScrollView
    contentContainerStyle={styles.container}
    >
      {navigation.canGoBack() ?
      <TouchableHighlight
      underlayColor={Color(props.isDarkMode).underlayMask}
      style={styles.button}
      onPress={() => goBack() }
      >
        <FontAwesomeIcon 
        size={20} 
        color={Color(props.isDarkMode).text} 
        style={styles.backIcon} 
        icon="arrow-left"
        >
        </FontAwesomeIcon>
      </TouchableHighlight>
      : null }
      <View
      style={styles.view}
      >
        <_Group
        containerStyle={styles.group}
        isDarkMode={props.isDarkMode}
        vertical={true}
        style={styles.innerGroup}
        >
          <ScrollView
          style={styles.mainContent}
          >
            <View
            style={styles.rowContent}
            >
              <View
              style={styles.nameContainer}
              >
                {profile?.first_name && profile?.last_name ?
                <_Text
                innerContainerStyle={styles.nameContent}
                style={styles.name}
                isDarkMode={props.isDarkMode}
                numberOfLines={1}
                >
                  {profile?.first_name + " " + profile?.last_name}
                </_Text>
                : null }
                {match ?
                <View
                style={styles.outerMatchContainer}
                >
                  <FontAwesomeIcon 
                  size={35} 
                  color={Color(props.isDarkMode).gold} 
                  style={styles.backIcon} 
                  icon="certificate"
                  >
                  </FontAwesomeIcon>
                  <_Text
                  isDarkMode={props.isDarkMode}
                  style={styles.matchText}
                  containerStyle={styles.matchContainer}
                  innerContainerStyle={styles.matchInnerContent}
                  >
                    {match}%
                  </_Text>
                </View>
                : null }
                </View>
                <TouchableHighlight
                underlayColor={Color(props.isDarkMode).defaultUnderlay}
                style={styles.msgButton}
                onPress={() => {
                  props.setNavSelector(NavTo.Messages);
                  navigation.navigate(NavTo.Messages, {user: profile.id, requestId: generateRequestId()} as never);
                }}
                >
                  <FontAwesomeIcon 
                  size={20} 
                  color={Color(props.isDarkMode).actualWhite} 
                  style={styles.backIcon} 
                  icon="message"
                  >
                </FontAwesomeIcon>
              </TouchableHighlight>
            </View>
            {profile?.birthday ?
            <View
            style={[styles.iconLabel, styles.firstLabelContainer]}
            >
              <FontAwesomeIcon 
                size={15} 
                color={Color(props.isDarkMode).text} 
                style={[styles.backIcon, styles.labelIcon]} 
                icon="cake-candles"
                >
              </FontAwesomeIcon>
              <_Text
              isDarkMode={props.isDarkMode}
              >
                {getAge(profile?.birthday)} years old
              </_Text>
            </View>
            : null }
            {profile?.city && profile?.state ?
            <View
            style={styles.iconLabel}
            >
              <FontAwesomeIcon 
                size={15} 
                color={Color(props.isDarkMode).text} 
                style={[styles.backIcon, styles.labelIcon]} 
                icon="location-dot"
                >
              </FontAwesomeIcon>
              <_Text
              isDarkMode={props.isDarkMode}
              >
                {profile?.city}, {profile?.state}
              </_Text>
            </View>
            : null }
            {profile?.bio ?
            <View>
              <_Text
              style={styles.heading}
              isDarkMode={props.isDarkMode}
              >
                About
              </_Text>
              <_Text
              isDarkMode={props.isDarkMode}
              style={styles.bio}
              >
                {profile?.bio}
              </_Text>
            </View>
            : null }
            <_Text
            style={styles.interestsHeading}
            isDarkMode={props.isDarkMode}
            >
              Interests and Hobbies
            </_Text>
            {tagsFetched ?
            <View style={styles.tagsRow}>
              {tag()}
            </View>
              :
              <View>
                <ActivityIndicator
                color={Color(props.isDarkMode).gold}
                size="large"
                />
              </View>
            }
            <View
              style={styles.empty}
            />
          </ScrollView>
        </_Group>
        <_Image
        height={300}
        width={300}
        style={styles.profileImg}
        source={{uri: profile?.image}}
        containerStyle={styles.imageContainer}
        isDarkMode={props.isDarkMode}
        />
      </View>
    </ScrollView>
  );
};

export default ProfileScreen;
