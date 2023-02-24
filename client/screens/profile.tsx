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
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import _Button from "../components/control/button";
import _TextInput from "../components/control/text-input";
import { Style, Color, FontSize, Radius } from "../style";
import _Image from "../components/control/image";
import { env, navProp, NavTo, authTokenHeader } from "../helper";
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
        console.log(res)
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
      margin: 'auto'
    },
    rowContent: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      width: '100%'
    },
    profileImg: {
      width: 150,
      height: 150,
      borderWidth: 1,
      borderRadius: Radius.round,
      borderColor: Color(props.isDarkMode).separator,
      marginHorizontal: 'auto',
      backgroundColor: Color(props.isDarkMode).userIcon
    },
    name: {
      fontSize: FontSize.large,
      fontWeight: 'bold',
      marginTop: 10,
    },
    nameContent: {
      flex: 1
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
      marginTop: 35,
      width: '100%'
    },
    group: {
      marginTop: -50
    },
    imageContainer: {
      zIndex: 3
    },
    view: {
      flexDirection: 'column-reverse',
      padding: 10
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
      flexDirection: 'row'
    },
    btnText: {
      marginLeft: 5,
      color: Color(props.isDarkMode).actualWhite
    },
    matchText: {
      borderRadius: Radius.round,
      paddingVertical: 5,
      paddingHorizontal: 10,
      color: Color(props.isDarkMode).actualWhite,
      fontSize: FontSize.default,
      backgroundColor: Color(props.isDarkMode).gold,
      marginBottom: 5
    }
  });

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
    <ScrollView>
      <View
      style={styles.view}
      >
        <_Group
        containerStyle={styles.group}
        isDarkMode={props.isDarkMode}
        vertical={true}
        >
          <View
          style={styles.mainContent}
          >
            <View
            style={styles.rowContent}
            >
              <_Text
              style={styles.name}
              isDarkMode={props.isDarkMode}
              numberOfLines={1}
              containerStyle={styles.nameContent}
              >
                {profile?.first_name + " " + profile?.last_name}
              </_Text>
              <_Button
              onPress={() => {
                navigation.navigate(NavTo.Messages, {user: profile.id, requestId: generateRequestId()} as never);
              }}
              isDarkMode={props.isDarkMode}
              >
                <View
                style={styles.btnContent}
                >
                  <FontAwesomeIcon
                  style={styles.icon}
                  size={20}
                  color={Color(props.isDarkMode).actualWhite}
                  icon="message"
                  >
                  </FontAwesomeIcon>
                  <_Text
                  style={styles.btnText}
                  isDarkMode={props.isDarkMode}
                  >
                  Message
                  </_Text>
                </View>
              </_Button>
            </View>
            {match ?
            <_Text
            isDarkMode={props.isDarkMode}
            style={styles.matchText}
            >
              {match}% match
            </_Text>
            : null }
            <_Text
            isDarkMode={props.isDarkMode}
            >
              {profile?.age} years old
            </_Text>
            <_Text
            isDarkMode={props.isDarkMode}
            >
              {profile?.city}, {profile?.state}
            </_Text>
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
          </View>
        </_Group>
        <_Image
        height={150}
        width={150}
        style={styles.profileImg}
        source={{uri: profile?.image}}
        containerStyle={props.imageContainer}
        />
      </View>
    </ScrollView>
  );
};

export default ProfileScreen;
