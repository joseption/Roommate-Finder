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
  RefreshControl,
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
  const [refreshing, setRefreshing] = useState(false); 
  const [user, setUser] = useState(''); 

  const refresh = () => {
    setRefreshing(true);
    getUser(user);
    setRefreshing(false);
  };

  useEffect(() => {
    getUser(user);
  }, [user]);

  useEffect(() => {
    let rt = route();
    if (rt && rt.params && rt.name && rt.name == NavTo.Profile) {
      if (rt.params['profile']) {
        props.setNavSelector(NavTo.Search);
        setUser(rt.params['profile']);
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
    if (id) {
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
      width: '100%',
      height: 300,
      overflow: 'hidden',
      borderWidth: .5,
      borderRadius: Radius.default,
      borderColor: Color(props.isDarkMode).separator,
      backgroundColor: Color(props.isDarkMode).userIcon,
      paddingBottom: 20,

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
      width: '100%',
      flex: 1,
    },
    group: {
      flex: 1,
    },
    imageContainer: {
      zIndex: 3,
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'center',
      overflow: 'hidden',
    },
    view: {
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
      margin: 15,
      position: 'absolute',
      zIndex: 5,
      backgroundColor: Color(props.isDarkMode).transparentMask
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
      height: '100%'
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
    },
    imageContent: {
      flexDirection: 'row',
      justifyContent: 'center',
      flex: 1,
      marginBottom: 10
    },
    mainInnerContent: {
      height: '100%',
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
      let routes = navigation.getState()?.routes;
      if (routes && routes[routes.length - 2]?.name === NavTo.Listings) {
        props.setNavSelector(NavTo.Listings);
      }
      else {
        props.setNavSelector(NavTo.Search);
      }
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
    refreshControl={
      <RefreshControl
      refreshing={refreshing}
      onRefresh={refresh}
      colors={[Color(props.isDarkMode).gold]}
      progressBackgroundColor={Color(props.isDarkMode).contentHolder}
      />
      }
    >
      {navigation.canGoBack() ?
      <TouchableHighlight
      underlayColor={Color(props.isDarkMode).underlayMask}
      style={styles.button}
      onPress={() => goBack() }
      >
        <FontAwesomeIcon 
        size={20} 
        color={Color(props.isDarkMode).actualWhite} 
        style={styles.backIcon} 
        icon="arrow-left"
        >
        </FontAwesomeIcon>
      </TouchableHighlight>
      : null }
      <View
      style={styles.view}
      >
          <View
          style={styles.mainContent}
          >
            <View
            style={styles.imageContent}
            >
              <Image
              style={styles.profileImg}
              source={{uri: profile?.image}}
              containerStyle={styles.imageContainer}
              resizeMode='cover'
              />
            </View>
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
                    {Math.ceil(match)}%
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
            {profile?.gender ?
            <View
            style={[styles.iconLabel, styles.firstLabelContainer]}
            >
              <FontAwesomeIcon 
                size={15} 
                color={Color(props.isDarkMode).text} 
                style={[styles.backIcon, styles.labelIcon]} 
                icon={profile?.gender === "Female" ? 'person-dress' : 'person'}
                >
              </FontAwesomeIcon>
              <_Text
              isDarkMode={props.isDarkMode}
              >
                {profile?.gender === "Other" ? "Non-Binary" : profile?.gender}
              </_Text>
            </View>
            : null }
            {profile?.birthday ?
            <View
            style={styles.iconLabel}
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
          </View>
      </View>
    </ScrollView>
  );
};

export default ProfileScreen;
