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
import Dropdown from '../components/listings/drop-down';

const ListingsScreen = (props: any, {navigation}:any) => {

    // used for tracking, first parameter is for current state
    // second value is function used to update state
    // inside useState is the initial state, what it defaults to
    const [isListing,setIsListing] = useState(false);
    const [listingID,setListingID] = useState('');
    const [listingData, setListingData] = useState({});
    const [allListings, setAllListings] = useState([]);
    const [init,setInit] = useState(false);
    const [searchText, setSearchText] = useState("");
    const [selectedFilter, setSelectedFilter] = useState('all');

    // anytime page is rendered it will run this. 
    // allows you to perform side effects in your components.
    // fetching data, directly updating the DOM, and timers.
    useEffect(() => {
        if(!init)
        {
           getAllListings();
           setInit(true); 
        }
  
        
    },[listingID]);

    const getAllListings = async () => 
    {
        try
        {
            await fetch(`${env.URL}/listings/all`,
          {method:'GET',headers:{'Content-Type': 'application/json'}}).then(async ret => {
                let res = JSON.parse(await ret.text());
                setAllListings(res);
            });
        }
        catch(e)
        {
            return;
        }
    };

    // need to change, builds the cards and returns all cards in listingView
    const getListings = () => {
        return {data:"Hello"};
    } 

    const updateListings = () => {
        props.setListingID('myID');
        props.setIsListing(true);
       }

    return (
    <View>  
        { /* If isListing is false it will show all listings else it will show a single listing */}
        {/*<SearchBar searchText={searchText} setSearchText={setSearchText}/>
        <Text>{searchText}</Text>  */}
        <Dropdown setSelectedFilter={setSelectedFilter} /> {/* pass the setSelectedFilter function to the dropdown component */}
      <AllListingsView allListings={allListings} setListingID={setListingID} setIsListing={setIsListing} selectedFilter={selectedFilter} /> {/* pass the selectedFilter value to AllListingsView component */}
               
        {/*!isListing?
     <AllListingsView allListings={allListings} setListingID={setListingID} setIsListing={setIsListing}></AllListingsView>
     :   
     <ListingView listingData={listingData} setIsListing={setIsListing}></ListingView>
    */}
        <BottomNavbar></BottomNavbar>
     </View>
    );

};

export default ListingsScreen;