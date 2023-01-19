import { useEffect, useState } from 'react';
import { View, _Text } from 'react-native';
import _Button from '../components/control/button';
import _TextInput from '../components/control/text-input';
import AllListingsView from '../components/listings/all-listings';
import ListingView from '../components/listings/listing';
import { env } from '../helper';

const ListingsScreen = (props: any, {navigation}:any) => {
    /*
    Erick: Add all content for the single page view here,
    If you need to make reusable components, create a folder
    in the components folder named "listings" and add your component files there
    */
    const [isListing,setIsListing] = useState(false);
    const [listingID,setListingID] = useState('');
    const [listingData, setListingData] = useState({});
    const [allListings, setAllListings] = useState([]);
    const [init,setInit] = useState(false);

    // anytime page is rendered it will run this
    useEffect(() => {
        if(!init)
        {
           getAllListings();
           setInit(true); 
        }
        else
        //get rid later
            getListing();
        
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

    // function getListing, calls the database to get a singular listing
    const getListing = () => {
        let listing = {data:"Hello"};
        setListingData(listing.data);
    } 

    // need to change, builds the cards and returns all cards in listingView
    const getListings = () => {
        return {data:"Hello"};
    } 

    return (
    <View>  
        { /* If isListing is false it will show all listings else it will show a single listing */}
        {!isListing?
     <AllListingsView allListings={allListings} setListingID={setListingID} setIsListing={setIsListing}></AllListingsView>
     :   
     <ListingView listingData={listingData} setIsListing={setIsListing}></ListingView>
        }
     </View>
    );
};

export default ListingsScreen;