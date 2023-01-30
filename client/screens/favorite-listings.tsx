import { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import _Button from '../components/control/button';
import _TextInput from '../components/control/text-input';
import AllListingsView from '../components/listings/all-listings';
import ListingView from '../components/listings/listing';
import SearchBar from '../components/listings/search-bar';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { env } from '../helper';
import BottomNavbar from '../components/listings/bottom-nav';

const FavoriteListingsScreen = (props: any, {navigation}:any) => {
    /*
    Erick: Add all content for the single page view here,
    If you need to make reusable components, create a folder
    in the components folder named "listings" and add your component files there
    */
   
    return (
        <View>  
            
         </View>
        );
};

export default FavoriteListingsScreen;