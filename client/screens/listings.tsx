import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Platform, TouchableHighlight, ActivityIndicator, BackHandler } from 'react-native';
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

const ListingsScreen = (props: any) => {
  const [allListings, setAllListings] = useState([]);
  const [unfilteredAllListings, setUnfilteredAllListings] = useState([]);
  const [init, setInit] = useState(false);
  const [currentScreen, setCurrentScreen] = useState(Listings_Screen.all);
  const [searchPressed, setSearchPressed] = useState(false);
  const [currentListing, setCurrentListing] = useState(null);
  const [userInfo, setUserInfo] = useState<any>();
  const [showFilter, setShowFilter] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [updatedListing, setUpdatedListing] = useState(false);
  const [filters, setFilters] = useState({});
  const [isManualNavigate, setIsManualNavigate] = useState(null);
  const [refreshListing, setRefreshListing] = useState(null);
  const [image, setImage] = useState<any>(null);

  useEffect(() => {
    const back = BackHandler.addEventListener('hardwareBackPress', backPress);
    return () => {
      back.remove();
    }
  });

  const backPress = () => {
    if (currentListing) {
      setCurrentListing(null);
      return true;
    }
    else
      false;
  }

  useEffect(() => {
    getUserInfo();
  }, [userInfo?.id])

  useEffect(() => {
    setImage(userInfo?.image);
  }, [userInfo?.image])

  const getUserInfo = async () => {
    setUserInfo(await getLocalStorage().then((res) => {return res.user}));
  };

  useEffect(() => {
    if (!init) {
      getAllListings();
      setInit(true);
    }
    if (currentScreen === Listings_Screen.all) {
      setCurrentListing(null);
    }
  }, [currentScreen]);

  useEffect(() => {
    getAllListings();
  }, [filters]); 

  const getAllListings = async () => {
    setIsLoaded(false);
    try {
      let obj = filters;
      let js = JSON.stringify(obj);
  
      await fetch(`${env.URL}/listings/all`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'authorization': await authTokenHeader(),
        },
      })
        .then(async (ret) => {
          let res = JSON.parse(await ret.text());
          setUnfilteredAllListings(res);
        });
  
      await fetch(`${env.URL}/listings/all`, {
        method: 'POST',
        body: js,
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
      return;
    }
    setIsLoaded(true);
  };
  

  const handleNavigation = (screen: Listings_Screen) => {
    setCurrentScreen(screen);
    if (screen === Listings_Screen.all) {
      setSearchPressed(false);
    }
  };

  const bottomBarNav = () => {
    return <BottomNavbar
    isDarkMode={props.isDarkMode}
    setCurrentScreen={setCurrentScreen}
    handleNavigation={handleNavigation}
    disabled={currentScreen !== Listings_Screen.all}
    setSearchPressed={setSearchPressed}
    currentScreen={currentScreen}
    refresh={getAllListings}
    setIsManualNavigate={setIsManualNavigate}
    userImage={image}
  />
  }

  const handleOpenFilterModal = () => {
    setShowFilter(true);
  };

  const handleCloseFilterModal = () => {
    setShowFilter(false);
  };

  const handleFilter = (filterValues: any) => {
    setFilters(filterValues);
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

const hasFilters = () => {
  if (filters) {
    return Object.values(filters).find(x => {
      if (x)
        return true;
    })
  }
  return false;
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
                  onPress={handleOpenFilterModal}
                  >
                    <FontAwesomeIcon 
                    size={20} 
                    color={hasFilters() ? Color(props.isDarkMode).gold : Color(props.isDarkMode).text} 
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
            userId={userInfo?.id}
            userImage={image}
            refresh={refresh}
            setFilters={setFilters}
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
          onFilter={handleFilter}
          filters={filters}
          showFilter={showFilter}
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
            allListings={unfilteredAllListings}
            userId={userInfo?.id}
            userImage={image}
            refresh={refresh}
            setCurrentScreen={setCurrentScreen}
          />
          }
          {bottomBarNav()}
        </View>
      </View>
    )}

    {currentScreen === Listings_Screen.create && (
      <View style={styles.content}>
        <View style={styles.contentContainer}>
          <CreateListing 
            currentListing={currentListing}
            isDarkMode={props.isDarkMode} 
            onClose={() => handleNavigation(Listings_Screen.favorites)}
            refresh={refresh}
            currentScreen={currentScreen}
            setUpdatedListing={setUpdatedListing}
            setCurrentScreen={setCurrentScreen}
            isManualNavigate={isManualNavigate}
            setIsManualNavigate={setIsManualNavigate}
            setCurrentListing={setCurrentListing}
            refreshListing={refreshListing}
          />
          {bottomBarNav()}
        </View>
      </View>
    )}

    {currentListing && (currentScreen !== Listings_Screen.create) && (
      <ListingView
        isDarkMode={props.isDarkMode}
        setCurrentListing={setCurrentListing}
        currentListing={currentListing}
        refresh={refresh}
        setNavSelector={props.setNavSelector}
        setCurrentScreen={setCurrentScreen}
        updatedListing={updatedListing}
        setUpdatedListing={setUpdatedListing}
        setRefreshListing={setRefreshListing}
      />
    )}
  </View>
);
};
  
export default ListingsScreen;