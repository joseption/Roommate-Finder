import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import AllListingsView from '../components/listings/all-listings';
import { authTokenHeader, env, Listings_Screen } from '../helper';
import BottomNavbar from '../components/listings/bottom-nav';
import FavoriteListings from '../components/listings/favorite-listings';
import CreateListing from '../components/listings/create-listing';
import { useLinkProps } from '@react-navigation/native';
import _Dropdown from '../components/control/dropdown';
import ListingView from '../components/listings/listing';
import _Text from '../components/control/text';
import { Color } from '../style';

const ListingsScreen = (props: any) => {
  const [isListing, setIsListing] = useState(false);
  const [listingID, setListingID] = useState('');
  const [distance, setDistance] = useState('');
  const [allListings, setAllListings] = useState([]);
  const [init, setInit] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [currentScreen, setCurrentScreen] = useState(Listings_Screen.all);
  const [searchPressed, setSearchPressed] = useState(false);
  const [isListingViewVisible, setIsListingViewVisible] = useState(false);
  const [currentListing, setCurrentListing] = useState(null);

  useEffect(() => {
    if (!init) {
      getAllListings();
      setInit(true);
    }
  }, [currentScreen]);

  const getAllListings = async () => {
    try {
      await fetch(`${env.URL}/listings/all`, {
        method: 'GET',
        headers: { 
          'Content-Type': 'application/json', 
          'authorization': await authTokenHeader(),
      },
      })
        .then(async (ret) => {
          let res = JSON.parse(await ret.text());
          //console.log(res);
          setAllListings(res);
        });
    } catch (e) {
      return;
    }
  };

  const handleNavigation = (screen: Listings_Screen) => {
    setCurrentScreen(screen);
    if (screen === Listings_Screen.all) {
      setSelectedFilter('all');
      setSearchPressed(false);
    }
  };

  const getDistanceOptions = () => {
    return [
      { key: 1, value: 'Less than 1 mile' },
      { key: 2, value: 'Between 1 and 10 miles' },
      { key: 3, value: 'More than 10 miles' },
    ];
  };

  const bottomBarNav = () => {
    return <BottomNavbar
    isDarkMode={props.isDarkMode}
    setCurrentScreen={setCurrentScreen}
    handleNavigation={handleNavigation}
    disabled={currentScreen !== Listings_Screen.all || selectedFilter !== 'all'}
    setSearchPressed={setSearchPressed}
    currentScreen={currentScreen}
  />
  }

  const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
  },
  content: {
    flex: 1,
  },
  dropdownContainer: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    padding: 10,
    backgroundColor: 'white',
  },
  title: {
    fontSize: 20,
    marginBottom: 16,
    textAlign: 'center',
    color: Color(props.isDarkMode).black,
  },
  contentContainer: {
    height: '100%'
  },
  distanceContainer: {
    padding: 10,
  }
});

  return (
    <View style={styles.container}>
      {!currentListing ? (
        <View style={styles.content}>
          {currentScreen === Listings_Screen.all ? (
            <View
            style={styles.contentContainer}
            >
              <_Dropdown
                isDarkMode={props.isDarkMode}
                options={getDistanceOptions()}
                placeholder="Select a distance from UCF..."
                value={distance}
                setValue={setDistance}
                containerStyle={styles.distanceContainer}
              />
              <AllListingsView
                isDarkMode={props.isDarkMode}
                setCurrentListing={setCurrentListing}
                allListings={allListings}
                setListingID={setListingID}
                setIsListing={setIsListing}
                selectedFilter={selectedFilter}
              />
              {bottomBarNav()}
            </View>
          ) : currentScreen === Listings_Screen.favorites ? (
            <View
            style={styles.contentContainer}
            >
              <FavoriteListings 
                allListings={allListings} 
                isDarkMode={props.isDarkMode} 
                />
                {bottomBarNav()}
              </View>
          ) : (
            <View
            style={styles.contentContainer}
            >
              <CreateListing 
                isDarkMode={props.isDarkMode} 
                onClose={() => handleNavigation(Listings_Screen.all)}
              />
              {bottomBarNav()}
            </View>
          )}
        </View>
      ) : (
        <ListingView
          isDarkMode={props.isDarkMode}
          setCurrentListing={setCurrentListing}
          currentListing={currentListing}
        />
      )}
    </View>
  );
  
  
  };
  
  export default ListingsScreen;

