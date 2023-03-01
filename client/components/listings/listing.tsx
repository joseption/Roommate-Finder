import { ScrollView, StyleSheet, View, Image } from "react-native";
import { Color, FontSize, Radius, Style } from "../../style";
import { authTokenHeader, env, getLocalStorage} from "../../helper";
import _Button from "../control/button";
import _Image from "../control/image";
import _Text from "../control/text";
import { useState, useEffect } from "react";
import Swiper from "react-native-swiper/src";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faHome, faBuilding, faCity, faBed, faBath, faRuler, faPaw, faMapMarkerAlt} from "@fortawesome/free-solid-svg-icons";
import MapView, { Marker } from "react-native-maps";
import axios from "axios";

const ListingView = (props: any) => {

  const {currentListing} = props;
  const [userInfo, setUserInfo] = useState<any>();
  const [location, setLocation] = useState({ latitude: 0, longitude: 0 });

  const [creator, setCreator] = useState<{
    id: string;
    first_name: string;
    image: string;
  }>({ id: "", first_name: "", image: "" });
  
  const onClose = () => {
    props.setCurrentListing(null);
  };

  const housingIcons = {
    House: faHome,
    Apartment: faBuilding,
    Condo: faCity,
  };

  const getAddressLatLng = async (address: any, city: any, zipcode: any) => {
    const location = `${address}, ${city}, ${zipcode}`;
    const boundingBox = '24.396308,-81.786088,31.000652,-79.974309'; // bounding box for Florida
    const response = await axios.get(`https://www.mapquestapi.com/geocoding/v1/address?key=UM9XiqmIBZmifAAiq32yTgaLbUDWJGBS&location=${encodeURIComponent(location)}&boundingBox=${encodeURIComponent(boundingBox)}`);
    const lat = response.data.results[0].locations[0].latLng.lat;
    const lng = response.data.results[0].locations[0].latLng.lng;
    return { latitude: lat, longitude: lng };
  };

  const getUser = async (id: string) => {
    const tokenHeader = await authTokenHeader();
    return fetch(`${env.URL}/users/profile?userId=${id}`, {
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
          id: res.id,
          image: res.image,
        };
        setCreator(user);
      }
    });
  };

  const getUserInfo = async () => {
    setUserInfo(await getLocalStorage().then((res) => {return res.user}));
  };

  useEffect(() => {
    getUser(props.currentListing.userId);
  }, [props.currentListing]);

  useEffect(() => {
    getUserInfo();
  }, [userInfo?.id])

  useEffect(() => {
    getAddressLatLng(currentListing.address, currentListing.city, currentListing.zipcode)
      .then((location) => setLocation(location));
  }, [currentListing.address, currentListing.city, currentListing.zipcode]);

  const isOwner = creator.id === userInfo?.id;

  const styles = StyleSheet.create({
    container: {
      height: "100%",
    },
    content: {
      padding: 10,
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
      alignItems: "center",
      marginTop: 20,
      marginBottom: 0,
    },

    creatorImage: {
      width: 100,
      height: 100,
      borderRadius: 50,
      marginRight: 20,
      borderWidth: 2,
      borderColor: Color(props.isDarkMode).border,
      shadowColor: Color(props.isDarkMode).shadow,
      shadowOpacity: 0.5,
      shadowRadius: 2,
      elevation: 2,
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
      marginBottom: 10,
      color: Color(props.isDarkMode).text,
    },
    value: {
      fontSize: FontSize.default,
      color: Color(props.isDarkMode).text,
    },
    section: {
      marginTop: 10,
      borderColor: Color(props.isDarkMode).border,
      borderWidth: 1,
      borderRadius: Radius.default,
      padding: 10,
    },
    detailRow: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 5,
    },
    detailLabel: {
      flex: 1,
      fontSize: FontSize.default,
      color: Color(props.isDarkMode).text,
    },
    detailValue: {
      flex: 1,
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
      fontStyle: "italic",
      color: "#555",
    },
    price: {
      fontSize: FontSize.large,
      fontWeight: "bold",
      color: Color(props.isDarkMode).black,
      flexDirection: "row",
      alignItems: "center",
    },
    bigTitle: {
      fontSize: FontSize.huge,
      fontWeight: "bold",
      marginTop: 10,
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
  });

  return (
    <View style={styles.container}>
      <ScrollView style={styles.content}>
        <Swiper
          autoplay={true}
          showsButtons={true}
          scrollEnabled={true}
          style={styles.swiper}
          showsPagination={false}
        >
          {currentListing.images.map((image, index) => (
            <View key={index}>
              <_Image source={{ uri: image }} style={styles.image} />
              <View style={styles.positionBox}>
                <_Text style={styles.positionText}>
                  {index + 1}/{currentListing.images.length}
                </_Text>
              </View>
            </View>
          ))}
        </Swiper>

        <_Text isDarkMode={props.isDarkMode} style={styles.bigTitle}>
          {currentListing.name}
        </_Text>

        <View style={styles.price}>
          <_Text isDarkMode={props.isDarkMode} style={styles.dollarSign}>
            $
          </_Text>
          <_Text isDarkMode={props.isDarkMode} style={styles.price}>
            {currentListing.price}
          </_Text>

          <_Text isDarkMode={props.isDarkMode} style={styles.perMonth}>
            {"/month"}
          </_Text>
        </View>

        <_Text isDarkMode={props.isDarkMode} style={styles.description}>
          {currentListing.description}
        </_Text>

        <View style={styles.section}>
          <_Text isDarkMode={props.isDarkMode} style={styles.sectionHeader}>
            Property Details
          </_Text>

          <View style={styles.detailRow}>
            <FontAwesomeIcon
              icon={housingIcons[currentListing.housing_type]}
              size={FontSize.default}
              style={styles.detailIcon}
            />
            <_Text isDarkMode={props.isDarkMode} style={styles.detailValue}>
              {currentListing.housing_type}
            </_Text>
          </View>

          <View style={styles.detailRow}>
            <FontAwesomeIcon
              icon={faRuler}
              size={FontSize.default}
              style={styles.detailIcon}
            />
            <_Text isDarkMode={props.isDarkMode} style={styles.detailValue}>
              {currentListing.size} sq ft
            </_Text>
          </View>

          <View style={styles.detailRow}>
            <FontAwesomeIcon
              icon={faBed}
              size={FontSize.default}
              style={styles.detailIcon}
            />
            <_Text isDarkMode={props.isDarkMode} style={styles.detailValue}>
              {currentListing.rooms} Bedrooms
            </_Text>
          </View>

          <View style={styles.detailRow}>
            <FontAwesomeIcon
              icon={faBath}
              size={FontSize.default}
              style={styles.detailIcon}
            />
            <_Text isDarkMode={props.isDarkMode} style={styles.detailValue}>
              {currentListing.bathrooms} Bathrooms
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

        {/*
        <View>
          <MapView style={styles.map} region={{ latitude: location.latitude, longitude: location.longitude, latitudeDelta: 0, longitudeDelta: 0 }}>
            <Marker coordinate={{ latitude: location.latitude, longitude: location.longitude }} />
          </MapView>
        </View>
        */}

        <View style={styles.section}>
        <_Text isDarkMode={props.isDarkMode} style={styles.sectionHeader}>
          {isOwner ? "Your Information" : "Creator Information"}
        </_Text>

        {isOwner ? (
          <View style={styles.creatorContainer}>
          <_Image source={{ uri: creator.image }} style={styles.creatorImage} />
          <View style={{ flex: 1 }}>
            <View style={styles.messageButton}>
              <View style={{ flexDirection: "row" }}>
                <_Button
                  style={[Style(props.isDarkMode).buttonGold,{margin:5}]}
                  onPress={()=>{}}
                >
                  {"Edit Listing"}
                </_Button>
                <_Button
                  style={[Style(props.isDarkMode).buttonDanger,{margin:5}]}
                  onPress={()=>{}}
                >
                  {"Delete Listing"}
                </_Button>
              </View>
            </View>
          </View>
        </View>
        
        ) : (
          <View style={styles.creatorContainer}>
            <_Image
              source={{ uri: creator.image }}
              style={styles.creatorImage}
            />
            <View>
              <View style={styles.messageButton}>
                <_Button
                  onPress={() => {}}
                  style={[Style(props.isDarkMode).buttonDefault,{margin:10}]}
                >
                  {"Message " + creator.first_name}
                </_Button>
              </View>
            </View>
          </View>
        )}
      </View>

      </ScrollView>
      <View>
        <_Button
          onPress={() => onClose()}
          style={[Style(props.isDarkMode).buttonDefault,{margin:10}]}
        >
          {"Go Back"}
        </_Button>
      </View>
    </View>
  );
};

export default ListingView;
