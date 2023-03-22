import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import React, { useEffect, useState } from 'react';
import { Platform, RefreshControl, ScrollView, StyleSheet, View } from 'react-native';
import { Listings_Screen } from '../../helper';
import { Color, FontSize, Radius, Style } from '../../style';
import _Button from '../control/button';
import _Text from '../control/text';
import ListingCard from './listing-card';

const FavoriteListings = (props: any) => {
  const [favoriteListings, setFavoriteListings] = useState<JSX.Element[]>([]);
  const [refreshing, setRefreshing] = useState(false);  
  const [count, setCount] = useState(0);  

  const refresh = () => {
    setRefreshing(true);
    props.refresh();
    setRefreshing(false);
  };

  useEffect(() => {
    generateFavoriteListings();
  }, [props.allListings]);

  const generateFavoriteListings = () => {
    let cnt = 0;
    const favorites = props.allListings
      .filter((item: any) => {
        if (item.userId === props.userId)
          cnt++;

        return item.userId === props.userId;
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
    setFavoriteListings(favorites);
  };
  
  const containerStyle = () => {
    var container = Color(props.isDarkMode).contentBackground;
    var padding = 20;
    var borderRadius = Radius.large;
    var borderColor = Color(props.isDarkMode).border;
    var borderWidth = 1;
    var marginBottom = 0;
    var marginTop = 10;
    var flex = 1;
    if (props.mobile) {
        padding = 0;
        borderRadius = 0;
        borderWidth = 0;
        marginTop = 0;
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
        marginBottom: marginBottom,
        marginTop: marginTop
    }
  }

  const styles = StyleSheet.create({
    container: {
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
    },
    innerContainer: {
      justifyContent: 'center',
      height: '100%'
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
      margin: props.mobile ? 10 : 0,
      textAlign: 'center',
      fontWeight: 'bold',
      fontSize: FontSize.large,
      color: Color(props.isDarkMode).titleText
    },
    contentContainer: {
      height: '100%'
    },
    distanceContainer: {
      padding: 10,
    },
    noListingsContainer: {
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
    subTextStyle: {
      fontWeight: 'normal',
      marginTop: 10,
      marginBottom: 20,
      fontSize: FontSize.default
    },
    homeIcon: {
      ...Platform.select({
        web: {
          outlineStyle: 'none'
        }
      }),
    },
    homeIconContainer: {
      marginBottom: 20,
    },
    listings: {
      marginLeft: props.mobile ? 0 : -10
    }
});

  return (
    <View
    style={{flex: 1}}
    >
    <_Text style={styles.title}>My Listings</_Text>
      <View
      style={containerStyle()}
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
        {favoriteListings}
        </View>
        :
        <View style={styles.noListingsContainer}>
          <View
          style={styles.homeIconContainer}
          >
            <FontAwesomeIcon 
            size={100} 
            color={Color(props.isDarkMode).gold} 
            style={styles.homeIcon} 
            icon="home"
            >
            </FontAwesomeIcon>
          </View>
          <_Text
          style={styles.textStyle}
          >
            You currently don't have any listings
          </_Text>
          <_Button
          style={Style(props.isDarkMode).buttonInverted}
          textStyle={Style(props.isDarkMode).buttonInvertedText}
          onPress={() => {
            props.setCurrentScreen(Listings_Screen.create);
          }}
          isDarkMode={props.isDarkMode}
          >
            Create Listing
          </_Button>
        </View>
        }
        </ScrollView>
      </View> 
    </View>
  );
};

export default FavoriteListings;
