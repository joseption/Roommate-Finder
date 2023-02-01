import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import FavoriteListings from '../listings/favorite-listings';
import CreateListing from '../listings/create-listing';
import ListingsScreen from '../../screens/listings';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faSearch, faStar, faPlusCircle } from '@fortawesome/free-solid-svg-icons';

const BottomNavbar = (props: any) => {
  const [selectedScreen, setSelectedScreen] = React.useState('search');
  const [isListingScreenOpen, setIsListingScreenOpen] = React.useState(false);

  const memoizedListingsScreen = React.useMemo(() => 
    selectedScreen === 'search' && isListingScreenOpen && <ListingsScreen onPress={() => setIsListingScreenOpen(false)} />,
    [selectedScreen, isListingScreenOpen]
  );

  return (
    <View style={styles.container}>
      {memoizedListingsScreen}
      {selectedScreen === 'star' && <FavoriteListings />}
      {selectedScreen === 'home' && <CreateListing />}
      <TouchableOpacity onPress={() => {
        setSelectedScreen('search');
        setIsListingScreenOpen(!isListingScreenOpen);
      }} style={styles.button}>
        <FontAwesomeIcon icon={faSearch} size={24} color={selectedScreen === 'search' ? 'gold' : 'black'} />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => setSelectedScreen('star')} style={styles.button}>
        <FontAwesomeIcon icon={faStar} size={24} color={selectedScreen === 'star' ? 'gold' : 'black'} />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => setSelectedScreen('home')} style={styles.button}>
        <FontAwesomeIcon icon={faPlusCircle} size={24} color={selectedScreen === 'home' ? 'gold' : 'black'} />
      </TouchableOpacity>
    </View>
  );
};




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

export default BottomNavbar;
