import React, { useEffect, useState } from 'react';
import { Platform, ScrollView, StyleSheet, View } from 'react-native';
import { Color, FontSize } from '../../style';
import _Text from '../control/text';
import ListingCard from './listing-card';

const FavoriteListings = (props: any) => {
  const [favoriteListings, setFavoriteListings] = useState<JSX.Element[]>([]);

  useEffect(() => {
    generateFavoriteListings();
  }, [props.allListings, props.selectedFilter]);

  const generateFavoriteListings = () => {
    const filteredListings = props.allListings
      ?.filter((item: any) => (
        props.selectedFilter === 'all' ? true : item.category === props.selectedFilter
      ))
      .filter((item: any) => item.userId === props.userId)
      .map((item: any, key: any) => (
        <ListingCard
          isDarkMode={props.isDarkMode}
          setCurrentListing={props.setCurrentListing}
          setListingID={props.setListingID}
          setIsListing={props.setIsListing}
          key={key}
          item={item}
        />
      ));
  
    setFavoriteListings(filteredListings);
  };

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
      margin: 10,
      textAlign: 'center',
      fontWeight: 'bold',
      fontSize: FontSize.large,
      color: Color(props.isDarkMode).titleText
    },
    contentContainer: {
      height: '100%'
    },
    distanceContainer: {
      padding: 10,
    }
});

  return (
    
      <>
        <_Text style={styles.title}>My Listings</_Text>
        <ScrollView style={styles.container}>
        {favoriteListings}
        </ScrollView>
      </>
    
    
  );
};

export default FavoriteListings;
