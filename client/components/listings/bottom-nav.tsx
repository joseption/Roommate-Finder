import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faSearch, faStar, faHome } from '@fortawesome/free-solid-svg-icons';
import SearchListingScreen from '../../screens/listings';
import FavoriteListingScreen from '../../screens/favorite-listings';
import MyListingScreen from '../../screens/my-listings';

const BottomNavbar = (props: any, {navigation}:any) => {

  const navigateToSearch = () => {
    navigation.navigate(SearchListingScreen)
  };

  const navigateToStar = () => {
    navigation.navigate(FavoriteListingScreen)
  };

  const navigateToHome = () => {
    navigation.navigate(MyListingScreen)
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={navigateToSearch} style={styles.button}>
        <FontAwesomeIcon icon={faSearch} size={24} color="black" />
      </TouchableOpacity>
      <TouchableOpacity onPress={navigateToStar} style={styles.button}>
        <FontAwesomeIcon icon={faStar} size={24} color="black" />
      </TouchableOpacity>
      <TouchableOpacity onPress={navigateToHome} style={styles.button}>
        <FontAwesomeIcon icon={faHome} size={24} color="black" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: '#fff',
  },
  button: {
    alignItems: 'center',
    backgroundColor: '#ddd',
    padding: 12,
    borderRadius: 24,
    width: '30%',
  },
});

export default BottomNavbar;
