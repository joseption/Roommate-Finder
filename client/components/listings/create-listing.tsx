import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Platform, FlatList } from 'react-native';
import _Text from '../control/text';
import { Color, Radius, Style } from '../../style';
import { env } from '../../helper';
import { authTokenHeader, getLocalStorage } from '../../helper';
import _Button from '../control/button';
import { ImagePickerResponse, launchCamera, launchImageLibrary } from 'react-native-image-picker';
import _Image from '../control/image';

const CreateListing = (props: any) => {

  const [userInfo, setUserInfo] = useState<any>();
  const [imageURLArray, setImageURLArray] = useState<string[]>([]);
  const [imageUriArray, setImageUriArray] = useState<string[]>([]);
  const [imageErrorArray, setImageErrorArray] = useState<string[]>([]);
  
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

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 16,
      backgroundColor: Color(props.isDarkMode).white,
    },
    input: {
      height: 50,
      marginVertical: 8,
      padding: 8,
      backgroundColor: Color(props.isDarkMode).grey,
      borderRadius: 8,
      fontSize: 16,
    },
    button: {
      backgroundColor: Color(props.isDarkMode).gold,
      height: 50,
      marginTop: 16,
      borderRadius: 8,
      alignItems: 'center',
      justifyContent: 'center',
    },
    buttonText: {
      color: Color(props.isDarkMode).white,
      fontSize: 16,
    },
    title: {
        fontSize: 16,
        marginVertical: 8,
      },
      formContainer: {
        padding: 20,
      },
      imagesContainer: {
        padding: 20,
      },
      label: {
        fontSize: 16,
        marginBottom: 10,
      },
      submitButton: {
        backgroundColor: Color(props.isDarkMode).gold,
        paddingVertical: 15,
        borderRadius: 5,
      },
      submitButtonText: {
        color: Color(props.isDarkMode).white,
        textAlign: 'center',
        fontWeight: 'bold',
      },
      photoButtonContainer: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center'
      },
      photoButton: {
        marginLeft: 5
      },
      image: {
        width: 125,
        height: 125,
        backgroundColor: Color(props.isDarkMode).white,
        borderColor: Color(props.isDarkMode).border,
        borderWidth: 1,
        marginBottom: 5,
    },
  });

  return (
    <View style={styles.container}>
      <_Text style={styles.title}>Create Listing</_Text>
      <View style={styles.formContainer}>
        <View style={styles.imagesContainer}>
          {getPhotos().map((photo, index) => (
            <_Image
              key={index}
              style={styles.image}
              source={Platform.OS === 'web' ? photo : { uri: photo }}
              height={125}
              width={125}
            />
          ))}
        </View>
        <View style={styles.photoButtonContainer}>
        <_Button
          isDarkMode={props.isDarkMode}
          onPress={(e: any) => { uploadPhotos() }}
          style={Style(props.isDarkMode).buttonDefault}
        >
          {'Upload Photos'}
        </_Button>           
        </View>
        <_Text style={styles.label}>Name</_Text>
        <TextInput
          style={styles.input}
          onChangeText={(text) => handleChange('name', text)}
          value={formData.name}
        />
        <_Text style={styles.label}>City</_Text>
        <TextInput
          style={styles.input}
          onChangeText={(text) => handleChange('city', text)}
          value={formData.city}
        />
        <_Text style={styles.label}>Housing Type</_Text>
        <TextInput
          style={styles.input}
          onChangeText={(text) => handleChange('housing_type', text)}
          value={formData.housing_type}
        />
        <_Text style={styles.label}>Description</_Text>
        <TextInput
          style={styles.input}
          onChangeText={(text) => handleChange('description', text)}
          value={formData.description}
        />
        <_Text style={styles.label}>Price</_Text>
        <TextInput
          style={styles.input}
          onChangeText={(text) => handleChange('price', parseFloat(text))}
          value={String(formData.price)}
          keyboardType="numeric"
        />
        <_Text style={styles.label}>Pets Allowed</_Text>
        <TextInput
          style={styles.input}
          onChangeText={(text) => handleChange('petsAllowed', Boolean(text))}
          value={String(formData.petsAllowed)}
        />
        <_Text style={styles.label}>Address</_Text>
        <TextInput
          style={styles.input}
          onChangeText={(text) => handleChange('address', text)}
          value={formData.address}
        />
        <_Text style={styles.label}>Bathrooms</_Text>
        <TextInput
          style={styles.input}
          onChangeText={(text) => handleChange('bathrooms', parseInt(text))}
          value={String(formData.bathrooms)}
          keyboardType="numeric"
        />
        <_Text style={styles.label}>Rooms</_Text>
        <TextInput
          style={styles.input}
          onChangeText={(text) => handleChange('rooms', parseInt(text))}
          value={String(formData.rooms)}
          keyboardType="numeric"
        />
        <_Text style={styles.label}>Size</_Text>
        <TextInput
          style={styles.input}
          onChangeText={(text) => handleChange('size', parseInt(text))}
          value={String(formData.size)}
          keyboardType="numeric"
        />
        <_Text style={styles.label}>Zipcode</_Text>
        <TextInput
          style={styles.input}
          onChangeText={(text) => handleChange('zipcode', text)}
          value={formData.zipcode}
        />
        <_Text style={styles.label}>Distance</_Text>
        <TextInput
          style={styles.input}
          onChangeText={(text) => handleChange('distanceToUcf', parseInt(text))}
          value={formData.distanceToUcf}
        />
        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <_Text style={styles.submitButtonText}>Submit</_Text>
        </TouchableOpacity>
        </View>
  </View>
  
)};

export default CreateListing;