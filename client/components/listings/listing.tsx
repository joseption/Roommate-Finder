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

const ListingView = (props: any) => {

  const {currentListing} = props;
  const [userInfo, setUserInfo] = useState<any>();
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
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
    console.log(isValidAddress)
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
              style={[Style(props.isDarkMode).buttonDefault, { margin: 5 }]}
            >
              Cancel
            </_Button>
            <_Button
              onPress={deleteListing}
              style={[Style(props.isDarkMode).buttonDanger, { margin: 5 }]}
            >
              Delete
            </_Button>
          </View>
        </View>
      </View>
    );
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
    }
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
                      style={[Style(props.isDarkMode).buttonGold, { margin: 5 }]}
                      onPress={() => {}}
                    >
                      {"Edit Listing"}
                    </_Button>
                    <_Button
                      style={[
                        Style(props.isDarkMode).buttonDanger,
                        { margin: 5 },
                      ]}
                      onPress={() => setShowDeleteConfirmation(true)}
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

      {showDeleteConfirmation && confirmationModal()}

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
