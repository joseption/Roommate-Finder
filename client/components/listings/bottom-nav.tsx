import React, { useEffect } from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import FavoriteListings from '../listings/favorite-listings';
import CreateListing from '../listings/create-listing';
import ListingsScreen, { Listings_Screen } from '../../screens/listings';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faSearch, faStar, faPlusCircle } from '@fortawesome/free-solid-svg-icons';

const BottomNavbar = (props: any) => {
  const [isListingScreenOpen, setIsListingScreenOpen] = React.useState(false);

  useEffect(() => {
  }, [props.currentScreen]);

  const onSearch = () => {
    props.setCurrentScreen(Listings_Screen.all)
    setIsListingScreenOpen(!isListingScreenOpen);
  }

  const onFavorite = () => {
    props.setCurrentScreen(Listings_Screen.favorites)
    setIsListingScreenOpen(!isListingScreenOpen)
  }

  const onCreate = () => {
    props.setCurrentScreen(Listings_Screen.create)
    setIsListingScreenOpen(!isListingScreenOpen)
  }

  const styles = StyleSheet.create({
    container: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      padding: 8,
      backgroundColor: '#fff',
      borderTopWidth: 1,
      borderTopColor: '#ddd',
      borderTopStyle: 'solid',
    },
    button: {
      alignItems: 'center',
      backgroundColor: '#fff',
      padding: 12,
      borderRadius: 24,
      width: '30%',
    },
  });

  return (
    <View style={styles.container}>
      
      <TouchableOpacity 
        onPress={() => {
        onSearch()
      }} style={styles.button}>
        <FontAwesomeIcon icon={faSearch} size={24} color={props.currentScreen === Listings_Screen.all ? 'gold' : 'black'} />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => onFavorite()} style={styles.button}>
        <FontAwesomeIcon icon={faStar} size={24} color={props.currentScreen === Listings_Screen.favorites ? 'gold' : 'black'} />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => onCreate()} style={styles.button}>
        <FontAwesomeIcon icon={faPlusCircle} size={24} color={props.currentScreen === Listings_Screen.create ? 'gold' : 'black'} />
      </TouchableOpacity>
    </View>
  );
};

export default BottomNavbar;
