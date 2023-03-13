import React, { useEffect, useState } from 'react';
import { Platform, RefreshControl, ScrollView, StyleSheet, View } from 'react-native';
import { Color, FontSize } from '../../style';
import ListingCard from './listing-card';

const AllListingsView = (props: any) => {
  const [allListings, setAllListings] = useState<JSX.Element[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    generateListings();
  }, [props.allListings, props.selectedFilter]);

  const generateListings = () => {
    const filteredListings = props.allListings
      ?.filter((item: any) => (props.selectedFilter === 'all' ? true : item.category === props.selectedFilter))
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

    setAllListings(filteredListings);
  };

  const refresh = () => {
    setRefreshing(true);
    props.refresh();
    setRefreshing(false);
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
      fontFamily: 'Inter-SemiBold',
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
      {allListings}
    </ScrollView>
  );
};

export default AllListingsView;
