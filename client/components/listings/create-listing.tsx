import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Platform, FlatList} from 'react-native';
import _Text from '../control/text';
import { Color, Radius, Style } from '../../style';
import { env } from '../../helper';
import { authTokenHeader, getLocalStorage } from '../../helper';
import _Button from '../control/button';
import { ImagePickerResponse, launchCamera, launchImageLibrary } from 'react-native-image-picker';
import _Image from '../control/image';
import { ScrollView } from 'react-native-gesture-handler';
import _Dropdown from '../control/dropdown';
import axios from 'axios';

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
      userId: userInfo?.id,
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
    userId: userInfo?.id,
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
        [key]: [...formData[key], value],
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

      const response = await fetch(`${env.URL}/listings/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'authorization': await authTokenHeader(),
        },
        body: JSON.stringify(formData),
      });
      
        const createdListing = await response.json();
        console.log(createdListing)
        console.log(formData)
        return createdListing;

    } catch (err) {
      console.error(err);
    }
    
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

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 16,
      backgroundColor: Color(props.isDarkMode).white,
    },
    inputContainer: {
      backgroundColor: Color(props.isDarkMode).grey,
      borderRadius: 8,
      marginVertical: 8,
      padding: 8,
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
      fontSize: 20,
      marginBottom: 16,
      textAlign: 'center',
      color: Color(props.isDarkMode).black,
    },
    imagesContainer: {
      alignItems: 'center',
      flexDirection: 'row',
      justifyContent: 'center',
      marginVertical: 16,
    },
    image: {
      backgroundColor: Color(props.isDarkMode).white,
      borderColor: Color(props.isDarkMode).border,
      borderWidth: 1,
      height: 125,
      marginRight: 8,
      width: 125,
    },
    formContainer: {
      padding: 20,
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
    },
  });

  return (
    <View style={styles.container}>
      <_Text style={styles.title}>Create Listing</_Text>
      <ScrollView>
        <View style={styles.formContainer}>
          
          <View style={styles.imagesContainer}>
            {getPhotos().map((photo, index) => (
              <View key={index} style={styles.photoContainer}>
                <_Image
                  style={styles.image}
                  source={Platform.OS === 'web' ? photo : { uri: photo }}
                  height={125}
                  width={125}
                />
                <TouchableOpacity
                  style={styles.deleteButton}
                  onPress={() => handleDeletePhoto(index)}
                >
                  <_Text style={styles.deleteButtonText}>Delete</_Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
          <_Button
            isDarkMode={props.isDarkMode}
            onPress={(e: any) => { uploadPhotos() }}
            style={Style(props.isDarkMode).buttonDefault}
          >
            {'Upload Photos'}
          </_Button>

          <_Text style={styles.label}>Title</_Text>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              onChangeText={(text) => handleChange('name', text)}
              value={formData.name}
            />
          </View>

          <_Text style={styles.label}>Description</_Text>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              onChangeText={(text) => handleChange('description', text)}
              value={formData.description}
            />
          </View>
          
          <_Text style={styles.label}>City</_Text>
          <View style={styles.inputContainer}>
          
          <TextInput
            style={styles.input}
            onChangeText={(text) => handleChange('city', text)}
            value={formData.city}
          />
        </View>
        <_Text style={styles.label}>Housing Type</_Text>

          <_Dropdown
            isDarkMode={props.isDarkMode}
            options={getHousingType()}
            value={formData.housing_type}
            setValue={(text: string) => handleChange('housing_type', text)}
          />

        <_Text style={styles.label}>Price</_Text>
        <View style={styles.inputContainer}>
          
          <TextInput
            style={styles.input}
            onChangeText={(text) => handleChange('price', parseFloat(text))}
            value={String(formData.price)}
            keyboardType="numeric"
          />
        </View>


        <_Text style={styles.label}>Address</_Text>
        <View style={styles.inputContainer}>
          
          <TextInput
            style={styles.input}
            onChangeText={(text) => handleChange('address', text)}
            value={formData.address}
          />
        </View>

        <_Text style={styles.label}>Pets Allowed</_Text>

        
        <_Dropdown
            isDarkMode={props.isDarkMode}
            options={getYesNo()}
            value={formData.petsAllowed}
            setValue={(text: string) => handleChange('petsAllowed', text === 'Yes' ? true : false)}
          />
        

        <_Text style={styles.label}>Rooms</_Text>
        
          
          <_Dropdown
            isDarkMode={props.isDarkMode}
            options={getOptions()}
            value={formData.rooms}
            setValue={(text: string) => handleChange('rooms', parseInt(text))}
          />

        <_Text style={styles.label}>Bathrooms</_Text>
        
            <_Dropdown
              isDarkMode={props.isDarkMode}
              options={getOptions()}
              value={formData.bathrooms}
              setValue={(text: string) => handleChange('bathrooms', parseInt(text))}
            />

        <_Text style={styles.label}>Size</_Text>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            onChangeText={(text) => handleChange('size', parseInt(text))}
            value={String(formData.size)}
            keyboardType="numeric"
          />
        </View>
          <_Text style={styles.label}>Zipcode</_Text>
        <View style={styles.inputContainer}>
          
          <TextInput
            style={styles.input}
            onChangeText={(text) => handleChange('zipcode', text)}
            value={formData.zipcode}
          />
        </View>    
        <_Button
          isDarkMode={props.isDarkMode}
          onPress={() => {
            handleSubmit();
            props.onClose();
          }}
          style={Style(props.isDarkMode).buttonGold}
        >
          {'Submit'}
        </_Button>
      </View>
    </ScrollView>
  </View>
  )
};

export default CreateListing;