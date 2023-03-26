import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import React, { useEffect, useState } from 'react';
import { BackHandler, Platform, RefreshControl, ScrollView, StyleSheet, View } from 'react-native';
import { Color, FontSize, Radius, Style } from '../../style';
import _Button from '../control/button';
import _Text from '../control/text';
import ListingCard from './listing-card';

const AllListingsView = (props: any) => {
  const [allListings, setAllListings] = useState<JSX.Element[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [count, setCount] = useState(0);

  useEffect(() => {
    generateListings();
  }, [props.allListings, props.selectedFilter]);

  const generateListings = () => {
    let cnt = 0;
    const filteredListings = props.allListings
      ?.filter((item: any) => {
        if (item.userId != props.userId)
          cnt++;

        return item.userId != props.userId;
      })
      .map((item: any, key: any) => (
        <ListingCard
          isDarkMode={props.isDarkMode}
          setCurrentListing={props.setCurrentListing}
          userId={props.userId}
          userImage={props.userImage}
          listingUserId={item.userId}
          key={key}
          item={item}
          mobile={props.mobile}
        />
      ));

    setCount(cnt);
    setAllListings(filteredListings);
  };

  const refresh = () => {
    setRefreshing(true);
    props.refresh();
    setRefreshing(false);
  };

  const containerStyle = () => {
    var container = Color(props.isDarkMode).contentBackground;
    var padding = 20;
    var borderRadius = Radius.large;
    var borderColor = Color(props.isDarkMode).border;
    var borderWidth = 1;
    var marginBottom = 0;
    var flex = 1;
    if (props.mobile) {
        padding = 0;
        borderRadius = 0;
        borderWidth = 0;
        container = Color(props.isDarkMode).contentBackgroundSecondary;
    }
    else {
      marginBottom = 20
    }

    return {
        padding: padding,
        borderRadius: borderRadius,
        borderColor: borderColor,
        borderWidth: borderWidth,
        backgroundColor: container,
        flex: flex,
        marginBottom: marginBottom
    }
  }

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
    },
    noResultsContainer: {
      display: 'flex',
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      height: '100%'
    },
    textStyle: {
      fontWeight: 'bold',
      textAlign: 'center',
      color: Color(props.isDarkMode).text,
      paddingBottom: 10
    },
    mainIcon: {
      ...Platform.select({
        web: {
          outlineStyle: 'none'
        }
      }),
    },
    mainIconContainer: {
      marginBottom: 20,
    },
    innerContainer: {
      justifyContent: 'center',
      height: '100%'
    },
    listings: {
      marginLeft: props.mobile ? 0 : -10
    }
});

  return (
    <View
    style={[containerStyle()]}
    >
      <ScrollView
      style={styles.container}
      contentContainerStyle={count == 0 ? styles.innerContainer : null}
      refreshControl={
        <RefreshControl
        refreshing={refreshing}
        onRefresh={refresh}
        colors={[Color(props.isDarkMode).gold]}
        progressBackgroundColor={Color(props.isDarkMode).contentHolder}
        />
      }
      >
        {count > 0 ?
        <View
        style={styles.listings}
        >
        {allListings}
        </View>
        :
        <View style={styles.noResultsContainer}>
          <View
          style={styles.mainIconContainer}
          >
            <FontAwesomeIcon 
            size={100} 
            color={Color(props.isDarkMode).gold} 
            style={styles.mainIcon} 
            icon="home"
            >
            </FontAwesomeIcon>
          </View>
          <_Text
          style={styles.textStyle}
          >
            No listings match the applied filters
          </_Text>
          <_Button
          style={Style(props.isDarkMode).buttonInverted}
          textStyle={Style(props.isDarkMode).buttonInvertedText}
          onPress={() => props.setFilters({})}
          isDarkMode={props.isDarkMode}
          >
            Clear Filters
          </_Button>
        </View>
        }
      </ScrollView>
    </View>
  );
};

export default AllListingsView;
