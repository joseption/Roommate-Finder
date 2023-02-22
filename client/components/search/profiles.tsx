import React, { useState, useEffect } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import ProfileCard from './profile-card';
import { env, authTokenHeader, navProp, NavTo } from '../../helper';
import { Color, Style } from '../../style';
import _Text from '../control/text';
import { useNavigation } from '@react-navigation/native';
import _Button from '../control/button';

interface Props {
  filters?: string[],
  filtersFetched?: boolean,
  isDarkMode: boolean,
  setNoResults: any
}

const Profile = ({ filters, filtersFetched, isDarkMode, setNoResults }: Props) => {
  /*
  Daniyal: This component will contain all of the profile card components
  and anything else that is needed for the overall profile view.F
  Add this component to the search screen.
  */

  const navigation = useNavigation<navProp>();
  const [allProfiles, setAllProfiles] = useState([]);
  const [isFetchedProfiles, setFetchedProfiles] = useState(false);

  useEffect(() => {
    setNoResults(!(isFetchedProfiles && allProfiles.length));
  }, [isFetchedProfiles, allProfiles])

  useEffect(() => {
    if (filtersFetched) {
      //console.log(filters);
      getFilteredProfiles();
    }
    else {
      getAllProfiles();
    }
  }, [filters, filtersFetched]);

  const getFilteredProfiles = async () => {
    let queryString;
    try {
      //console.log("Inside getFilteredProfiles");
      if (filtersFetched) {
        queryString = filters?.join(',');
      }
      await fetch(`${env.URL}/users/profilesByTags?userId=${"e6bb856a-9d91-40a7-8b2e-ca095b7389b8"}&filters=${queryString}`,
        { method: 'GET', headers: { 'Content-Type': 'application/json', 'authorization': await authTokenHeader() } }).then(async ret => {
          let res = JSON.parse(await ret.text());
          //console.log(res);
          if (res.Error) {
            console.warn("Error: ", res.Error);
          }
          else {
            setAllProfiles(res);
            setFetchedProfiles(true);
          }
        });
    }
    catch (e) {
      //(e);
      return;
    }
  };

  const getAllProfiles = async () => {
    try {
      //console.log("Inside getAllProfiles");
      await fetch(`${env.URL}/users/AllprofilesMob?userId=${"e6bb856a-9d91-40a7-8b2e-ca095b7389b8"}`,
        { method: 'GET', headers: { 'Content-Type': 'application/json', 'authorization': await authTokenHeader() } }).then(async ret => {
          let res = JSON.parse(await ret.text());
          //console.log(res);
          if (res.Error) {
            console.warn("Error: ", res.Error);
          }
          else {
            setAllProfiles(res);
            setFetchedProfiles(true);
          }
        });
    }
    catch (e) {
      //console.log(e);
      return;
    }
  };

  const containerStyle = () => {
    let style = [];
    if (!(isFetchedProfiles && allProfiles.length)) {
      style.push({
        height: '100%',
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
      });
    }
    return style;
  }

  const styles = StyleSheet.create({
    profilesContainer: {
      paddingHorizontal: 10,
      height: '100%'
    },
    msgText: {
      margin: 'auto',
      color: Color(isDarkMode).text,
      paddingBottom: 10,
      fontWeight: "bold",
    },
    noResults: {
      alignItems: 'center'
    }
  });

  return (
    <ScrollView
    style={styles.profilesContainer}
    contentContainerStyle={containerStyle()}
    >
      {isFetchedProfiles &&
        (allProfiles.length ?
          allProfiles.map((profile: any, index) =>
            profile.image && <ProfileCard key={index} isDarkMode={isDarkMode} profileInfo={profile} />)
          :
          <View
          style={styles.noResults}
          >
            <_Text 
            style={styles.msgText}
            >
              No profiles match the applied filters
            </_Text>
            <_Button
              style={Style(isDarkMode).buttonInverted}
              textStyle={Style(isDarkMode).buttonInvertedText}
              onPress={(e: any) => navigation.navigate(NavTo.Search)}
              isDarkMode={isDarkMode}
              >
                  Clear Filters
            </_Button>
          </View>
        )
      }
    </ScrollView>
  );
}

export default Profile;