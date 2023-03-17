import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, ScrollView, ActivityIndicator, TouchableHighlight, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import _Button from '../components/control/button';
import _TextInput from '../components/control/text-input';
import { Style, Color, FontSize, Radius } from '../style';
import _Image from '../components/control/image';
import { env, navProp, NavTo, userId as getUserId, authTokenHeader, AccountScreenType, isDarkMode, getAge } from '../helper';
import _Text from '../components/control/text';
import _Group from '../components/control/group';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';


const MyProfileScreen = (props: any) => {
  /*
  Daniyal: Add all content for the single page view here,
  If you need to make reusable components, create a folder
  in the components folder named "profile" and add your compo>nent files there
  */

  const [userId, setUserId] = useState<string>();
  const [profile, setProfile] = useState<any>({});
  const [tags, setTags] = useState<any[]>([]);
  const [tagsFetched, setTagsFetched] = useState(false);

  const navigation = useNavigation<navProp>();
  useEffect(() => {
      if (props.forceUpdateAccount) {
          setUserId('');
          getLoggedInUserId();
          props.setForceUpdateAccount(false);
      }
  }, [props.forceUpdateAccount])

  useEffect(() => {
    getLoggedInUserId();
  }, []);

  useEffect(() => {
    if (userId) {
      getProfile();
    }
  }, [userId]);

  useEffect(() => {
    getTags();
  }, [profile]);

  const getLoggedInUserId = async () => {
    const userId = await getUserId();
    setUserId(userId);
  };

  const getProfile = async () => {
    try {
      await fetch(`${env.URL}/users/myProfile?userId=${userId}`,
        { method: 'GET', headers: { 'Content-Type': 'application/json', 'authorization': await authTokenHeader() } }).then(async ret => {
          let res = JSON.parse(await ret.text());
          if (res.Error) {
            console.warn("Error: ", res.Error);
          }
          else {
            setProfile({ ...res, age: res.birthday ? getAge(res.birthday) : 0 });
          }
        });
    }
    catch (e) {
      return;
    }
  };

  const getTags = async () => {
    setTagsFetched(false);
    try {
      if (profile.id) {
        await fetch(`${env.URL}/users/getBioAndTagsMob?userId=${userId}`,
          { method: 'GET', headers: { 'Content-Type': 'application/json', 'authorization': await authTokenHeader() } }).then(async ret => {
            let res = JSON.parse(await ret.text());
            if (res.Error) {
              console.warn("Error: ", res.Error);
            }
            else {
              setTags(res.tags);
              setTagsFetched(true);
            }
          });
      }
    }
    catch (e) {
      return;
    }
  };

  const tag = () => {
    return tags.map((tag, index) =>
    <_Text
    style={styles.tagText}
    key={index}
    isDarkMode={props.isDarkMode}
    >
      {tag?.tag}
    </_Text>
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
      width: '100%'
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
      marginTop: 20,
    },
    nameContent: {
      flex: 1,
      marginTop: -30,
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
      backgroundColor: props.isDarkMode ? Color(props.isDarkMode).holder : Color(props.isDarkMode).contentBackgroundSecondary,
      borderColor: Color(props.isDarkMode).separator,
      borderWidth: .5
    },
    mainContent: {
      marginTop: 50,
      width: '100%'
    },
    group: {
      marginTop: -50,
      flex: 1
    },
    groupContent: {
      flex: 1
    },
    imageContainer: {
      zIndex: 3,
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'center'
    },
    view: {
      flexDirection: 'column-reverse',
      height: '100%',
      flex: 1
    },
    bio: {
      width: '100%'
    },
    editButton: {
      padding: 10,
      borderRadius: Radius.round,
      backgroundColor: Color(props.isDarkMode).default
    },
    backIcon: {
      ...Platform.select({
        web: {
          outlineStyle: 'none'
        }
      }),
    },
    iconLabel: {
      flexDirection: 'row',
      alignItems: 'center'
    },
    labelIcon: {
      marginRight: 5
    },
    firstLabelContainer: {
      marginTop: -5
    },
    container: {
      height: '100%',
      paddingBottom: 10
    },
    contentContainer: {
      flex: 1
    },
    empty: {
      height: '100%',
      flex: 1,
    },
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
    <ScrollView
    style={styles.container}
    contentContainerStyle={styles.contentContainer}
    >
      <View
      style={styles.view}
      >
        <_Group
        style={styles.groupContent}
        containerStyle={styles.group}
        isDarkMode={props.isDarkMode}
        vertical={true}
        >
          <ScrollView
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
              <TouchableHighlight
                underlayColor={Color(props.isDarkMode).defaultUnderlay}
                style={styles.editButton}
                onPress={() => { navigation.navigate(NavTo.Account, { view: 'info' } as never) }}
                >
                  <FontAwesomeIcon 
                  size={20} 
                  color={Color(props.isDarkMode).actualWhite} 
                  style={styles.backIcon} 
                  icon="pencil"
                  >
                </FontAwesomeIcon>
              </TouchableHighlight>
            </View>
            {profile?.age ?
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
                {profile?.age} years old
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
        />
      </View>
    </ScrollView>
  );
};

export default MyProfileScreen;