import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import _Button from '../components/control/button';
import _TextInput from '../components/control/text-input';
import { Style, Color, FontSize, Radius } from '../style';
import _Image from '../components/control/image';
import { env, navProp, NavTo, userId as getUserId, authTokenHeader, AccountScreenType } from '../helper';
import Icon from 'react-native-vector-icons/Ionicons';


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
    console.log(profile);
    getTags();
  }, [profile]);

  const getLoggedInUserId = async () => {
    const userId = await getUserId();
    setUserId(userId);
    // setUserId("a781adb8-d31d-424d-8918-c9cf639ccc7e"); // for testing
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
      console.log("Inside getProfile");
      await fetch(`${env.URL}/users/myProfile?userId=${userId}`,
        { method: 'GET', headers: { 'Content-Type': 'application/json', 'authorization': await authTokenHeader() } }).then(async ret => {
          let res = JSON.parse(await ret.text());
          console.log(res);
          if (res.Error) {
            console.warn("Error: ", res.Error);
          }
          else {
            setProfile({ ...res, age: res.birthday ? getAge(res.birthday) : 0 });
          }
        });
    }
    catch (e) {
      console.log(e);
      return;
    }
  };

  const getTags = async () => {
    setTagsFetched(false);
    try {
      if (profile.id) {
        console.log("Inside getTags");
        await fetch(`${env.URL}/users/getBioAndTagsMob?userId=${userId}`,
          { method: 'GET', headers: { 'Content-Type': 'application/json', 'authorization': await authTokenHeader() } }).then(async ret => {
            let res = JSON.parse(await ret.text());
            console.log(res);
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
      console.log(e);
      return;
    }
  };

  if (!profile.id) {
    return (
      <View style={styles.loadingScreen}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.profileContainer}>
      <View style={styles.btnRow}>
        <TouchableOpacity onPress={() => { navigation.goBack() }}>
          <Icon name="arrow-back" size={30} color="#000" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => { navigation.navigate(NavTo.Account, { view: 'info' } as never) }}>
          <Text style={styles.btnText}>Edit Profile</Text>
        </TouchableOpacity>
      </View>
      <Image style={styles.profileImg} source={profile?.image} />
      <Text style={styles.name}>{profile?.first_name + " " + profile?.last_name}</Text>
      <Text style={styles.info}>Age: {profile?.age} | From: {profile?.city}, {profile?.state}</Text>
      <Text style={styles.bio}>"{profile?.bio}"</Text>
      <Text style={styles.interestsHeading}>My Interests and Hobbies</Text>
      {tagsFetched ? tags.map((tag, index) =>
        (index % 3 == 0) &&
        <View style={styles.tagsRow} key={index}>
          <View style={styles.tagBox}><Text style={styles.tagText}>{tag?.tag}</Text></View>
          {tags[index + 1]?.tag && <View style={styles.tagBox}><Text style={styles.tagText}>{tags[index + 1]?.tag}</Text></View>}
          {tags[index + 2]?.tag && <View style={styles.tagBox}><Text style={styles.tagText}>{tags[index + 2]?.tag}</Text></View>}
        </View>
      )
        :
        <View>
          <ActivityIndicator size="large" />
        </View>
      }
    </ScrollView>
  );
};

export default MyProfileScreen;


const styles = StyleSheet.create({
  loadingScreen: {
    paddingTop: '50%',
  },
  profileContainer: {
    flex: 1,
    backgroundColor: 'white',
    paddingTop: 30,
  },
  btnRow: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
  },
  btnText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
    textDecorationLine: 'underline'
  },
  profileImg: {
    width: 140,
    height: 140,
    borderWidth: 2,
    borderRadius: Radius.round,
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  name: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 12,
    marginBottom: 7,
    // elevation: 4,
    // shadowColor: '#000',
    // shadowOffset: { width: 0, height: 1 },
    // shadowOpacity: 0.8,
    // shadowRadius: 2,
  },
  info: {
    textAlign: 'center',
  },
  bio: {
    textAlign: 'center',
    marginLeft: 25,
    marginRight: 25,
    marginTop: 7,
    marginBottom: 18,
    // backgroundColor: 'yellow'
  },
  interestsHeading: {
    fontSize: 16,
    fontWeight: 'bold',
    paddingLeft: '5%',
    paddingBottom: 26,
    paddingTop: 12,
    // color: '#424242',
    // backgroundColor: 'blue'
  },
  tagsRow: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    marginBottom: 20,
  },
  tagBox: {
    color: 'white',
    backgroundColor: 'grey',
    borderColor: 'grey',
    borderWidth: 2,
    borderRadius: 30,
    paddingHorizontal: 14,
    paddingTop: 7,
    paddingBottom: 10,
  },
  tagText: {
    color: 'white',
    fontSize: 13,
    fontWeight: '500',
    margin: 'auto',
  }
});