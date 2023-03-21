import React, { useEffect, useState } from 'react';
import { View, TouchableOpacity, StyleSheet, TouchableHighlight, Platform } from 'react-native';
import FavoriteListings from '../listings/favorite-listings';
import CreateListing from '../listings/create-listing';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faSearch, faStar, faPlusCircle } from '@fortawesome/free-solid-svg-icons';
import { Color, Radius } from '../../style';
import { getLocalStorage, Listings_Screen } from '../../helper';
import _Image from '../control/image';

const BottomNavbar = (props: any) => {
  const [isListingScreenOpen, setIsListingScreenOpen] = React.useState(false);
  const [image, setImage] = useState<any>(null);

  useEffect(() => {
  }, [props.currentScreen]);

  useEffect(() => {
    getImage();
  }, [props.userImage, props.isDarkMode]);

  const onSearch = () => {
    props.setCurrentScreen(Listings_Screen.all)
    setIsListingScreenOpen(!isListingScreenOpen);
  }

  const onFavorite = () => {
    props.setCurrentScreen(Listings_Screen.favorites)
    setIsListingScreenOpen(!isListingScreenOpen)
  }

  const onCreate = () => {
    props.setCurrentScreen(Listings_Screen.create)
    setIsListingScreenOpen(!isListingScreenOpen)
  }

  const getImage = () => {
    if (props.userImage) {
      setImage({uri: props.userImage});
    }
    else {
      setImage(props.isDarkMode ? require('../../assets/images/user_w.png') : require('../../assets/images/user.png'));
    }
  }

  const styles = StyleSheet.create({
    container: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      padding: 5,
      backgroundColor: Color(props.isDarkMode).contentBackgroundSecondary,
      borderTopWidth: 1,
      borderTopColor: Color(props.isDarkMode).separator,
      alignItems: 'center'
    },
    button: {
      alignItems: 'center',
      padding: 5,
      borderRadius: Radius.default,
      width: '33%',
    },
    icon: {
      ...Platform.select({
        web:{
          outlineStyle: 'none'
        }
      })
    },
    userIcon: {
      height: 30,
      width: 30,
      borderRadius: Radius.round,
      margin: 'auto',
      ...Platform.select({
          web: {
          outlineStyle: 'none',
          }
      }),
      borderWidth: .5,
      borderColor: props.currentScreen === Listings_Screen.favorites ? Color(props.isDarkMode).gold : Color(props.isDarkMode).separator
    },
    iconContainer: {

    },
    favContainer: {
      backgroundColor: Color(props.isDarkMode).separator,
      borderRadius: Radius.round,
      position: 'absolute',
      bottom: -1,
      right: -5,
      padding: 2
    }
  });

  return (
    <View style={styles.container}>
      <TouchableHighlight 
        onPress={() => {
          let action = function() {
            if (props.currentScreen !== Listings_Screen.all)
              props.refresh();
            onSearch();
          }
          if (props.currentScreen === Listings_Screen.create) {
            props.setIsManualNavigate({action});
          }
          else {
            action();
          }
        }} 
        underlayColor={Color(props.isDarkMode).contentDialogBackground}
        style={styles.button}
        >
        <View>
          <FontAwesomeIcon
          style={styles.icon}
          icon="list"
          size={24}
          color={props.currentScreen === Listings_Screen.all ? Color(props.isDarkMode).gold : Color(props.isDarkMode).text}
          />
        </View>
      </TouchableHighlight>
      <TouchableHighlight
        underlayColor={Color(props.isDarkMode).contentDialogBackground}
        onPress={() => {
          let action = function() {
            if (props.currentScreen !== Listings_Screen.favorites)
              props.refresh();
            onFavorite();
          }
          if (props.currentScreen === Listings_Screen.create) {
            props.setIsManualNavigate({action});
          }
          else {
            action();
          }
        }}
        style={styles.button}
        >
        <View
        style={styles.iconContainer}
        >
        <_Image
        style={styles.userIcon}
        source={image}
        height={30}
        width={30}
        />
        <View
        style={styles.favContainer}
        >
          <FontAwesomeIcon
          style={styles.icon}
          icon={faStar} size={12}
          color={props.currentScreen === Listings_Screen.favorites ? Color(props.isDarkMode).gold : Color(props.isDarkMode).text}
          />
        </View>
        </View>
      </TouchableHighlight>
      <TouchableHighlight
        underlayColor={Color(props.isDarkMode).contentDialogBackground}
        onPress={() => onCreate()} style={styles.button}
        >
        <FontAwesomeIcon
          style={styles.icon}
          icon={faPlusCircle}
          size={24}
          color={props.currentScreen === Listings_Screen.create ? Color(props.isDarkMode).gold : Color(props.isDarkMode).text}
          />
      </TouchableHighlight>
    </View>
  );
};

export default BottomNavbar;
