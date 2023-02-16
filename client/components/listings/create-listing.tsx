import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Platform, FlatList, Pressable} from 'react-native';
import _Text from '../control/text';
import { Color, FontSize, Radius, Style } from '../../style';
import { env } from '../../helper';
import { authTokenHeader, getLocalStorage } from '../../helper';
import _Button from '../control/button';
import { ImagePickerResponse, launchCamera, launchImageLibrary } from 'react-native-image-picker';
import _Image from '../control/image';
import { ScrollView } from 'react-native-gesture-handler';
import _Dropdown from '../control/dropdown';
import axios from 'axios';
import _TextInput from '../control/text-input';
import _Group from '../control/group';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
const CreateListing = (props: any) => {

  const [userInfo, setUserInfo] = useState<any>();
  const [imageURLArray, setImageURLArray] = useState<string[]>([]);
  const [imageUriArray, setImageUriArray] = useState<string[]>([]);
  const [imageErrorArray, setImageErrorArray] = useState<string[]>([]);
  const [isCalculating, setIsCalculating] = useState(false);
  
  useEffect(() => {
    getUserInfo();
    setFormData({
      ...formData,
    }); 
  }, [userInfo?.id])

  const getUserInfo = async () => {
    setUserInfo(await getLocalStorage().then((res) => {return res.user}));
  };

  const [formData, setFormData] = useState({
    name: '',
    images: [],
    city: '',
    housing_type: '',
    description: '',
    price: 0.0,
    petsAllowed: false,
    address: '',
    bathrooms: 0,
    rooms: 0,
    size: 0,
    zipcode: '',
    distanceToUcf: 0,
  });

  
  const handleImage = (res: ImagePickerResponse) => {
    setImageErrorArray([]);
    if (res && res.assets) {
      res.assets.forEach((asset) => {
        setImageErrorArray((prev) => {
          const newArray = [...prev, ''];
          return newArray.filter(Boolean) as string[];
        });
        if (Platform.OS === 'web') {
          if (asset.uri) {
            setImageUriArray((prev) => {
              const newArray = [...prev, asset.uri];
              return newArray.filter(Boolean) as string[];
            });
            handleChange('images', asset.uri);
          } else {
            setImageErrorArray((prev) => {
              const newArray = [...prev, "Photo could not be attached"];
              return newArray.filter(Boolean) as string[];
            });
          }
        } else {
          if (asset.base64) {
            if (asset.uri) {
              setImageURLArray((prev) => {
                const newArray = [...prev, asset.uri];
                return newArray.filter(Boolean) as string[];
              });
            }
            setImageUriArray((prev) => {
              const newArray = [...prev, "data:image/jpeg;base64," + asset.base64];
              return newArray.filter(Boolean) as string[];
            });
            handleChange('images', asset.uri);
          } else {
            setImageErrorArray((prev) => {
              const newArray = [...prev, "Photo could not be attached"];
              return newArray.filter(Boolean) as string[];
            });
          }
        }
      });
    } else if (res.errorCode) {
      setImageErrorArray((prev) => {
        const newArray = [...prev, "A problem occurred while attaching your photo, please try again"];
        return newArray.filter(Boolean) as string[];
      });
    }
  };
  

  const uploadPhotos = async () => {
    launchImageLibrary({ mediaType: 'photo', maxHeight: 1000, maxWidth: 1000, includeBase64: true, multiple: true }, (res) => {
      handleImage(res);
    });
  };

  const getPhotos = () => {
    if (Platform.OS === 'web') {
      return imageUriArray;
    } else {
      return imageURLArray;
    }
  };

  const handleChange = (key: string, value: any) => {
    if (key === 'images') {
      setFormData({
        ...formData,
        [key]: [...formData[key], value as never],
      });
    } else {
      setFormData({
        ...formData,
        [key]: value,
      });
    }
  };


  const handleSubmit = async () => { 
    try {
      let auth = await authTokenHeader();
      await fetch(`${env.URL}/listings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'authorization': auth,
        },
        body: JSON.stringify(formData),
      }).then(async ret => {
        let res = JSON.parse(await ret.text());
        if (!res.Error) {
          console.log(formData)
          return true;
        }
        console.log(res);
      });
    } catch (err) {
      console.error(err);
    }  
    return false;
  };  

  const getOptions = () => {
    return [
      { key: 1, value: '1' },
      { key: 2, value: '2' },
      { key: 3, value: '3' },
      { key: 4, value: '4' },
    ];
  };

  const getHousingType = () => {
    return [
      { key: 1, value: 'Apartment' },
      { key: 2, value: 'House' },
      { key: 3, value: 'Condo' },
    ];
  };

  const getYesNo = () => {
    return [
      { key: true, value: 'Yes' },
      { key: false, value: 'No' },
    ];
  };

  const handleDeletePhoto = (index: number) => {
    let updatedImages = [...formData.images];
    updatedImages.splice(index, 1);
    setFormData({
      ...formData,
      images: updatedImages,
    });
  
    let updatedImageURLArray = [...imageURLArray];
    updatedImageURLArray.splice(index, 1);
    setImageURLArray(updatedImageURLArray);
  
    let updatedImageUriArray = [...imageUriArray];
    updatedImageUriArray.splice(index, 1);
    setImageUriArray(updatedImageUriArray);
  };

  useEffect(() => {
    calculateDistance();
  },[formData.address, formData.zipcode, formData.city]);

  const compareDistances = (UCF_latitude: number, UCF_longitude: number, listing_latitude: number, listing_longitude: number) => {
    
    const earth_radius = 3963; 
    const UCF_latitude_radians = UCF_latitude * Math.PI / 180;
    const listing_latitude_radians = listing_latitude * Math.PI / 180;
    const change_in_latitude = (listing_latitude - UCF_latitude) * Math.PI / 180;
    const change_in_longitude = (listing_longitude - UCF_longitude) * Math.PI / 180;

    /* Used something called Haversine Formula, basically it finds the distance of two points on a sphere */
    const math = Math.pow(Math.sin(change_in_latitude / 2), 2) +
      Math.cos(UCF_latitude_radians) * Math.cos(listing_latitude_radians) *
      Math.pow(Math.sin(change_in_longitude / 2), 2);

    const result = 2 * Math.asin(Math.sqrt(math));
    const distance = earth_radius * result;

    return distance;
  }

  const calculateDistance = async () => {

    if (!formData.address || !formData.zipcode || !formData.city || isCalculating) {
      return;
    }
    setIsCalculating(true);
    const address = formData.address.replace(/\s/g, "%20")
    const response = await axios.get(`https://www.mapquestapi.com/geocoding/v1/address?key=UM9XiqmIBZmifAAiq32yTgaLbUDWJGBS&location=${address},${formData.city},${formData.zipcode}`);
    console.log(response)
    const listingData = response.data.results[0].locations[0].latLng;
    const UCF = { lat: 28.602427, lng: -81.200058 };
    let distanceToUcf;
    if (!listingData) {
      console.error("Location not found");
      setFormData({ ...formData, distanceToUcf: 0 });
      setIsCalculating(false);
      return;
    }
    distanceToUcf = Math.round(compareDistances(UCF.lat, UCF.lng, listingData.lat, listingData.lng));
    console.log(distanceToUcf)
    setFormData({ ...formData, distanceToUcf });
    setIsCalculating(false);
  };

  const createListing = async () => {
    let res = await handleSubmit();
    if (res) {
      props.onClose();
    }
  }

  const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    inputContainer: {
      backgroundColor: Color(props.isDarkMode).grey,
      borderRadius: 8,
      marginVertical: 8,
      padding: 8,
    },
    inputContainerStyle: {
      paddingTop: 5,
      paddingBottom: 5
    },
    input: {
      fontSize: 16,
      height: 50,
    },
    button: {
      alignItems: 'center',
      backgroundColor: Color(props.isDarkMode).gold,
      borderRadius: 8,
      height: 50,
      justifyContent: 'center',
      marginTop: 16,
    },
    buttonText: {
      color: Color(props.isDarkMode).white,
      fontSize: 16,
    },
    title: {
      margin: 10,
      textAlign: 'center',
      fontFamily: 'Inter-SemiBold',
      fontSize: FontSize.large,
      color: Color(props.isDarkMode).titleText
    },
    imagesContainer: {
      alignItems: 'center',
      flexDirection: 'row',
      justifyContent: 'center',
      marginVertical: 16,
    },
    image: {
      backgroundColor: Color(props.isDarkMode).actualWhite,
      borderColor: Color(props.isDarkMode).separator,
      borderWidth: 1,
      height: 125,
      width: 125,
      borderRadius: Radius.default
    },
    formContainer: {
      paddingLeft: 10,
      paddingRight: 10,
      paddingBottom: 10
    },
    label: {
      fontSize: 16,
      marginTop: 10,
      color: Color(props.isDarkMode).black,
    },
    submitButton: {
      backgroundColor: Color(props.isDarkMode).gold,
      borderRadius: 5,
      paddingVertical: 15,
      textAlign: 'center',
    },
    submitButtonText: {
      color: Color(props.isDarkMode).white,
      fontWeight: 'bold',
      textAlign: 'center',
    },
    deleteButton: {
      backgroundColor: Color(props.isDarkMode).black,
      padding: 8,
      borderRadius: 8,
      alignSelf: 'flex-end',
    },
    deleteButtonText: {
      color: Color(props.isDarkMode).white,
      fontSize: 16,
    },
    photoContainer: {
      position: 'relative',
      margin: 5
    },
    imageContainer: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      paddingTop: 10,
      paddingBottom: 15,
      paddingLeft: 5,
      paddingRight: 5,
      marginBottom: 15,
    },
    photoContent: {
      flexWrap: 'wrap',
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
    },
    deleteIcon: {
      ...Platform.select({
          web: {
              outlineStyle: 'none'
          }
      }),
      position: 'absolute',
      top: 0,
      right: 0
    },
    deleteButtonContainer: {
      position: 'absolute',
      top: 0,
      right: 0,
      padding: 1
    },
    defaultImage: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    },
    holderImage: {
        width: 100,
        height: 100,
        backgroundColor: Color(props.isDarkMode).white,
        borderColor: Color(props.isDarkMode).separator,
        borderWidth: 1,
        borderRadius: Radius.default,
        margin: 5
      },
      holderImageIcon: {
        ...Platform.select({
            web: {
                outlineStyle: 'none'
            }
        }),
        alignItems: 'center',
        justifyContent: 'center',
        display: 'flex'
      },
      holderImages: {
        flexDirection: 'row',
        flexWrap: 'wrap'
      },
      photoHoldingContainer: {
        marginBottom: 10
      },
      deleteIconShadow: {
        right: -2,
      },
      submitContainer: {
        paddingTop: 10,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        paddingBottom: 5
      }
  });

  return (
    <View style={styles.container}>
      <_Text style={styles.title}>Create Listing</_Text>
      <ScrollView>
        <View style={styles.formContainer}>
          <_Group
                isDarkMode={props.isDarkMode}
                vertical={true}
                style={styles.imageContainer}
                >
            <View
            style={styles.photoHoldingContainer}
            >
              {!getPhotos() || getPhotos().length == 0 ?
              <View
              style={styles.holderImages}
              >
                <View
                style={[styles.holderImage, styles.defaultImage]}
                >
                    <FontAwesomeIcon
                    style={styles.holderImageIcon}
                    size={40} color={Color(props.isDarkMode).userIcon}
                    icon="bed"
                    >
                    </FontAwesomeIcon>
                </View>
                <View
                style={[styles.holderImage, styles.defaultImage]}
                >
                    <FontAwesomeIcon
                    style={styles.holderImageIcon}
                    size={40} color={Color(props.isDarkMode).userIcon}
                    icon="tree-city"
                    >
                    </FontAwesomeIcon>
                </View>
                <View
                style={[styles.holderImage, styles.defaultImage]}
                >
                    <FontAwesomeIcon
                    style={styles.holderImageIcon}
                    size={40} color={Color(props.isDarkMode).userIcon}
                    icon="sink"
                    >
                    </FontAwesomeIcon>
                </View>
              </View>
              :
              <View
              style={styles.photoContent}
              >
              {getPhotos().map((photo, index) => (
                <View key={index} style={styles.photoContainer}>
                  <_Image
                    style={styles.image}
                    source={Platform.OS === 'web' ? photo : { uri: photo }}
                    height={100}
                    width={100}
                  />
                  <Pressable
                  style={styles.deleteButtonContainer}
                  onPress={(e: any) => handleDeletePhoto(index)}
                  >
                      <View>
                        <FontAwesomeIcon 
                        size={26} 
                        color={Color(props.isDarkMode).actualBlack} 
                        icon="close"
                        style={[styles.deleteIcon, styles.deleteIconShadow]}
                        >
                        </FontAwesomeIcon>
                        <FontAwesomeIcon 
                        size={25} 
                        color={Color(props.isDarkMode).actualWhite} 
                        icon="close"
                        style={styles.deleteIcon}
                        >
                        </FontAwesomeIcon>
                      </View>
                  </Pressable>
                </View>
              ))}
              </View>
            }
            </View>
            <_Button
            isDarkMode={props.isDarkMode}
            onPress={(e: any) => { uploadPhotos() }}
            style={Style(props.isDarkMode).buttonDefault}
            >
            {'Upload Photos'}
          </_Button>
          </_Group>
          <_TextInput
            containerStyle={styles.inputContainerStyle}
            onChangeText={(text: any) => handleChange('name', text)}
            value={formData.name}
            label="Title"
            isDarkMode={props.isDarkMode}
          />

          <_TextInput
            containerStyle={styles.inputContainerStyle}
            onChangeText={(text: any) => handleChange('description', text)}
            value={formData.description}
            multiline={true}
            label="Description"
            height={100}
            isDarkMode={props.isDarkMode}
          />
          
          <_TextInput
            containerStyle={styles.inputContainerStyle}
            onChangeText={(text: any) => handleChange('city', text)}
            value={formData.city}
            label="City"
            isDarkMode={props.isDarkMode}
          />

          <_Dropdown
            containerStyle={styles.inputContainerStyle}
            isDarkMode={props.isDarkMode}
            options={getHousingType()}
            value={formData.housing_type}
            setValue={(text: string) => handleChange('housing_type', text)}
            label="Housing Type"
          />
          
          <_TextInput
            containerStyle={styles.inputContainerStyle}
            style={styles.input}
            onChangeText={(text: any) => handleChange('price', parseFloat(text))}
            value={String(formData.price)}
            keyboardType="numeric"
            label="Price"
            isDarkMode={props.isDarkMode}
          />
          <_TextInput
            containerStyle={styles.inputContainerStyle}
            style={styles.input}
            onChangeText={(text: any) => handleChange('address', text)}
            value={formData.address}
            label="Address"
            isDarkMode={props.isDarkMode}
          />

          <_Dropdown
            containerStyle={styles.inputContainerStyle}
            isDarkMode={props.isDarkMode}
            options={getYesNo()}
            value={formData.petsAllowed}
            setValue={(text: string) => handleChange('petsAllowed', text === 'Yes' ? true : false)}
            label="Pets Allowed"
          />
          
          <_Dropdown
            containerStyle={styles.inputContainerStyle}
            isDarkMode={props.isDarkMode}
            options={getOptions()}
            value={formData.rooms}
            setValue={(text: string) => handleChange('rooms', parseInt(text))}
            label="Rooms"
          />

          <_Dropdown
            containerStyle={styles.inputContainerStyle}
            isDarkMode={props.isDarkMode}
            options={getOptions()}
            value={formData.bathrooms}
            setValue={(text: string) => handleChange('bathrooms', parseInt(text))}
            label="Bathrooms"
          />

          <_TextInput
            containerStyle={styles.inputContainerStyle}
            style={styles.input}
            onChangeText={(text: any) => handleChange('size', parseInt(text))}
            value={String(formData.size)}
            keyboardType="numeric"
            label="Size"
            isDarkMode={props.isDarkMode}
          />

          <_TextInput
            containerStyle={styles.inputContainerStyle}
            style={styles.input}
            onChangeText={(text: any) => handleChange('zipcode', text)}
            keyboardType="numeric"
            value={formData.zipcode}
            isDarkMode={props.isDarkMode}
            label="Zip Code"
          />
        <View
        style={styles.submitContainer}
        >
          <_Button
            isDarkMode={props.isDarkMode}
            onPress={() => {
              createListing();
            }}
            style={[Style(props.isDarkMode).buttonGold]}
          >
            {'Create Listing'}
          </_Button>
        </View>
      </View>
    </ScrollView>
  </View>
  )
};

export default CreateListing;