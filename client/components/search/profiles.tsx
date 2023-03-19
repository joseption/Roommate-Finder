import React, { useState, useEffect } from 'react';
import { ActivityIndicator, Platform, RefreshControl, ScrollView, StyleSheet, Text, View } from 'react-native';
import ProfileCard from './profile-card';
import { env, authTokenHeader, navProp, NavTo, userId } from '../../helper';
import { Color, Style } from '../../style';
import _Text from '../control/text';
import { useNavigation } from '@react-navigation/native';
import _Button from '../control/button';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';

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
  search: string,
  setSearch: any,
}

const Profile = ({ setSearch, search, setSorting, forceGetProfiles, setForceGetProfiles, noResults, filters, filtersFetched, genderFilter, locationFilter, sharingPrefFilter, sorting, isDarkMode, setNoResults }: Props) => {
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
  const [hasVisibleProfiles, setHasVisibleProfiles] = useState(false);  
  const [availableProfiles, setAvailableProfiles] = useState<JSX.Element[]>([]);

  const refreshMe = () => {
    setRefreshing(true);
    getProfiles();
    setRefreshing(false);
  };

  useEffect(() => {
    removeUnwantedResults(allProfiles, search);
  }, [search]);

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
    try {
      let obj = {filters: filters, gender: genderFilter, location: locationFilter, sharingPref: sharingPrefFilter};
      let js = JSON.stringify(obj);
      await fetch(`${env.URL}/users/profilesByTags`,
        { method: 'POST', body:js, headers: { 'Content-Type': 'application/json', 'authorization': await authTokenHeader() } }).then(async ret => {
          let res = JSON.parse(await ret.text());
          if (res.Error) {
            console.warn("Error: ", res.Error);
          }
          else {
            if (sorting) {
              res = sortProfiles(res);
            }
            await removeUnwantedResults(res, search);
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
      await fetch(`${env.URL}/users/AllprofilesMob`,
        { method: 'POST', headers: { 'Content-Type': 'application/json', 'authorization': await authTokenHeader() } }).then(async ret => {
          let res = JSON.parse(await ret.text());
          if (res.Error) {
            console.warn("Error: ", res.Error);
          }
          else {
            if (sorting) {
              res = sortProfiles(res);
            }
            await removeUnwantedResults(res, search);
            setFetchedProfiles(true);
          }
        });
    }
    catch (e) {
    }
  };

  const removeUnwantedResults = async (data: any, find: string) => {
    let count = 0;
    if (data && data.length) {
      let id = await userId();
      if (!find)
        find = '';

      data.forEach((x: any) => {
        let info = x.first_name + ' ' + x.last_name + ' ' + x.city + ' ' + x.state + ' ' + x.zip_code;
        if (!info)
          info = '';

        if (x.is_setup && x.id !== id && (info.toLowerCase().trim().includes(find.toLowerCase().trim()))) {
          x.is_visible = true;
          count++;
        }
        else
          x.is_visible = false;
      });
    }

    setHasVisibleProfiles(count > 0);
    setAllProfiles(data);
    let filtered = getAvailableProfiles(data);
    setAvailableProfiles(filtered);
  }

  const containerStyle = () => {
    let style = [];
    if (!(isFetchedProfiles && hasVisibleProfiles) || isPageLoading) {
      style.push({
        height: '100%',
        flex: 1,
        justifyContent: 'center',
      });
    }
    style.push({paddingHorizontal: 10});

    return style;
  }

  const getAvailableProfiles = (data: any) => {
    if (data.length > 0) {
      return data.map((profile: any, key: number) => {
        if (profile.is_visible === true)
          return <ProfileCard key={key} isDarkMode={isDarkMode} profileInfo={profile} />
        else
          return null;
        }
      );
    }
    else
      return <></>
  }

  const styles = StyleSheet.create({
    profilesContainer: {
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
    },
    mainIcon: {
      ...Platform.select({
        web: {
          outlineStyle: 'none'
        }
      }),
    },
    mainIconContainer: {
      marginBottom: 20,
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
      {isFetchedProfiles && hasVisibleProfiles ?
          <>
          {availableProfiles}
          </>
          :
          <View
          style={styles.noResults}
          >
            <View
            style={styles.mainIconContainer}
            >
              <FontAwesomeIcon 
              size={100} 
              color={Color(isDarkMode).gold} 
              style={styles.mainIcon} 
              icon="user"
              >
              </FontAwesomeIcon>
            </View>
            <_Text 
            style={styles.msgText}
            >
              No profiles match the applied filters
            </_Text>
            <_Button
              style={Style(isDarkMode).buttonInverted}
              textStyle={Style(isDarkMode).buttonInvertedText}
              onPress={(e: any) => {
                setSearch('');
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