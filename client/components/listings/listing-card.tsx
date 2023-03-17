import { Pressable, View, StyleSheet, Image, Text, TouchableHighlight, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import _Text from '../control/text';
import _Group from '../control/group';
import { Color, FontSize, Radius, Style } from '../../style';
import _Button from '../control/button';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { useEffect, useState } from 'react';
import { faStar, faMapMarkerAlt, faBed, faBath, faHome, faBuilding, faCity, faUser} from '@fortawesome/free-solid-svg-icons';
import _Image from '../control/image';

const ListingCard = (props: any) => {

  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    setIsFavorite(true) //props.item.isFavorite
  }, [props.item.isFavorite]);

  const housingIcons = {
    House: faHome,
    Apartment: faBuilding,
    Condo: faCity,
  };

  const styles = StyleSheet.create({
    container: {
      margin: 10,
      shadowColor: Color(props.isDarkMode).contentHolderSecondary,
      shadowOffset: { width: -3, height: 3 },
      shadowOpacity: 1,
      shadowRadius: 0,
      elevation: 2,
      backgroundColor: Color(props.isDarkMode).contentHolder,
      borderRadius: Radius.default,
    },
    image: {
      width: "100%",
      height: 150,
      borderTopLeftRadius: Radius.default,
      borderTopRightRadius: Radius.default,
    },
    headerContainer: {
      display: "flex",
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      padding: 10,
    },
    header: {
      fontSize: FontSize.large,
      fontWeight: "bold",
      color: Color(props.isDarkMode).text,
      lineHeight: 20,
      maxHeight: 40,
      flex: 1,
    },
    subHeaderContainer: {
      display: "flex",
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      padding: 10,
      paddingBottom: 0,
    },
    subHeader: {
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      marginRight: 10,
    },
    subHeaderText: {
      fontSize: FontSize.default,
      color: Color(props.isDarkMode).textTertiary,
      marginLeft: 5,
      marginRight: 10,
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
    priceText: {
      fontSize: FontSize.default,
      color: Color(props.isDarkMode).textTertiary,
      marginLeft: 5,
    },
    userImageContainer: {
      position: "absolute",
      top: 10,
      right: 10,
      zIndex: 1,
      borderWidth: 2,
      borderColor: Color(props.isDarkMode).actualWhite,
      borderRadius: 17,
      backgroundColor: Color(props.isDarkMode).actualWhite,
    },
    favorite: {
      position: "absolute",
      top: 10,
      right: 10,
      zIndex: 1,
    },
    userImage: {
      width: 30,
      height: 30,
      borderRadius: 15,
    },  
    
    icon: {
      ...Platform.select({
        web: {
          outlineStyle: "none",
        },
      }),
      position: "absolute",
    },
    iconBorder: {
      ...Platform.select({
        web: {
          outlineStyle: "none",
        },
      }),
    },
  });
  

  const viewListing = () => {
    props.setCurrentListing(props.item)
  };

  const sendFavorite = () => {
    setIsFavorite(!isFavorite)
  };

  const favoriteColor = () => {
    return isFavorite ? Color(props.isDarkMode).gold : Color(props.isDarkMode).actualWhite;
  }

  return (
    <TouchableHighlight
      underlayColor={Color(props.isDarkMode).holderUnderlay}
      onPress={viewListing}
      style={styles.container}
    >
      <View>
        <Image source={{ uri: props.item.images[0] }} style={styles.image} />

        {
          props.listingUserId === props.userId ? (
            <Pressable style={styles.userImageContainer}>
              <Image
                source={{ uri: props.userImage }}
                style={styles.userImage}
              />
            </Pressable>
          ) : (
            <Pressable style={styles.favorite} onPress={sendFavorite}>
              <FontAwesomeIcon style={styles.icon} icon={faStar} size={30} color={favoriteColor()} />
              <FontAwesomeIcon style={styles.iconBorder} icon={faStar} size={32} color={Color(props.isDarkMode).actualWhite} />
            </Pressable>
          )
        }

        
        <View style={styles.headerContainer}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <_Text isDarkMode={props.isDarkMode} style={styles.header}>
                {props.item.name}
            </_Text>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <FontAwesomeIcon
              icon={housingIcons[props.item.housing_type]}
              color={Color(props.isDarkMode).textTertiary}
              style={{ marginRight: 5 }}
            />
            <_Text isDarkMode={props.isDarkMode} style={[styles.header, { color: Color(props.isDarkMode).textTertiary }]}>
              {props.item.housing_type}
            </_Text>
          </View>

        </View>
        <View style={styles.subHeaderContainer}>
          <View style={styles.subHeader}>
            <FontAwesomeIcon icon={faMapMarkerAlt} color={Color(props.isDarkMode).textTertiary} />
            <_Text isDarkMode={props.isDarkMode} style={styles.subHeaderText}>
              {props.item.distanceToUcf} {props.item.distanceToUcf === 1 ? "mile" : "miles"} from UCF
            </_Text>
          </View>
          <View style={styles.subHeader}>
            <FontAwesomeIcon icon={faBed} color={Color(props.isDarkMode).textTertiary} />
            <_Text isDarkMode={props.isDarkMode} style={styles.subHeaderText}>{props.item.rooms + " bedrooms"}</_Text>
            <FontAwesomeIcon icon={faBath} color={Color(props.isDarkMode).textTertiary} style={{ marginLeft: 10 }} />
            <_Text isDarkMode={props.isDarkMode} style={styles.subHeaderText}>{props.item.bathrooms + " bathrooms"}</_Text>
          </View>
        </View>
        <View style={styles.priceContainer}>
        <_Text isDarkMode={props.isDarkMode} style={styles.price}>
          {'$' + props.item.price}
          <_Text isDarkMode={props.isDarkMode} style={styles.priceText}>/month</_Text>
        </_Text>

        </View>
      </View>
    </TouchableHighlight>
  );
  
};

export default ListingCard;

