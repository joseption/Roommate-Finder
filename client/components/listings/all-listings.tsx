import { useEffect, useState } from 'react';
import { View  } from 'react-native';
import _Button from '../control/button';
import _Text from '../control/text';
import _TextInput from '../control/text-input';
import ListingCard from './listing-card';

const AllListingsView = (props: any, {navigation}:any) => {
    
    // refreshes when something on page rerenders 
    const [allListings, setAllListings] = useState([]);

    useEffect(() => {
        generateListings();
    },[props.allListings]);

    const generateListings = () => {
        let listings = [];
        if(props.allListings)
        {
            listings = props.allListings.map((item: any, key: any) => {
                return <ListingCard
                setIsListing={props.setIsListing} 
                setListingID={props.setListingID}
                key={key}
                item={item} />
            }); 
        }
        
        setAllListings(listings);
    } 
    
   // anything for searching for a specific listing will be here
    return (
    <View>
        <_Text>
            AllListingsView
        </_Text> 
        {allListings}
    </View>
    );
};

export default AllListingsView;