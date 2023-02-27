import { ScrollView, StyleSheet, View, Image } from 'react-native';
import { Color, FontSize, Radius, Style } from '../../style';
import { authTokenHeader, env, Listings_Screen, getLocalStorage } from '../../helper';
import _Button from '../control/button';
import _Image from '../control/image';
import _Text from '../control/text';
import { useState, useEffect } from 'react';
import Swiper from 'react-native-swiper/src';

const ListingView = (props: any) => {

  const [creator, setCreator] = useState<{image: string}>({image: ''});
  const { currentListing } = props;

  const onClose = () => {
    props.setCurrentListing(null)
  };

  const getUser = async (id: string) => {
    const tokenHeader = await authTokenHeader();
    return fetch(
      `${env.URL}/users/profile?userId=${id}`, {method:'GET',headers:{'Content-Type': 'application/json', 'authorization': tokenHeader}}
    ).then(async ret => {
      const res = JSON.parse(await ret.text());
      if (res.Error) {
        console.warn("Error: ", res.Error);
      }
      else {
        const user = {
          first_name: res.first_name,
          last_name: res.last_name,
          id: res.id,
          email: res.email,
          image: res.image,
        };
       setCreator(user);
      }
    });
  }

  useEffect(() => {
    getUser(props.currentListing.userId);
  }, [props.currentListing]);

  const styles = StyleSheet.create({
    container: {
      height: '100%'
    },
    content: {
      padding: 10,
      height: '100%'
    },
    btnContainer: {
      padding: 10,
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
      marginTop: 10,
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
    image: {
      width: '100%',
      height: 200,
      borderRadius: Radius.default
    },
    creatorContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 10,
      display: 'flex',
      justifyContent: 'center',
    },
    creatorImage: {
      width: 150,
      height: 150,
      borderRadius: 90,
      marginRight: 10,
      
    },
    messageButton: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'center',
      paddingBottom: 5
    },
    messageButtonText: {
      color: Color(props.isDarkMode).white,
      fontSize: 18,
      fontWeight: 'bold',
      textAlign: 'center',
    },
    swiper: {
      height: 200
    },
    positionBox: {
      position: 'absolute',
      bottom: 10,
      right: 10,
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      borderRadius: 5,
      padding: 5,
    },
    positionText: {
      color: 'white',
      fontSize: FontSize.default,
    },
    
  });

  return (
    <View style={styles.container}>
      <ScrollView style={styles.content}>
      <Swiper showsButtons = {true} scrollEnabled = {true} style={styles.swiper} showsPagination={false}>
        {currentListing.images.map((image, index) => (
          <View  key={index}>
            <_Image source={{ uri: image }} style={styles.image} />
            <View style={styles.positionBox}>
              <_Text style={styles.positionText}>{index + 1}/{currentListing.images.length}</_Text>
            </View>
          </View>
        ))}
      </Swiper>

        <_Text isDarkMode={props.isDarkMode} style={styles.header}>{currentListing.name}</_Text>
        <_Text isDarkMode={props.isDarkMode} style={styles.subheader}>{currentListing.city}</_Text>
        <_Text isDarkMode={props.isDarkMode} style={styles.description}>{currentListing.description}</_Text>
        <_Text isDarkMode={props.isDarkMode} style={styles.price}>{currentListing.price}</_Text>
        <_Text isDarkMode={props.isDarkMode} style={styles.petsAllowed}>
          Pets Allowed: {currentListing.petsAllowed ? 'Yes' : 'No'}
        </_Text>
        <View style={styles.creatorContainer}>
          <_Image source={{ uri: creator.image }} style={styles.creatorImage} />
          <_Text isDarkMode={props.isDarkMode}>{currentListing.creatorName}</_Text>
        </View>
        <View style={styles.messageButton}>
          <_Button onPress={() => {}} style={Style(props.isDarkMode).buttonDefault}>{'Message'}</_Button>
        </View>
      </ScrollView>
      <View style={styles.btnContainer}>
        <_Button onPress={() => onClose()} style={Style(props.isDarkMode).buttonDefault}>{'Go Back'}</_Button>
      </View>
    </View>
  );
};

export default ListingView;
