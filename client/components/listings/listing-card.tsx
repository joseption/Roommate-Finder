import { Pressable, View, StyleSheet, Image, Text, TouchableHighlight, Platform, BackHandler } from 'react-native';
import _Text from '../control/text';
import _Group from '../control/group';
import { Color, FontSize, Radius, Style } from '../../style';
import { authTokenHeader, env, getLocalStorage, Listings_Screen, navProp, NavTo, userId} from "../../helper";
import _Button from '../control/button';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { useEffect, useState } from 'react';
import { faStar, faMapMarkerAlt, faBed, faBath, faHome, faBuilding, faCity, faUser, faHeart } from '@fortawesome/free-solid-svg-icons';
import _Image from '../control/image';

const ListingCard = (props: any) => {
  const [isFavorite, setIsFavorite] = useState(false);

  const housingIcons = {
    House: faHome,
    Apartment: faBuilding,
    Condo: faCity,
  };

  useEffect(() => {
    const checkFavorited = async () => {
      const tokenHeader = await authTokenHeader();
      try {
        const response = await fetch(`${env.URL}/listings/checkFavorited`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            authorization: tokenHeader,
          },
          body: JSON.stringify({
            userId: props.userId,
            listingId: props.item.id,
          }),
        });
  
        const data = await response.json();
        setIsFavorite(data.isFavorited);
      } catch (e) {
        return;
      }
    };
  
    checkFavorited();
  }, [props.userId, props.item.id]);
  

  const styles = StyleSheet.create({
    container: {
      marginBottom: 10,
      shadowColor: Color(props.isDarkMode).contentHolderSecondary,
      shadowOffset: { width: -3, height: 3 },
      shadowOpacity: 1,
      shadowRadius: 0,
      elevation: 2,
      backgroundColor: Color(props.isDarkMode).contentHolder,
      borderRadius: Radius.default,
    },
    image: {
      width: '100%',
      height: 150,
      borderTopLeftRadius: Radius.default,
      borderTopRightRadius: Radius.default,
    },
    headerContainer: {
      display: "flex",
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },
    infoContainer: {
      padding: 10,
      display: "flex",
      width: '100%',
      flexDirection: 'column'
    },
    header: {
      fontSize: FontSize.large,
      fontWeight: "bold",
      color: Color(props.isDarkMode).text,
    },
    subHeaderContainer: {
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      marginTop: 10
    },
    subHeader: {
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
    },
    subHeaderText: {
      fontSize: FontSize.default,
      color: Color(props.isDarkMode).text,
      marginLeft: 5,
    },   
    priceContainer: {
      borderBottomLeftRadius: Radius.default,
      borderBottomRightRadius: Radius.default,
      padding: 10,
      paddingTop: 10,
      marginTop: 10,
      borderTopWidth: 1,
      borderTopColor: Color(props.isDarkMode).border,
    },
    price: {
      fontSize: FontSize.default,
      color: Color(props.isDarkMode).text,
      fontWeight: "bold",
      alignSelf: "flex-start",
    },
    userImageContainer: {
      position: "absolute",
      top: 5,
      right: 5,
      zIndex: 1,
      borderWidth: 1,
      borderColor: Color(props.isDarkMode).actualWhite,
      borderRadius: Radius.round,
      backgroundColor: Color(props.isDarkMode).actualWhite,
    },
    favorite: {
      position: "absolute",
      top: 3,
      right: 5,
      zIndex: 1,
    },
    userImage: {
      width: 30,
      height: 30,
      borderRadius: Radius.round,
    },  
    
    icon: {
      ...Platform.select({
        web: {
          outlineStyle: "none",
        },
      }),
    },
    iconBorder: {
      ...Platform.select({
        web: {
          outlineStyle: "none",
        },
      }),
    },
    headerTextContainer: {
      flex: 1
    },
    detail: {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      marginRight: 5,
      marginBottom: 5,
      borderRadius: Radius.round,
      paddingVertical: 5,
      paddingHorizontal: 15,
      color: Color(props.isDarkMode).text,
      fontSize: FontSize.default,
      backgroundColor: props.isDarkMode ? Color(props.isDarkMode).holder : Color(props.isDarkMode).contentBackgroundSecondary,
      borderColor: Color(props.isDarkMode).separator,
      borderWidth: .5
    },
    distanceContent: {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center'
    },
    card: {
      marginHorizontal: 10
    }
  });
  

  const viewListing = () => {
    props.setCurrentListing(props.item);
  };

  return (
    <View
    style={styles.card}
    >
      <TouchableHighlight
        underlayColor={Color(props.isDarkMode).holderUnderlay}
        onPress={viewListing}
        style={styles.container}
      >
        <View>
          <Image source={{ uri: props.item.images[0] }} style={styles.image} />

          {
            props.listingUserId === props.userId ? (
              <View style={styles.userImageContainer}>
                <Image
                  source={{ uri: props.userImage }}
                  style={styles.userImage}
                />
              </View>
            ) : (
              isFavorite && (
                <View style={styles.favorite}>
                  <FontAwesomeIcon style={styles.icon} icon={faHeart} size={30} color={Color(props.isDarkMode).danger} />     
                </View>
              )
            )
          }

          <View
          style={styles.infoContainer}
          >
            <View style={styles.headerContainer}>
              <_Text
              containerStyle={styles.headerTextContainer}
              numberOfLines={1}
              isDarkMode={props.isDarkMode}
              style={styles.header}>
                  {props.item.name}
              </_Text>
              <_Text
              isDarkMode={props.isDarkMode}
              style={styles.header}>
                {'$' + props.item.price} / mo
              </_Text>
            </View>
            <View
            style={styles.distanceContent}
            >
              <FontAwesomeIcon
              icon={faMapMarkerAlt}
              color={Color(props.isDarkMode).text}
              />
              <_Text
              isDarkMode={props.isDarkMode}
              style={styles.subHeaderText}
              >
                {props.item.distanceToUcf} {props.item.distanceToUcf === 1 ? "mile" : "miles"} from UCF
              </_Text>
            </View>
            <View style={styles.subHeaderContainer}>

              <View
              style={styles.detail}
              >
                <FontAwesomeIcon
                icon={housingIcons[props.item.housing_type]}
                color={Color(props.isDarkMode).text}
                />
                <_Text
                isDarkMode={props.isDarkMode}
                style={styles.subHeaderText}
                >
                  {props.item.housing_type}
                </_Text>
              </View>
              <View
              style={styles.detail}
              >
                <FontAwesomeIcon
                icon={faBed}
                color={Color(props.isDarkMode).text}
                />
                <_Text
                isDarkMode={props.isDarkMode}
                style={styles.subHeaderText}
                >
                  {props.item.rooms + " Bed"}
                </_Text>
              </View>
              <View
              style={styles.detail}
              >
                <FontAwesomeIcon
                icon={faBath}
                color={Color(props.isDarkMode).text} 
                />
                <_Text
                isDarkMode={props.isDarkMode}
                style={styles.subHeaderText}>
                  {props.item.bathrooms + " Bath"}
                </_Text>
              </View>
            </View>
          </View>
        </View>
      </TouchableHighlight>
    </View>
  );
  
};

export default ListingCard;

