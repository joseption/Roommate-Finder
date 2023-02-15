import { Pressable, View, StyleSheet, Image, Text, TouchableHighlight, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import _Text from '../control/text';
import _Group from '../control/group';
import { Color, FontSize, Radius, Style } from '../../style';
import _Button from '../control/button';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { useEffect, useState } from 'react';
import { faStar } from '@fortawesome/free-solid-svg-icons';
import _Image from '../control/image';

const ListingCard = (props: any) => {

  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    setIsFavorite(true) // props.item.isFavorite
  }, [props.item.isFavorite]);

  const styles = StyleSheet.create({
    image: {
      width: '100%',
      height: 175,
      borderTopLeftRadius: Radius.default,
      borderTopRightRadius: Radius.default,
    },
    header: {
      fontSize: FontSize.large,
      fontWeight: 'bold',
      marginTop: 10,
      color: Color(props.isDarkMode).text
    },
    subheader: {
      fontSize: FontSize.default,
      color: Color(props.isDarkMode).textTertiary,
      fontStyle: 'italic'
    },
    description: {
      fontSize: FontSize.default,
      color: Color(props.isDarkMode).text,
      marginTop: 10,
    },
    price: {
      fontSize: FontSize.default,
      color: Color(props.isDarkMode).text,
    },
    petsAllowed: {
      fontSize: FontSize.default,
      color: Color(props.isDarkMode).text,
    },
    viewListingButton: {
      backgroundColor: Color(props.isDarkMode).black,
      padding: 10,
      borderRadius: 5,
      marginTop: 20,
      alignSelf: 'flex-end',
    },
    viewListingButtonText: {
      color: Color(props.isDarkMode).white,
      fontSize: 18,
      fontWeight: 'bold',
      textAlign: 'center',
    },
    favorite: {
      position: 'absolute',
      top: 10,
      right: 10,
    },
    icon: {
      ...Platform.select({
        web:{
          outlineStyle: 'none'
        }
      }),
      position: 'absolute',
    },
    iconBorder: {
      ...Platform.select({
        web:{
          outlineStyle: 'none'
        }
      }),
    }
  });

  const containerStyle = () => {
    return {
      padding: 10,
      shadowColor: Color(props.isDarkMode).contentHolderSecondary,
      shadowOffset: {width: -3, height: 3},
      shadowOpacity: 1,
      shadowRadius: 0,
      marginLeft: 3,
      ...Platform.select({
          web: {
              width: 'calc(100% - 3px)'
          },
          android: {
              marginLeft: 0
          }
      }),
      marginBottom: 10,
      elevation: 2,
      backgroundColor: Color(props.isDarkMode).contentHolder,
      display: 'flex',
      borderRadius: Radius.default,
    }
  }

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
    onPress = {() => viewListing()}
    style={containerStyle()}
    >
      <View>
        <View>
        <Image source={{ uri: props.item.images[0] }} style={styles.image} />
        <Pressable style = {styles.favorite} onPress = {() => sendFavorite()}>
          <FontAwesomeIcon  style = {styles.iconBorder} icon={faStar} size={32} color='#000000b3'/>
          <FontAwesomeIcon  style = {styles.icon} icon={faStar} size={30} color={favoriteColor()}/>
        </Pressable>
        </View>
        <_Text isDarkMode={props.isDarkMode} style={styles.header}>{props.item.name}</_Text>
        <_Text isDarkMode={props.isDarkMode} style={styles.subheader}>{props.item.city}</_Text>
        <_Text isDarkMode={props.isDarkMode} style={styles.description}>{props.item.description}</_Text>
        <_Text isDarkMode={props.isDarkMode} style={styles.price}>{props.item.price}</_Text>
        <_Text isDarkMode={props.isDarkMode} style={styles.petsAllowed}>
          Pets Allowed: {props.item.petsAllowed ? 'Yes' : 'No'}
        </_Text>
      </View>
    </TouchableHighlight>
  );
};

export default ListingCard;
