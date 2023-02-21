import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Image, Button, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import _Button from '../components/control/button';
import _TextInput from '../components/control/text-input';
import { Style, Color, FontSize, Radius } from '../style';
import _Image from '../components/control/image';
import { env, navProp, NavTo, authTokenHeader } from '../helper';
import Icon from 'react-native-vector-icons/Ionicons';
import AntDesign from 'react-native-vector-icons/AntDesign';


const ProfileScreen = (props: any) => {
  /*
  Daniyal: Add all content for the single page view here,
  If you need to make reusable components, create a folder
  in the components folder named "profile" and add your compo>nent files there
  */

  const [profile, setProfile] = useState<any>({});
  const [tags, setTags] = useState<any[]>([]);
  const [tagsFetched, setTagsFetched] = useState(false);

  const navigation = useNavigation<navProp>();

  useEffect(() => {
    let rt = route();
    if (rt && rt.params && rt.name && rt.name == NavTo.Profile) {
      if (rt.params['profile']) {
        setProfile(rt.params['profile']);
      }
    }
  }, []);

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
  }

  const getTags = async () => {
    try {
      if (profile.id) {
        await fetch(`${env.URL}/users/getBioAndTagsMob?userId=${profile.id}`,
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
      console.log(e);
      return;
    }
  };

  const generateRequestId = () => {
    return Math.floor(Math.random() * 9999999) + 1;
  }

  if (!profile.id) {
    return (
      <View style={styles.loadingScreen}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.profileContainer}>
      <TouchableOpacity onPress={() => { navigation.goBack() }}>
        <Icon name="arrow-back" size={30} color="#000" />
      </TouchableOpacity>
      <Image style={styles.profileImg} source={profile?.image} />
      <Text style={styles.name}>{profile?.first_name + " " + profile?.last_name}</Text>
      <Text style={styles.info}>Age: {profile?.age} | From: {profile?.city}, {profile?.state}</Text>
      <Text style={styles.match}>Match: {profile?.matchPercentage}%</Text>
      <Text style={styles.bio}>"{profile?.bio}"</Text>
      <View style={styles.chatRow}>
        <TouchableOpacity style={styles.chatButton} onPress={() => { }}>
          <Text style={styles.chatText} >
            <AntDesign name="message1" size={15} color="white" style={styles.chatIcon} />
            Chat
          </Text>
        </TouchableOpacity>
      </View>
      <Text style={styles.interestsHeading}>Interests and Hobbies</Text>
      {tagsFetched ? tags.map((tag, index) =>
        (index % 3 == 0) &&
        <View style={styles.tagsRow} key={index}>
          <View style={styles.tagBox}><Text style={styles.tagText}>{tags[index]?.tag}</Text></View>
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

export default ProfileScreen;


const styles = StyleSheet.create({
  loadingScreen: {
    paddingTop: '50%',
  },
  profileContainer: {
    flex: 1,
    backgroundColor: 'white',
    paddingTop: 30,
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
  match: {
    textAlign: 'center',
    fontStyle: 'italic',
    marginTop: 7
  },
  bio: {
    textAlign: 'center',
    marginLeft: 25,
    marginRight: 25,
    marginTop: 7,
    marginBottom: 18,
    // color: 'grey'
    // backgroundColor: 'yellow'
  },
  chatRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  chatButton: {
    borderWidth: 1,
    borderRadius: 30,
    backgroundColor: 'black',
    paddingVertical: 5,
    paddingBottom: 7,
    paddingHorizontal: 15,
    marginRight: 15,
    marginVertical: 10
  },
  chatText: {
    color: 'white',
    fontWeight: '600',
    textAlign: 'center'
  },
  chatIcon: {
    paddingRight: 5,
    paddingBottom: 0,
    // backgroundColor: 'yellow',
  },
  interestsHeading: {
    fontSize: 16,
    fontWeight: 'bold',
    paddingLeft: '5%',
    paddingBottom: 26,
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