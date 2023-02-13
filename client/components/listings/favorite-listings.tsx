import React, { useEffect, useState } from 'react';
import { Platform, ScrollView, StyleSheet } from 'react-native';
import { Color } from '../../style';
import ListingCard from './listing-card';

const FavoriteListings = (props: any) => {
  const [favoriteListings, setFavoriteListings] = useState<JSX.Element[]>([]);

  useEffect(() => {
    generateFavoriteListings();
  }, [props.allListings]);

  const generateFavoriteListings = () => {
    const filteredListings = props.allListings
      ?.filter((item: any) => item.isFavorited || item.isCreated)
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
      ...Platform.select({
        web:{
          paddingLeft: 3,
        }
      }),
      backgroundColor: Color(props.isDarkMode).contentBackgroundSecondary,
    },
  });

  return (
    <ScrollView style={styles.container}>
      {favoriteListings}
    </ScrollView>
  );
};

export default FavoriteListings;
