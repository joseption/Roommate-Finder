import React, { useState, useEffect } from 'react';
import { ActivityIndicator, RefreshControl, ScrollView, StyleSheet, Text, View } from 'react-native';
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
  sorting?: boolean
  noResults: boolean,
  forceGetProfiles: boolean,
  setForceGetProfiles: any,
  setSorting: any,
}

const Profile = ({ setSorting, forceGetProfiles, setForceGetProfiles, noResults, filters, filtersFetched, genderFilter, locationFilter, sharingPrefFilter, sorting, isDarkMode, setNoResults }: Props) => {
  /*
  Daniyal: This component will contain all of the profile card components
  and anything else that is needed for the overall profile view.F
  Add this component to the search screen.
  */

  const navigation = useNavigation<navProp>();
  const [allProfiles, setAllProfiles] = useState([]);
  const [isFetchedProfiles, setFetchedProfiles] = useState(false);
  const [isPageLoading, setIsPageLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);  

  const refreshMe = () => {
    setRefreshing(true);
    getProfiles();
    setRefreshing(false);
  };

  useEffect(() => {
    if (forceGetProfiles) {
      if (allProfiles.length > 0) {
        setAllProfiles(sortProfiles(allProfiles));
        setForceGetProfiles(false);
      }
      setSorting(true);
    }
  }, [forceGetProfiles, allProfiles]);

  useEffect(() => {
    if (!forceGetProfiles) {
      getProfiles();
    }
  }, [filters, filtersFetched, genderFilter, locationFilter, sharingPrefFilter, sorting]);

  const getProfiles = async () => {
    setIsPageLoading(true);
    if (filtersFetched) {
      await getFilteredProfiles();
    }
    else {
      await getAllProfiles();
    }
    setIsPageLoading(false);
  }

  const sortProfiles = (data: any) => {
    if (data) {
      data.sort((a: any, b: any) => {
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
    }
    return data;
  }

  const getFilteredProfiles = async () => {
    setFetchedProfiles(false);
    let queryString = undefined;
    try {
      if (filtersFetched && filters?.length !== 0) {
        queryString = filters?.join(',');
      }
      await fetch(`${env.URL}/users/profilesByTags?userId=${"e6bb856a-9d91-40a7-8b2e-ca095b7389b8"}&filters=${queryString}&gender=${genderFilter}&location=${locationFilter}&sharingPref=${sharingPrefFilter}`,
        { method: 'GET', headers: { 'Content-Type': 'application/json', 'authorization': await authTokenHeader() } }).then(async ret => {
          let res = JSON.parse(await ret.text());
          if (res.Error) {
            console.warn("Error: ", res.Error);
          }
          else {
            if (sorting) {
              res = sortProfiles(res);
            }
            setAllProfiles(res);
            setFetchedProfiles(true);
          }
        });
    }
    catch (e) {
      return;
    }
  };

  const getAllProfiles = async () => {
    setFetchedProfiles(false);
    try {
      await fetch(`${env.URL}/users/AllprofilesMob?userId=${"e6bb856a-9d91-40a7-8b2e-ca095b7389b8"}`,
        { method: 'GET', headers: { 'Content-Type': 'application/json', 'authorization': await authTokenHeader() } }).then(async ret => {
          let res = JSON.parse(await ret.text());
          if (res.Error) {
            console.warn("Error: ", res.Error);
          }
          else {
            if (sorting) {
              res = sortProfiles(res);
            }
            setAllProfiles(res);
            if (res.length > 0) {
              setFetchedProfiles(true);
            }
          }
        });
    }
    catch (e) {
      return;
    }
  };

  const containerStyle = () => {
    let style = [];
    if (!(isFetchedProfiles && allProfiles.length) || isPageLoading) {
      style.push({
        height: '100%',
        flex: 1,
        justifyContent: 'center',
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
    },
    loadingScreen: {
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      flex: 1,
      height: '100%',
    },
    loading: {
      flex: 1,
      height: '100%',
      justifyContent: 'center',
      alignItems: 'center',
      flexDirection: 'column'
    }
  });

  return (
    <ScrollView
    style={styles.profilesContainer}
    contentContainerStyle={containerStyle()}
    refreshControl={
      <RefreshControl
      refreshing={refreshing}
      onRefresh={refreshMe}
      colors={[Color(isDarkMode).gold]}
      progressBackgroundColor={Color(isDarkMode).contentHolder}
      />
    }
    >
      {!isPageLoading ? 
      <View>
      {isFetchedProfiles &&
        (allProfiles.length ?
          allProfiles.map((profile: any, index) =>
            <ProfileCard key={index} isDarkMode={isDarkMode} profileInfo={profile} />)
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
              onPress={(e: any) => {
                setAllProfiles([]);
                setNoResults(true);
                setFetchedProfiles(false);
                getAllProfiles();
                navigation.navigate(NavTo.Search);
              }}
              isDarkMode={isDarkMode}
              >
                Clear Filters
            </_Button>
          </View>
        )
      }
      </View>
      :
      <View
      style={styles.loadingScreen}
      >
      <ActivityIndicator
      size="large"
      color={Color(isDarkMode).gold}
      style={styles.loading}
      />
      </View>
      }
    </ScrollView>
  );
}

export default Profile;