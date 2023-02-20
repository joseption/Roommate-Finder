import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import ProfileCard from './profile-card';
import { env, authTokenHeader } from '../../helper';

interface Props {
  filters?: string[],
  filtersFetched?: boolean,
  genderFilter?: string,
  locationFilter?: string,
  sharingPrefFilter?: string
  sorting?: boolean
}

const Profile = ({ filters, filtersFetched, genderFilter, locationFilter, sharingPrefFilter, sorting }: Props) => {
  /*
  Daniyal: This component will contain all of the profile card components
  and anything else that is needed for the overall profile view.F
  Add this component to the search screen.
  */

  const [allProfiles, setAllProfiles] = useState([]);
  const [isFetchedProfiles, setFetchedProfiles] = useState(false);

  useEffect(() => {
    if (filtersFetched) {
      console.log(filters);
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
      console.log("Inside getFilteredProfiles");
      if (filtersFetched && filters?.length !== 0) {
        queryString = filters?.join(',');
      }
      await fetch(`${env.URL}/users/profilesByTags?userId=${"e6bb856a-9d91-40a7-8b2e-ca095b7389b8"}&filters=${queryString}&gender=${genderFilter}&location=${locationFilter}&sharingPref=${sharingPrefFilter}`,
        { method: 'GET', headers: { 'Content-Type': 'application/json', 'authorization': await authTokenHeader() } }).then(async ret => {
          let res = JSON.parse(await ret.text());
          console.log(res);
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
      console.log(e);
      return;
    }
  };

  const getAllProfiles = async () => {
    setFetchedProfiles(false);
    try {
      console.log("Inside getAllProfiles");
      await fetch(`${env.URL}/users/AllprofilesMob?userId=${"e6bb856a-9d91-40a7-8b2e-ca095b7389b8"}`,
        { method: 'GET', headers: { 'Content-Type': 'application/json', 'authorization': await authTokenHeader() } }).then(async ret => {
          let res = JSON.parse(await ret.text());
          console.log(res);
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
      console.log(e);
      return;
    }
  };

  return (
    <View style={styles.profilesContainer}>
      {isFetchedProfiles &&
        (allProfiles.length ?
          allProfiles.map((profile: any, index) =>
            profile.image && <ProfileCard key={index} profileInfo={profile} />)
          :
          <Text style={styles.msgText}>No profiles match the applied filters</Text>
        )
      }
    </View>
  );
}

export default Profile;


const styles = StyleSheet.create({
  profilesContainer: {
    marginTop: 30
  },
  msgText: {
    margin: 'auto',
    backgroundColor: 'red',
    color: 'white',
    padding: 30,
    paddingBottom: 10,
    paddingTop: 10,
    borderRadius: 10,
    fontWeight: "500",
    marginTop: 30
  }
});