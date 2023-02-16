import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import ProfileCard from './profile-card';
import { env, authTokenHeader } from '../../helper';

interface Props {
  filters?: string[],
  filtersFetched?: boolean
}

const Profile = ({ filters, filtersFetched }: Props) => {
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
      getFilteredProfiles();
    }
    else {
      getAllProfiles();
    }
  }, [filters, filtersFetched]);

  const getFilteredProfiles = async () => {
    let queryString;
    try {
      console.log("Inside getFilteredProfiles");
      if (filtersFetched) {
        queryString = filters?.join(',');
      }
      await fetch(`${env.URL}/users/profilesByTags?userId=${"e6bb856a-9d91-40a7-8b2e-ca095b7389b8"}&filters=${queryString}`,
        { method: 'GET', headers: { 'Content-Type': 'application/json', 'authorization': await authTokenHeader() } }).then(async ret => {
          let res = JSON.parse(await ret.text());
          console.log(res);
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
      console.log(e);
      return;
    }
  };

  const getAllProfiles = async () => {
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