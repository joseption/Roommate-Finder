import { Animated, ScrollView, StyleSheet, View, Image, TouchableHighlight, Platform, ActivityIndicator, RefreshControl, TouchableOpacity, Easing } from "react-native";
import { Color, FontSize, Radius, Style } from "../../style";
import { authTokenHeader, env, getLocalStorage, Listings_Screen, navProp, NavTo, userId} from "../../helper";
import { useCallback } from 'react';
import _Button from "../control/button";
import _Image from "../control/image";
import _Text from "../control/text";
import { useState, useEffect } from "react";
import Swiper from "react-native-swiper/src";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faHome, faBuilding, faCity, faBed, faBath, faRuler, faPaw, faMapMarkerAlt, faHeart} from "@fortawesome/free-solid-svg-icons";
import { useNavigation } from "@react-navigation/native";

const ListingView = (props: any) => {
  const navigation = useNavigation<navProp>();
  const {currentListing} = props;
  const [isMe, setIsMe] = useState(false);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [location, setLocation] = useState({ latitude: 0, longitude: 0 });
  const [isLoaded, setIsLoaded] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [heartScale] = useState(new Animated.Value(1));

  const animateHeart = () => {
    if (!isFavorite) {
      heartScale.setValue(1);
  
      Animated.timing(heartScale, {
        toValue: 0.8,
        duration: 100,
        easing: Easing.linear,
        useNativeDriver: true,
      }).start(() => {
        Animated.timing(heartScale, {
          toValue: 1.35,
          duration: 200,
          easing: Easing.linear,
          useNativeDriver: true,
        }).start(() => {
          Animated.timing(heartScale, {
            toValue: 1,
            duration: 200,
            easing: Easing.linear,
            useNativeDriver: true,
          }).start();
        });
      });
    }
  };
  
  

  const refresh = () => {
    setRefreshing(true);
    getSingleListing();
    setRefreshing(false);
  };

  useEffect(() => {
    props.setRefreshListing({getSingleListing});
  }, []);

  const [creator, setCreator] = useState<{
    id: string;
    first_name: string;
    last_name: string;
    image: string;
  }>({ id: "", first_name: "", last_name: "", image: "" });
  
  const onClose = () => {
    props.setCurrentListing(null);
  };

  const housingIcons = {
    House: faHome,
    Apartment: faBuilding,
    Condo: faCity,
  };

  const containerStyle = () => {
    var container = Color(props.isDarkMode).contentBackground;
    var padding = 0;
    var borderRadius = Radius.large;
    var borderColor = Color(props.isDarkMode).border;
    var borderWidth = 1;
    var marginTop = 10;
    var marginBottom = 20;
    var paddingBottom = 10;
    var flex = 1;
    if (props.mobile) {
        padding = 0;
        borderRadius = 0;
        borderWidth = 0;
        marginTop = 0
        container = Color(props.isDarkMode).contentBackgroundSecondary;
        marginBottom = 0;
        paddingBottom = 0;
    }

    return {
        padding: padding,
        borderRadius: borderRadius,
        borderColor: borderColor,
        borderWidth: borderWidth,
        marginTop: marginTop,
        backgroundColor: container,
        marginBottom: marginBottom,
        paddingBottom: paddingBottom,
        flex: flex
    }
  }

  const toggleFavoriteAsync = async () => {
    const myId = await userId();
    const listingId = props.currentListing.id;
    const newIsFavorite = !isFavorite;
    const url = newIsFavorite ? `${env.URL}/listings/favorite/${listingId}` : `${env.URL}/listings/unfavorite/${listingId}`;

    setIsFavorite(newIsFavorite);
  
    try {
      const tokenHeader = await authTokenHeader();
      await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'authorization': tokenHeader,
        },
        body: JSON.stringify([{ userId: myId }]),
      });
    } catch (e) {
      setIsFavorite(!newIsFavorite);
    }
  };
  
  const toggleFavorite = useCallback(() => {
    animateHeart();
    toggleFavoriteAsync();
  }, [isFavorite]);  
  

  useEffect(() => {
    const checkFavorited = async () => {
      const myId = await userId();
      const listingId = props.currentListing.id;
      try {
        const tokenHeader = await authTokenHeader();
        const response = await fetch(`${env.URL}/listings/checkFavorited`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'authorization': tokenHeader,
          },
          body: JSON.stringify({ userId: myId, listingId }),
        });

        const data = await response.json();
        setIsFavorite(data.isFavorited);
      } catch (err) {
        console.error(err);
      }
    };

    checkFavorited();
  }, [props.currentListing]);

  const getSingleListing = async () => {
    let listingId = props.currentListing.id;
    if (listingId) {
      const tokenHeader = await authTokenHeader();
      let res = await fetch(`${env.URL}/listings/${listingId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          authorization: tokenHeader,
        },
      }).then(async (ret) => {
        const res = JSON.parse(await ret.text());
        if (res.Error) {
          console.warn("Error: ", res.Error);
        } else {
          props.setCurrentListing(res);
        }
      });
    }
  };

  const getUser = async (id: string) => {
    const tokenHeader = await authTokenHeader();
    let res = await fetch(`${env.URL}/users/profile?userId=${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        authorization: tokenHeader,
      },
    }).then(async (ret) => {
      const res = JSON.parse(await ret.text());
      if (res.Error) {
        console.warn("Error: ", res.Error);
      } else {
        const user = {
          first_name: res.first_name,
          last_name: res.last_name,
          id: res.id,
          image: res.image,
        };
        let myId = await userId()
        setIsMe(myId === user.id);
        setCreator(user);
      }
    });

    setIsLoaded(true);
    return res;
  };

  const deleteListing = async () => {
    try {
      const tokenHeader = await authTokenHeader();
      const response = await fetch(`${env.URL}/listings/${currentListing.id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          authorization: tokenHeader,
        },
      });
  
      if (response.status === 200)
      {
        props.refresh();
        onClose();
      }
      else {
        const error = await response.text();
        console.warn("Error deleting listing:", error);
      }
    } catch (err) {
      console.error("Error deleting listing:", err);
    }
  };

  const checkAddressValidity = async (address: string) => {
    let final = {};
    let obj = {address: address};
    let js = JSON.stringify(obj);
    let tokenHeader = await authTokenHeader();
    await fetch(`${env.URL}/listings/location`,{method:'POST',body:js,headers:{'Content-Type': 'application/json', 'authorization': tokenHeader}}).then(async ret => {
    let res = JSON.parse(await ret.text());
    final = res;
      return res;
    });

    return final;
  };

  const getAddressLatLng = async (address: any, city: any, zipcode: any) => {
    const location = `${address}, ${city}, ${zipcode}`;
    const isValidAddress = await checkAddressValidity(location);
    const lat = isValidAddress.results[0].locations[0].latLng.lat;
    const lng = isValidAddress.results[0].locations[0].latLng.lng;
    return { latitude: lat, longitude: lng };
  };

  const dialogStyle = () => {
    let style = [];
    style.push({backgroundColor: !props.isDarkMode ? Color(props.isDarkMode).holderMask : Color(props.isDarkMode).promptMaskMobile});
    return style;
  }

  const confirmationModal = () => {
    return (
      <View style={[styles.modalOverlay, dialogStyle()]}>
        <View style={styles.modalBox}>
          <_Text isDarkMode={props.isDarkMode} style={styles.modalTitle}>
            Delete Listing
          </_Text>
          <_Text isDarkMode={props.isDarkMode} style={styles.modalMessage}>
            Are you sure you want to delete this listing?
          </_Text>
          <View style={{ flexDirection: "row", justifyContent: "flex-end" }}>
            <_Button
              onPress={() => setShowDeleteConfirmation(false)}
              containerStyle={{ marginRight: 5 }}
              style={Style(props.isDarkMode).buttonDefault}
            >
              Cancel
            </_Button>
            <_Button
              onPress={deleteListing}
              style={Style(props.isDarkMode).buttonDanger}
            >
              Delete
            </_Button>
          </View>
        </View>
      </View>
    );
  };  

  useEffect(() => {
    getUser(props.currentListing.userId);
  }, [props.currentListing]);

  useEffect(() => {
    if (props.updatedListing) {
      getSingleListing();
      props.setUpdatedListing(false);
    }
  }, [props.updatedListing]);

  const generateRequestId = () => {
    return Math.floor(Math.random() * 9999999) + 1;
  };

  const editListing = () => {
    props.setCurrentScreen(Listings_Screen.create);
  }

  const favoriteBG = () => {
    if (isFavorite)
      return Color(props.isDarkMode).contentHolder;
    else
      return Color(props.isDarkMode).contentHolderSecondary;
  }

  const styles = StyleSheet.create({
    container: {
      height: "100%",
    },
    content: {
      height: "100%",
    },
    header: {
      fontSize: FontSize.large,
      fontWeight: "bold",
      color: Color(props.isDarkMode).text,
    },
    image: {
      width: "100%",
      height: 200,
      borderRadius: Radius.default,
    },
    creatorContainer: {
      flexDirection: "row",
      alignItems: 'center'
    },

    creatorImage: {
      width: 100,
      height: 100,
      borderRadius: Radius.round,
      marginRight: 10,
      borderWidth: 1,
      borderColor: Color(props.isDarkMode).separator,
    },
    creatorName: {
      fontSize: FontSize.default,
      fontWeight: "bold",
      color: Color(props.isDarkMode).text,
      marginBottom: 5,
    },
    messageButton: {
      marginLeft: "auto",
      padding: 10,
      borderRadius: Radius.default,
      alignItems: "center",
      justifyContent: "center",
      width: "100%",
    },
    
    swiper: {
      height: 200,
    },
    positionBox: {
      position: "absolute",
      bottom: 10,
      right: 10,
      backgroundColor: "#050505cc",
      borderRadius: 5,
      padding: 5,
    },
    positionText: {
      color: "white",
      fontSize: FontSize.default,
    },
    sectionHeader: {
      fontSize: FontSize.large,
      fontWeight: "bold",
      marginBottom: 5,
      color: Color(props.isDarkMode).text,
    },
    value: {
      fontSize: FontSize.default,
      color: Color(props.isDarkMode).text,
    },
    section: {
      marginTop: 10,
      borderRadius: Radius.default,
      padding: 10,
      backgroundColor: Color(props.isDarkMode).contentHolder,
    },
    detailRow: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 2,
    },
    detailLabel: {
      fontSize: FontSize.default,
      color: Color(props.isDarkMode).text,
    },
    detailValue: {
      fontSize: FontSize.default,
      color: Color(props.isDarkMode).text,
    },
    title: {
      fontSize: FontSize.large,
      fontWeight: "bold",
      marginTop: 10,
      color: Color(props.isDarkMode).text,
    },
    description: {
      fontSize: FontSize.default,
      color: Color(props.isDarkMode).text,
    },
    price: {
      fontSize: FontSize.large,
      fontWeight: "bold",
      color: Color(props.isDarkMode).text,
    },
    bigTitle: {
      fontSize: FontSize.huge,
      fontWeight: "bold",
      marginTop: 5,
      color: Color(props.isDarkMode).text,
    },
    perMonth: {
      fontSize: FontSize.default,
      color: Color(props.isDarkMode).text,
      marginLeft: 5,
    },
    dollarSign: {
      fontSize: FontSize.default,
      fontWeight: "bold",
      marginRight: 5,
    },
    detailIcon: {
      color: Color(props.isDarkMode).text,
      marginRight: 10,
    },
    map: {
      height: 200,
      marginVertical: 10,
    },
    address: {
      fontSize: FontSize.default,
      color: Color(props.isDarkMode).text,
    },
    modalOverlay: {
      position: "absolute",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      zIndex: 9999,
      justifyContent: "center",
      alignItems: "center",
    },
    modalBox: {
      margin: 'auto',
      backgroundColor: Color(props.isDarkMode).white,
      padding: 20,
      borderWidth: 1,
      borderStyle: 'solid',
      borderColor: Color(props.isDarkMode).border,
      borderRadius: 20,
      maxWidth: 400
    },
    modalTitle: {
      fontSize: FontSize.large,
      fontWeight: "bold",
      marginBottom: 5,
    },
    modalMessage: {
      fontSize: FontSize.default,
      marginBottom: 15
    },
    closeBtn: {
      flexDirection: 'row',
      justifyContent: 'flex-end',
    },
    buttonContainer: {
      margin: 10,
      marginBottom: props.mobile ? 10 : 0
    },
    space: {
      height: 30
    },
    msgButton: {
      padding: 10,
      borderRadius: Radius.round,
      backgroundColor: Color(props.isDarkMode).default
    },
    profileButton: {
      padding: 10,
      borderRadius: Radius.round,
      backgroundColor: Color(props.isDarkMode).gold
    },
    heartButton: {
      paddingVertical: 10,
      paddingHorizontal: 15,
      borderRadius: Radius.round,
    },
    deleteButton: {
      padding: 10,
      borderRadius: Radius.round,
      backgroundColor: Color(props.isDarkMode).danger
    },
    backIcon: {
      ...Platform.select({
        web: {
          outlineStyle: 'none'
        }
      }),
    },
    contactContent: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between'
    },
    customButton: {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 5
    },
    info: {
      marginTop: 5,
      flexDirection: 'row',
      alignItems: 'center'
    },
    myInfo: {
      width: '100%',

    },
    loadingScreen: {
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      flex: 1
    },
    innerContent: {
      padding: 10,
    }
  });

  if (!isLoaded) {
    return (
      <View style={styles.loadingScreen}>
        <ActivityIndicator
        size="large"
        color={Color(props.isDarkMode).gold}
        />
      </View>
    );
  }

  return (
    <View style={[styles.container, containerStyle()]}>
      <ScrollView style={styles.content}
      contentContainerStyle={styles.innerContent}
      refreshControl={
        <RefreshControl
        refreshing={refreshing}
        onRefresh={refresh}
        colors={[Color(props.isDarkMode).gold]}
        progressBackgroundColor={Color(props.isDarkMode).contentHolder}
        />
      }
      >
        <Swiper
          autoplay={true}
          autoplayTimeout={10}
          showsButtons={currentListing?.images?.length > 1}
          scrollEnabled={true}
          style={styles.swiper}
          showsPagination={false}
        >
          {currentListing.images.map((image: any, index: any) => (
            <View key={index}>
              <Image source={{ uri: image }} style={styles.image} />
              <View style={styles.positionBox}>
                <_Text style={styles.positionText}>
                  {index + 1}/{currentListing.images.length}
                </_Text>
              </View>
            </View>
          ))}
        </Swiper>

        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <View style={{ flex: 1 }}>
            <_Text
              isDarkMode={props.isDarkMode}
              style={styles.bigTitle}>
                {currentListing.name}
            </_Text>

            <_Text
              isDarkMode={props.isDarkMode}
              style={styles.price}>
                ${currentListing.price} / month
            </_Text>
          </View>

          <View>
            {!isMe ? (
              <TouchableOpacity
                onPress={toggleFavorite}
                underlayColor={Color(props.isDarkMode).holderUnderlay}
                activeOpacity={0.7}
                style={[
                  styles.heartButton,
                  { backgroundColor: favoriteBG() },
                ]}
              >
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                <Animated.View style={{ transform: [{ scale: heartScale }] }}>
                  <FontAwesomeIcon
                    size={20}
                    color={isFavorite ? Color(props.isDarkMode).danger : Color(props.isDarkMode).textTransparent}
                    style={styles.backIcon}
                    icon={faHeart}
                  ></FontAwesomeIcon>
                </Animated.View>


                  <_Text
                    style={{
                      color: Color(props.isDarkMode).text,
                      marginLeft: 5,
                      fontWeight: 'bold',
                      fontSize: FontSize.default
                    }}
                  >
                    Favorite
                  </_Text>
                </View>
              </TouchableOpacity>
            ) : (
              null
            )}
          </View>

        </View>


        <View style={styles.section}>
          <_Text
          isDarkMode={props.isDarkMode}
          style={styles.sectionHeader}
          >
            Property Details
          </_Text>

          <View style={styles.detailRow}>
            <FontAwesomeIcon
              icon={housingIcons[currentListing.housing_type]}
              size={FontSize.default}
              style={styles.detailIcon}
            />
            <_Text
            isDarkMode={props.isDarkMode}
            style={styles.detailValue}>
              {currentListing.housing_type}
            </_Text>
          </View>

          <View style={styles.detailRow}>
            <FontAwesomeIcon
              icon={faRuler}
              size={FontSize.default}
              style={styles.detailIcon}
            />
            <_Text
            isDarkMode={props.isDarkMode}
            style={styles.detailValue}>
              {currentListing.size} sqft
            </_Text>
          </View>

          <View style={styles.detailRow}>
            <FontAwesomeIcon
              icon={faBed}
              size={FontSize.default}
              style={styles.detailIcon}
            />
            <_Text isDarkMode={props.isDarkMode} style={styles.detailValue}>
              {currentListing.rooms} Bedroom{currentListing.rooms > 1 ? 's' : ''}
            </_Text>
          </View>

          <View style={styles.detailRow}>
            <FontAwesomeIcon
              icon={faBath}
              size={FontSize.default}
              style={styles.detailIcon}
            />
            <_Text isDarkMode={props.isDarkMode} style={styles.detailValue}>
              {currentListing.bathrooms} Bathroom{currentListing.bathrooms > 1 ? 's' : ''}
            </_Text>
          </View>

          <View style={styles.detailRow}>
            <FontAwesomeIcon
              icon={faPaw}
              size={FontSize.default}
              style={styles.detailIcon}
            />
            <_Text isDarkMode={props.isDarkMode} style={styles.detailValue}>
              {currentListing.petsAllowed ? "Pets Allowed" : "No Pets Allowed"}
            </_Text>
          </View>

          <View style={styles.detailRow}>
            <FontAwesomeIcon
              icon={faMapMarkerAlt}
              size={FontSize.default}
              style={styles.detailIcon}
            />
            <_Text isDarkMode={props.isDarkMode} style={styles.detailValue}>
              {currentListing.distanceToUcf} {currentListing.distanceToUcf === 1 ? "mile" : "miles"} from UCF
            </_Text>
          </View>
        </View>    
        <View style={styles.section}>
          <_Text
          isDarkMode={props.isDarkMode}
          style={styles.sectionHeader}
          >
            Overview
          </_Text>
          <_Text
          isDarkMode={props.isDarkMode}
          style={styles.description}>
            {currentListing.description}
          </_Text>    
        </View>  

        <>
        {isLoaded ?
        <View style={styles.section}>
          {isMe ? (
            <View>
              <_Text
              isDarkMode={props.isDarkMode}
              style={styles.sectionHeader}>
                Your Listing Options
              </_Text>
              <View style={styles.creatorContainer}>
                <View
                style={[styles.info, styles.myInfo]}
                >
                  <TouchableHighlight
                  underlayColor={Color(props.isDarkMode).defaultUnderlay}
                  style={[styles.msgButton, {marginRight: 5}]}
                  onPress={() => editListing()}
                  >
                    <View
                    style={styles.customButton}
                    >
                      <FontAwesomeIcon 
                      size={20} 
                      color={Color(props.isDarkMode).actualWhite} 
                      style={styles.backIcon} 
                      icon="pencil"
                      >
                      </FontAwesomeIcon>
                      <_Text
                      style={{color: Color(props.isDarkMode).actualWhite, marginLeft: 5}}
                      >
                        Edit
                      </_Text>
                    </View>
                  </TouchableHighlight>
                  <TouchableHighlight
                  underlayColor={Color(props.isDarkMode).dangerUnderlay}
                  style={styles.deleteButton}
                  onPress={() => setShowDeleteConfirmation(true)}
                  >
                    <View
                    style={styles.customButton}
                    >
                      <FontAwesomeIcon 
                      size={20} 
                      color={Color(props.isDarkMode).actualWhite} 
                      style={styles.backIcon} 
                      icon="trash"
                      >
                      </FontAwesomeIcon>
                      <_Text
                      style={{color: Color(props.isDarkMode).actualWhite, marginLeft: 5}}
                      >
                        Delete
                      </_Text>
                    </View>
                  </TouchableHighlight>
                </View>
              </View>
            </View>
        ) : (
          <View>
            <View
            style={styles.contactContent}
            >
              <_Text
                isDarkMode={props.isDarkMode}
                style={styles.sectionHeader}>
                  Owner Information
              </_Text>
            </View>
            <View style={styles.creatorContainer}>
              <Image
                source={{ uri: creator.image }}
                style={styles.creatorImage}
              />
              <View>
                <_Text
                style={[Style(props.isDarkMode).textDefault, {fontWeight: 'bold'}]}
                >
                  {creator.first_name} {creator.last_name}
                </_Text>
                <View
                style={styles.info}
                >
                  <TouchableHighlight
                  underlayColor={Color(props.isDarkMode).goldUnderlay}
                  style={[styles.profileButton, {marginRight: 5}]}
                  onPress={() => { navigation.navigate(NavTo.Profile, { profile: creator.id } as never) }}
                  >
                    <View
                    style={styles.customButton}
                    >
                      <FontAwesomeIcon 
                      size={20} 
                      color={Color(props.isDarkMode).actualWhite} 
                      style={styles.backIcon} 
                      icon="user"
                      >
                      </FontAwesomeIcon>
                      <_Text
                      style={{color: Color(props.isDarkMode).actualWhite, marginLeft: 5}}
                      >
                        Profile
                      </_Text>
                    </View>
                  </TouchableHighlight>
                  <TouchableHighlight
                  underlayColor={Color(props.isDarkMode).defaultUnderlay}
                  style={styles.msgButton}
                  onPress={() => {
                    props.setNavSelector(NavTo.Messages);
                    navigation.navigate(NavTo.Messages, {user: creator.id, requestId: generateRequestId()} as never);
                  }}
                  >
                    <View
                    style={styles.customButton}
                    >
                      <FontAwesomeIcon 
                      size={20} 
                      color={Color(props.isDarkMode).actualWhite} 
                      style={styles.backIcon} 
                      icon="message"
                      >
                      </FontAwesomeIcon>
                      <_Text
                      style={{color: Color(props.isDarkMode).actualWhite, marginLeft: 5}}
                      >
                        Message
                      </_Text>
                    </View>
                  </TouchableHighlight>
                </View>
              </View>
            </View>
          </View>
          )} 
        </View>
        : null }
        </>
        <View
        style={styles.space}
        >
        </View>
      </ScrollView>

      {showDeleteConfirmation && confirmationModal()}

      <View
      style={styles.buttonContainer}
      >
        <_Button
          onPress={() => onClose()}
          textStyle={Style(props.isDarkMode).buttonInvertedText}
          style={[Style(props.isDarkMode).buttonInverted]}
        >
          {"Back to Listings"}
        </_Button>
      </View>
    </View>
  );
};

export default ListingView;
