import React, { useEffect, useState } from 'react';
import { Platform, RefreshControl, ScrollView, StyleSheet, View } from 'react-native';
import { Color, FontSize } from '../../style';
import _Text from '../control/text';
import ListingCard from './listing-card';

const FavoriteListings = (props: any) => {
  const [favoriteListings, setFavoriteListings] = useState<JSX.Element[]>([]);
  const [refreshing, setRefreshing] = useState(false);  

  const refresh = () => {
    setRefreshing(true);
    props.refresh();
    setRefreshing(false);
  };

  useEffect(() => {
    generateFavoriteListings();
  }, [props.allListings]);

  const generateFavoriteListings = () => {
    const favoriteListings = props.allListings
      .filter((item: any) => item.userId === props.userId)
      .map((item: any, key: any) => (
        <ListingCard
          isDarkMode={props.isDarkMode}
          setCurrentListing={props.setCurrentListing}
          userId={props.userId}
          userImage={props.userImage}
          listingUserId={item.userId}
          key={key}
          item={item}
        />
      ));
  
    setFavoriteListings(favoriteListings);
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
        <_Text style={styles.title}>Favorite Listings</_Text>
        <ScrollView
        style={styles.container}
        refreshControl={
          <RefreshControl
          refreshing={refreshing}
          onRefresh={refresh}
          colors={[Color(props.isDarkMode).gold]}
          progressBackgroundColor={Color(props.isDarkMode).contentHolder}
          />
        }
        >
        {favoriteListings}
        </ScrollView>
      </>
    
    
  );
};

export default FavoriteListings;
