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
  setNoResults: any,
  genderFilter?: string,
  locationFilter?: string,
  sharingPrefFilter?: string
  sorting?: boolean}

const Profile = ({ filters, filtersFetched, genderFilter, locationFilter, sharingPrefFilter, sorting, isDarkMode, setNoResults }: Props) => {
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
      console.log(genderFilter);
      console.log(locationFilter);
      console.log(sharingPrefFilter);
      getFilteredProfiles();
    }
    else {
      getAllProfiles();
    }
  }, [filters, filtersFetched, genderFilter, locationFilter, sharingPrefFilter, sorting]);

  const getFilteredProfiles = async () => {
    setFetchedProfiles(false);
    let queryString = undefined;
    try {
      //console.log("Inside getFilteredProfiles");
      if (filtersFetched && filters?.length !== 0) {
        queryString = filters?.join(',');
      }
      await fetch(`${env.URL}/users/profilesByTags?userId=${"e6bb856a-9d91-40a7-8b2e-ca095b7389b8"}&filters=${queryString}&gender=${genderFilter}&location=${locationFilter}&sharingPref=${sharingPrefFilter}`,
        { method: 'GET', headers: { 'Content-Type': 'application/json', 'authorization': await authTokenHeader() } }).then(async ret => {
          let res = JSON.parse(await ret.text());
          //console.log(res);
          if (res.Error) {
            console.warn("Error: ", res.Error);
          }
          else {
            if (sorting) {
              res.sort((a: any, b: any) => {
                // If both profiles have matchPercentage, sort based on matchPercentage
                if (a.matchPercentage !== undefined && b.matchPercentage !== undefined) {
                  return b.matchPercentage - a.matchPercentage;
                }

                // If only one of the two profiles has matchPercentage, put it first
                if (a.matchPercentage !== undefined) {
                  return -1;
                }
                if (b.matchPercentage !== undefined) {
                  return 1;
                }

                // If neither of the two profiles have matchPercentage, keep their relative order unchanged
                return 0;
              });
              console.log("Sorted Profiles: ");
              console.log(res);
            }
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
    setFetchedProfiles(false);
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
            if (sorting) {
              res.sort((a: any, b: any) => {
                // If both profiles have matchPercentage, sort based on matchPercentage
                if (a.matchPercentage !== undefined && b.matchPercentage !== undefined) {
                  return b.matchPercentage - a.matchPercentage;
                }

                // If only one of the two profiles has matchPercentage, put it first
                if (a.matchPercentage !== undefined) {
                  return -1;
                }
                if (b.matchPercentage !== undefined) {
                  return 1;
                }

                // If neither of the two profiles have matchPercentage, keep their relative order unchanged
                return 0;
              });
              console.log("Sorted Profiles: ");
              console.log(res);
            }
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