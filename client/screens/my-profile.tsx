import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import _Button from '../components/control/button';
import _TextInput from '../components/control/text-input';
import { Style, Color, FontSize, Radius } from '../style';
import _Image from '../components/control/image';
import { env, navProp, NavTo, userId as getUserId, authTokenHeader, AccountScreenType, isDarkMode } from '../helper';
import _Text from '../components/control/text';
import _Group from '../components/control/group';


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

  function getAge(dateString: any) {
    var today = new Date();
    var birthDate = new Date(dateString);
    var age = today.getFullYear() - birthDate.getFullYear();
    var m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  }

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
      flexDirection: 'column-reverse'
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
              onPress={() => { navigation.navigate(NavTo.Account, { view: 'info' } as never) }}
              isDarkMode={props.isDarkMode}
              >
                Edit Profile
              </_Button>
            </View>
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

export default MyProfileScreen;