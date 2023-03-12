import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Platform, TouchableHighlight, ActivityIndicator } from 'react-native';
import AllListingsView from '../components/listings/all-listings';
import { authTokenHeader, env, Listings_Screen, getLocalStorage } from '../helper';
import BottomNavbar from '../components/listings/bottom-nav';
import FavoriteListings from '../components/listings/favorite-listings';
import CreateListing from '../components/listings/create-listing';
import { useLinkProps } from '@react-navigation/native';
import _Dropdown from '../components/control/dropdown';
import ListingView from '../components/listings/listing';
import _Text from '../components/control/text';
import { Color, FontSize, Radius, Style } from '../style';
import _Button from '../components/control/button';
import Filter from '../components/listings/filter';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faFilter } from '@fortawesome/free-solid-svg-icons';

const ListingsScreen = (props: any) => {
  const [isListing, setIsListing] = useState(false);
  const [listingID, setListingID] = useState('');
  const [allListings, setAllListings] = useState([]);
  const [init, setInit] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [currentScreen, setCurrentScreen] = useState(Listings_Screen.all);
  const [searchPressed, setSearchPressed] = useState(false);
  const [currentListing, setCurrentListing] = useState(null);
  const [userInfo, setUserInfo] = useState<any>();
  const [showFilter, setShowFilter] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    getUserInfo();
  }, [userInfo?.id])

  const getUserInfo = async () => {
    setUserInfo(await getLocalStorage().then((res) => {return res.user}));
  };

  useEffect(() => {
    if (!init) {
      getAllListings();
      setInit(true);
    }
  }, [currentScreen]);

  const getAllListings = async () => {
    setIsLoaded(false);
    try {
      let obj = {}; // TODO: ERICK PUT ALL YOUR FILTERS HRE WHEN YOU ARE READY!
      let js = JSON.stringify(obj);
      await fetch(`${env.URL}/listings/all`, {
        method: 'POST',
        body:js,
        headers: { 
          'Content-Type': 'application/json', 
          'authorization': await authTokenHeader(),
      },
      })
        .then(async (ret) => {
          let res = JSON.parse(await ret.text());
          setAllListings(res);
        });
    } catch (e) {
      // Failed
    }
    setIsLoaded(true);
  };

  const handleNavigation = (screen: Listings_Screen) => {
    setCurrentScreen(screen);
    if (screen === Listings_Screen.all) {
      setSelectedFilter('all');
      setSearchPressed(false);
    }
  };

  const bottomBarNav = () => {
    return <BottomNavbar
    isDarkMode={props.isDarkMode}
    setCurrentScreen={setCurrentScreen}
    handleNavigation={handleNavigation}
    disabled={currentScreen !== Listings_Screen.all || selectedFilter !== 'all'}
    setSearchPressed={setSearchPressed}
    currentScreen={currentScreen}
  />
  }

  const handleOpenFilterModal = () => {
    setShowFilter(true);
  };

  const handleCloseFilterModal = () => {
    setShowFilter(false);
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
    title: {
      margin: 10,
      textAlign: 'center',
      fontWeight: 'bold',
      fontSize: FontSize.large,
      color: Color(props.isDarkMode).titleText
    },
    contentContainer: {
      height: '100%'
    },
    titleContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
    },
    rightContainer: {
      flex: 1,
      flexDirection: 'row',
      justifyContent: 'flex-end',
      alignItems: 'center',
    },
    buttonSmall: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: Color(props.isDarkMode).actualWhite,
      justifyContent: 'center',
      alignItems: 'center',
    },
    buttonsRow: {
      marginRight: 5,
      marginBottom: 3
    },
    button: {
      padding: 10,
      borderRadius: Radius.round,
    },
    filterIcon: {
      ...Platform.select({
        web: {
          outlineStyle: 'none'
        }
      }),
    },
    headerContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center'
    },
    loading: {
      position: 'relative',
      flex: 1,
      backgroundColor: 'transparent'
    }
});

const refresh = async () => {
  await getAllListings();
}

const loading = () => {
  return <View
  style={[Style(props.isDarkMode).maskPrompt, styles.loading]}
  >
    <ActivityIndicator
    size="large"
    color={Color(props.isDarkMode).gold}
    style={Style(props.isDarkMode).maskLoading}
    />    
  </View>
}

return (
  <View style={styles.container}>
    {!currentListing && currentScreen === Listings_Screen.all && !showFilter && (
      <View style={styles.content}>
        <View style={styles.contentContainer}>
          <View
          style={styles.headerContainer}
          >
            <_Text style={styles.title}>Browse Listings</_Text>
            <View style={styles.rightContainer}>
              <View style={styles.titleContainer}>
                <View
                style={styles.buttonsRow}
                >
                  <TouchableHighlight
                  underlayColor={Color(props.isDarkMode).underlayMask}
                  style={styles.button}
                  onPress={() => handleOpenFilterModal}
                  >
                    <FontAwesomeIcon 
                    size={20} 
                    color={false ? Color(props.isDarkMode).gold : Color(props.isDarkMode).text} 
                    style={styles.filterIcon} 
                    icon="filter"
                    >
                    </FontAwesomeIcon>
                  </TouchableHighlight>
                </View>
              </View>
            </View>
            </View>
          {!isLoaded ?
          <>{loading()}</>
          :
          <AllListingsView
            isDarkMode={props.isDarkMode}
            setCurrentListing={setCurrentListing}
            allListings={allListings}
            setListingID={setListingID}
            setIsListing={setIsListing}
            selectedFilter={selectedFilter}
            refresh={refresh}
          />
          }
          {bottomBarNav()}
        </View>
      </View>
    )}

    {!currentListing && currentScreen === Listings_Screen.all && showFilter && (
      <View style={styles.content}>
        <View style={styles.contentContainer}>
          <Filter 
          isDarkMode={props.isDarkMode}
          setShowFilter = {setShowFilter}
          onClose={handleCloseFilterModal} 
          />
        </View>
      </View>
    )}

    {!currentListing && currentScreen === Listings_Screen.favorites && (
      <View style={styles.content}>
        <View style={styles.contentContainer}>
          {!isLoaded ?
          <>{loading()}</>
          :
          <FavoriteListings 
            isDarkMode={props.isDarkMode}
            setCurrentListing={setCurrentListing}
            allListings={allListings}
            setListingID={setListingID}
            setIsListing={setIsListing}
            selectedFilter={selectedFilter}
            userId={userInfo?.id}
            refresh={refresh}
          />
          }
          {bottomBarNav()}
        </View>
      </View>
    )}

    {!currentListing && currentScreen === Listings_Screen.create && (
      <View style={styles.content}>
        <View style={styles.contentContainer}>
          <CreateListing 
            isDarkMode={props.isDarkMode} 
            onClose={() => handleNavigation(Listings_Screen.all)}
          />
          {bottomBarNav()}
        </View>
      </View>
    )}

    {currentListing && (
      <ListingView
        isDarkMode={props.isDarkMode}
        setCurrentListing={setCurrentListing}
        currentListing={currentListing}
      />
    )}
  </View>
);
};
  
export default ListingsScreen;