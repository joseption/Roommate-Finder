import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Platform } from 'react-native';
import _Text from '../control/text';
import { Color, Style } from '../../style';
import { env } from '../../helper';
import { authTokenHeader, getLocalStorage } from '../../helper';
import _Button from '../control/button';
import { ImagePickerResponse, launchCamera, launchImageLibrary } from 'react-native-image-picker';

const CreateListing = (props: any) => {

  const [userInfo, setUserInfo] = useState<any>();
  const [imageURL,setImageURL] = useState('');
  const [imageUri, setImageUri] = useState('');
  const [imageError,setImageError] = useState('');

  useEffect(() => {
    getUserInfo();
  }, [])
  
  const getUserInfo = async () => {
    setUserInfo(await getLocalStorage().then((res) => {return res.user}));
  }

  const [formData, setFormData] = useState({
    name: '',
    images: [''],
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
    setImageError('');
    if (res && res.assets) {
        if (Platform.OS === 'web') {
            if (res.assets[0].uri) {
                setImageUri(res.assets[0].uri);
            }
            else {
                setImageError("Photo could not be attached");
            }
        }
        else {
            if (res.assets[0].base64) {
                if (res.assets[0].uri) {
                    setImageURL(res.assets[0].uri);
                }
                setImageUri("data:image/jpeg;base64," + res.assets[0].base64);
            }
            else {
                setImageError("Photo could not be attached");
            }
        }
    }
    else if (res.errorCode)
        setImageError("A problem occurred while attaching your photo, please try again");
  }

  const uploadPhoto = async () => {
      launchImageLibrary({mediaType: 'photo', maxHeight: 1000, maxWidth: 1000, includeBase64: true}, (res) => {
          handleImage(res);
      });
  }

  const handleChange = (key: string, value: any) => {
    setFormData({
      ...formData,
      [key]: value,
    });
  };

  const handleSubmit = async () => {   
    try {
      await fetch(`${env.URL}/listings/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'authorization': await authTokenHeader(),
        },
        body: JSON.stringify(formData),
      })
        .then(async (ret) => {
          let res = await ret.json();
          console.log(res);
        });
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
  });

  return (
    <View style={styles.container}>
      <_Text style={styles.title}>Create Listing</_Text>
      <View style={styles.formContainer}>
        <View style={styles.photoButtonContainer}>
          <_Button
            isDarkMode={props.isDarkMode}
            onPress={(e: any) => uploadPhoto()}
            style={Style(props.isDarkMode).buttonDefault}
            //value={formData.images}
            >
              {Platform.OS === 'web' ? (imageUri || imageURL) ? 'Change Photo' : 'Upload Photo' : (imageUri || imageURL) ? 'Change' : 'Upload'}
              {/*handleChange('images', imageUri)*/}
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
          onChangeText={(text) => handleChange('price', text)}
          value={String(formData.price)}
          keyboardType="numeric"
        />
        <_Text style={styles.label}>Pets Allowed</_Text>
        <TextInput
          style={styles.input}
          onChangeText={(text) => handleChange('petsAllowed', text)}
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
          onChangeText={(text) => handleChange('bathrooms', text)}
          value={String(formData.bathrooms)}
          keyboardType="numeric"
        />
        <_Text style={styles.label}>Rooms</_Text>
        <TextInput
          style={styles.input}
          onChangeText={(text) => handleChange('rooms', text)}
          value={String(formData.rooms)}
          keyboardType="numeric"
        />
        <_Text style={styles.label}>Size</_Text>
        <TextInput
          style={styles.input}
          onChangeText={(text) => handleChange('size', text)}
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
          onChangeText={(text) => handleChange('distanceToUcf', text)}
          value={formData.distanceToUcf}
        />
        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <_Text style={styles.submitButtonText}>Submit</_Text>
        </TouchableOpacity>
        </View>
  </View>
  
)};

export default CreateListing;