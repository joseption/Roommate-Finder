import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import AllListingsView from '../components/listings/all-listings';
import { env } from '../helper';
import BottomNavbar from '../components/listings/bottom-nav';
import Dropdown from '../components/listings/drop-down';
import FavoriteListings from '../components/listings/favorite-listings';
import CreateListing from '../components/listings/create-listing';

const ListingsScreen = ({ navigation }: any) => {
  const [isListing, setIsListing] = useState(false);
  const [listingID, setListingID] = useState('');
  const [listingData, setListingData] = useState({});
  const [allListings, setAllListings] = useState([]);
  const [init, setInit] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [currentScreen, setCurrentScreen] = useState('Listings');
  const [searchPressed, setSearchPressed] = useState(false);

  useEffect(() => {
    if (!init) {
      getAllListings();
      setInit(true);
    }
  }, [init]);

  const getAllListings = async () => {
    try {
      await fetch(`${env.URL}/listings/all`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      })
        .then(async (ret) => {
          let res = JSON.parse(await ret.text());
          setAllListings(res);
        });
    } catch (e) {
      return;
    }
  };

  const handleNavigation = (screen: string) => {
    setCurrentScreen(screen);
    if (screen === 'Listings') {
      setSelectedFilter('all');
      setSearchPressed(false);
    }
  };

  return (
    <View>
      {currentScreen === 'Listings' && selectedFilter === 'all' && !searchPressed && (
        <AllListingsView
          allListings={allListings}
          setListingID={setListingID}
          setIsListing={setIsListing}
          selectedFilter={selectedFilter}
        />
      )}
      {currentScreen === 'Favorites' && <FavoriteListings />}
      {currentScreen === 'Create' && <CreateListing />}
      <BottomNavbar
        handleNavigation={handleNavigation}
        disabled={currentScreen !== 'Listings' || selectedFilter !== 'all'}
        setSearchPressed={setSearchPressed}
      />
    </View>
  );
};

export default ListingsScreen;

