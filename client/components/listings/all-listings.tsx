import React, { useEffect, useState } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import ListingCard from './listing-card';

const AllListingsView = (props: any) => {
  const [allListings, setAllListings] = useState([]);

  useEffect(() => {
    generateListings();
  }, [props.allListings, props.selectedFilter]);

  const generateListings = () => {
    let listings = [];
    if (props.allListings) {
      listings = props.allListings
        .filter((item: any) => {
          if (props.selectedFilter === 'all') return true;
          return item.category === props.selectedFilter;
        })
        .map((item: any, key: any) => {
          return (
            <ListingCard
              setListingID={props.setListingID}
              setIsListing={props.setIsListing}
              key={key}
              item={item}
            />
          );
        });
    }

    setAllListings(listings);
  };

  return (
    <ScrollView style={styles.container}>
      {allListings}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#fff',
  },
});

export default AllListingsView;
