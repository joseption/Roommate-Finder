import React, { useEffect, useState } from 'react';
import { View, Alert, StyleSheet, TextInput, TouchableOpacity, Platform, FlatList, Pressable} from 'react-native';
import _Text from '../control/text';
import { Color, FontSize, Radius, Style } from '../../style';
import { env, Listings_Screen } from '../../helper';
import { authTokenHeader, getLocalStorage } from '../../helper';
import _Button from '../control/button';
import { ImagePickerResponse, launchCamera, launchImageLibrary } from 'react-native-image-picker';
import _Image from '../control/image';
import { ScrollView } from 'react-native-gesture-handler';
import _Dropdown from '../control/dropdown';
import _TextInput from '../control/text-input';
import _Group from '../control/group';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';

const CreateListing = (props: any) => {

  const [userInfo, setUserInfo] = useState<any>();
  const [imageURLArray, setImageURLArray] = useState<string[]>([]);
  const [imageUriArray, setImageUriArray] = useState<string[]>([]);
  const [imageError, setImageError] = useState('');
  const [isLocationNotFound, setIsLocationNotFound] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isDone, setIsDone] = useState(false);
  const [error, setError] = useState('');
  const [prompt, setPrompt] = useState(false);
  const [dirty, setDirty] = useState(false);
  const [deleteImageURLs, setDeleteImageURLs] = useState<string[]>([]);
  
  useEffect(() => {
    getUserInfo();
  }, [userInfo?.id])

  useEffect(() => {
    if (props.isManualNavigate) {
      cancel();
    }
  }, [props.isManualNavigate])

  useEffect(() => {
    if (props.currentScreen === Listings_Screen.create && props.currentListing) {
      setFormData(props.currentListing);
      setImageURLArray(props.currentListing.images);

      if (Platform.OS !== 'web') {
        // Bluff secondary array for index offset
        let uris = [];
        for (let i = 0; i < props.currentListing.images.length; i++) {
          uris.push("");
        }
        setImageUriArray(uris);
      }
      else {
        setImageUriArray(props.currentListing.images);
      }

      setTimeout(() => {
        setDirty(false);
      }, 0);
    }
  }, [props.currentScreen])

  const getUserInfo = async () => {
    setUserInfo(await getLocalStorage().then((res) => {return res.user}));
  };

  const [formData, setFormData] = useState({
    name: '',
    city: '',
    housing_type: '',
    description: '',
    price: 0.0,
    petsAllowed: undefined,
    address: '',
    bathrooms: 0,
    rooms: 0,
    size: 0,
    zipcode: '',
    images: [],
    deleteImages: []
  });

  
  const handleImage = (res: ImagePickerResponse) => {
    setError('');
    setImageError('');
    let UriImages = [] as string[];
    let UrlImages = [] as string[];
    if (res && res.assets) {
      res.assets.forEach((asset) => {
        if (Platform.OS === 'web') {
          if (asset.uri) {
            UriImages.push(asset.uri);
            setDirty(true);
          } else {
            setImageError("Photo could not be attached");
          }
        } else {
          if (asset.base64) {
            if (asset.uri) {
              UrlImages.push(asset.uri);
              setDirty(true);
            }
            UriImages.push("data:image/jpeg;base64," + asset.base64);
          } else {
            setImageError("Photo could not be attached");
          }
        }
      });
    } else if (res.errorCode) {
      setImageError("A problem occurred while attaching your photo, please try again");
    }

    if (UriImages.length > 0) {
      setImageUriArray(imageUriArray.concat(UriImages));
    }
    if (UrlImages.length > 0) {
      setImageURLArray(imageURLArray.concat(UrlImages));
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
    setDirty(true);
    setFormData({
      ...formData,
      [key]: value,
    });
  };

  const containerStyle = () => {
    var container = Color(props.isDarkMode).contentBackground;
    var padding = 20;
    var borderRadius = Radius.large;
    var borderColor = Color(props.isDarkMode).border;
    var borderWidth = 1;
    var marginBottom = 0;
    var marginTop = 10;
    var flex = 1;
    if (props.mobile) {
        padding = 0;
        borderRadius = 0;
        borderWidth = 0;
        marginTop = 0;
        container = Color(props.isDarkMode).contentBackgroundSecondary;
    }
    else {
      marginBottom = 20
    }

    return {
        padding: padding,
        borderRadius: borderRadius,
        borderColor: borderColor,
        borderWidth: borderWidth,
        backgroundColor: container,
        flex: flex,
        marginBottom: marginBottom,
        marginTop: marginTop,
    }
  }

  const getCleanURIList = () => {
    let uris: any[] = [];
    if (Platform.OS !== 'web') {
      imageUriArray.forEach((x: any) => {
        if (x.trim()) {
          uris.push(x);
        }
      });
    }
    else {
      for (let i = 0; i < imageUriArray.length; i++) {
        if (!imageUriArray[i].startsWith('http'))
          uris.push(imageUriArray[i]);
      }
    }
    return uris;
  }


  const handleSubmit = async () => { 
    setError('');
    setIsLoading(true);
    let hasError = false;
    setIsLocationNotFound(false);
    formData.images = getCleanURIList() as never;
    let listing = "";
    let method = "POST";
    if (props.currentListing) {
      listing = "/" + props.currentListing.id;
      method = "PUT";
      formData.deleteImages = deleteImageURLs as never;
    }

    try {
      let auth = await authTokenHeader();
      await fetch(`${env.URL}/listings${listing}`, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
          'authorization': auth,
        },
        body: JSON.stringify(formData),
      }).then(async ret => {
        let res = JSON.parse(await ret.text());
        if (res.Error) {
          hasError = true;
        }
      });
    } catch (err) {
      hasError = true;
    }  
    setIsLoading(false);
    return hasError;
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
    setDirty(true);
    let updatedImageURLArray = [...imageURLArray];
    let url = updatedImageURLArray.splice(index, 1);
    setImageURLArray(updatedImageURLArray);
  
    let updatedImageUriArray = [...imageUriArray];
    updatedImageUriArray.splice(index, 1);
    setImageUriArray(updatedImageUriArray);

    if (props.currentListing && url[0] && url[0].startsWith("http")) {
      let updatedDeleteImageURLs = [...deleteImageURLs];
      updatedDeleteImageURLs.push(url[0]);
      setDeleteImageURLs(updatedDeleteImageURLs);
    }

    setFormData({
      ...formData,
      images: updatedImageUriArray as never[],
    });
  };

  const close = () => {
    if (props.isManualNavigate) {
      props.isManualNavigate?.action();
      props.setIsManualNavigate(null);
    } 
    else { 
      if (props.currentListing) 
        props.setCurrentScreen(Listings_Screen.favorites);
      else {
        props.setCurrentScreen(Listings_Screen.all);
      }
    }
  }

  const createListing = async () => {
    let hasError = await handleSubmit();
    setIsLoading(false);
    if (!hasError) {
      if (props.currentListing) {
        props.refreshListing?.getSingleListing();
      }
      setIsDone(true);
      props.onClose();
      props.refresh();
    }
    else {
      setError("A server error occurred, please try again")
    }
  }

  const checkAddressValidity = async (address: string) => {
    setIsLoading(true);
    let hasError = false;
    try
    {   
      let obj = {address: address};
      let js = JSON.stringify(obj);
      let tokenHeader = await authTokenHeader();
      await fetch(`${env.URL}/listings/location`,
      {method:'POST',body:js,headers:{'Content-Type': 'application/json', 'authorization': tokenHeader}}).then(async ret => {
      let res = JSON.parse(await ret.text());
      if (res.Error)
        {
          hasError = true;
        }
        else
        {
          const locationsInFlorida = res.results[0].locations.filter((location: { adminArea3: string; }) => {
            return location.adminArea3 === 'FL';
          });
      
          if (locationsInFlorida.length > 0) {
            return;
          } else {
            hasError = true;
          }
        }
      });
    }
    catch(e)
    {
      hasError = true;
    }  
    setIsLoading(false);
    return !hasError;
  };

  const handleSubmitListing = async () => {

    const validAddress = await checkAddressValidity(formData.address + ", " + formData.city + ", FL " + formData.zipcode);
    
    if (validAddress) {
      createListing();
    } else {
      setIsLoading(false);
      setIsLocationNotFound(true);
    }
  };

  const dialogStyle = () => {
    let style = [];
    style.push({backgroundColor: !props.isDarkMode ? Color(props.isDarkMode).holderMask : Color(props.isDarkMode).promptMaskMobile});
    return style;
  }

  const disabled = () => {
    if (props.currentListing && !dirty) {
      return true;
    }
    if (isDone) {
      return true;
    }
    let formDataFilled = formData.address && formData.bathrooms && formData.city && formData.description && formData.housing_type && (imageUriArray.length > 0 || imageURLArray.length > 0) && formData.name && formData.petsAllowed != undefined && formData.price && formData.rooms && formData.zipcode;
    return !formDataFilled;
  }

  const errorStyle = () => {
    var style = [];
    style.push(Style(props.isDarkMode).textDanger);
    if (props.mobile)
      style.push(Style(props.isDarkMode).errorText);        
    return style;
  }

  const errorContainerStyle = () => {
    var style = [];
    if (props.mobile) {
        style.push(Style(props.isDarkMode).errorMsgMobile);
    }
    else {
        style.push(Style(props.isDarkMode).errorMsg);
    }
    return style;
  }

  const cancel = () => {
    if (dirty) {
      setPrompt(true);
    }
    else {
      props.setIsManualNavigate(null);
      close();
    }
  }

  const cancelPrompt = () => {
    setPrompt(false);
    if (props.isManualNavigate) {
      props.setIsManualNavigate(null);
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
      margin: props.mobile ? 10 : 0,
      textAlign: 'center',
      fontWeight: 'bold',
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
      height: 100,
      width: 100,
      borderRadius: Radius.default
    },
    formContainer: {
      paddingLeft: props.mobile ? 10 : 0,
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
      flexGrow: 0,
    },
    photoContentContainer: {
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
    },
    deleteButtonContainer: {
      position: 'absolute',
      top: 0,
      right: 0,
    },
    deleteIconContainer: {
      padding: 1,
      backgroundColor: Color(props.isDarkMode).danger,
      borderRadius: Radius.round,
      position: 'absolute',
      top: -1,
      right: -1
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
        marginBottom: 10,
        width: '100%',
        justifyContent: 'center',
        flexDirection: 'row'
      },
      deleteIconShadow: {
        right: -2,
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
      outerPhoto: {
        flexDirection: 'row',
        justifyContent: 'center'
      },
      error: {
        marginBottom: 10
      },
      buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%'
      },
      dialogButtonContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
        marginTop: 10
      }
  });

  return (
    <View style={styles.container}>
      {isLocationNotFound && (
        <View style={[styles.modalOverlay, dialogStyle()]}>
          <View style={styles.modalBox}>
            <_Text isDarkMode={props.isDarkMode} style={styles.modalTitle}>Location not found</_Text>
            <_Text isDarkMode={props.isDarkMode} style={styles.modalMessage}>Please enter a valid location for your listing.</_Text>
            <_Button
            onPress={() => setIsLocationNotFound(false)}
            style={Style(props.isDarkMode).buttonDanger}
            isDarkMode={props.isDarkMode}
            containerStyle={styles.closeBtn}
            >
              Close
            </_Button>
          </View>
        </View>
      )}
      {prompt && (
        <View style={[styles.modalOverlay, dialogStyle()]}>
          <View style={styles.modalBox}>
            <_Text isDarkMode={props.isDarkMode} style={styles.modalTitle}>Unsaved Changes</_Text>
            <_Text isDarkMode={props.isDarkMode} style={styles.modalMessage}>There are unsaved changes, are you sure you want to leave this screen and lose your work?</_Text>
            <View
            style={styles.dialogButtonContainer}
            >
            <_Button
            onPress={() => close()}
            style={Style(props.isDarkMode).buttonDanger}
            isDarkMode={props.isDarkMode}
            containerStyle={[styles.closeBtn, {marginRight: 5}]}
            >
              Leave
            </_Button>
            <_Button
            onPress={() => cancelPrompt()}
            style={Style(props.isDarkMode).buttonDefault}
            isDarkMode={props.isDarkMode}
            containerStyle={styles.closeBtn}
            >
              Continue Working
            </_Button>
            </View>
          </View>
        </View>
      )}
      {
      <View
      style={{flex: 1}}
      >
      <_Text style={styles.title}>{props.currentListing ? 'Update' : 'Create'} {'Listing'}</_Text>
      <View
      style={containerStyle()}
      >
        <ScrollView
        keyboardShouldPersistTaps={'handled'}
        >
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
                    style={styles.outerPhoto}
                    >
                      <ScrollView
                        style={styles.photoContent}
                        contentContainerStyle={styles.photoContentContainer}
                        horizontal={true}
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
                              <View
                              style={styles.deleteIconContainer}
                              >
                                <FontAwesomeIcon
                                  size={20}
                                  color={Color(props.isDarkMode).actualWhite}
                                  icon="close"
                                  style={styles.deleteIcon}
                                >
                                </FontAwesomeIcon>
                              </View>
                            </Pressable>
                          </View>
                        ))}
                      </ScrollView>
                    </View>
                    }
                </View>
                {imageError ?
                <_Text
                style={[Style(props.isDarkMode).textDanger, styles.error]}
                >
                  {imageError}
                </_Text>
                : null }
                <_Button
                  isDarkMode={props.isDarkMode}
                  onPress={(e: any) => { uploadPhotos(); } }
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
                required={true}
                isDarkMode={props.isDarkMode} />

              <_TextInput
                containerStyle={styles.inputContainerStyle}
                onChangeText={(text: any) => handleChange('description', text)}
                value={formData.description}
                multiline={true}
                label="Description"
                height={200}
                required={true}
                isDarkMode={props.isDarkMode} />

                <_TextInput
                containerStyle={styles.inputContainerStyle}
                onChangeText={(text: any) => handleChange('address', text)}
                value={formData.address}
                label="Address"
                required={true}
                isDarkMode={props.isDarkMode} />

                <_TextInput
                containerStyle={styles.inputContainerStyle}
                onChangeText={(text: any) => handleChange('city', text)}
                value={formData.city}
                label="City"
                required={true}
                isDarkMode={props.isDarkMode} />

                <_TextInput
                containerStyle={styles.inputContainerStyle}
                onChangeText={(text: any) => handleChange('zipcode', text)}
                keyboardType="numeric"
                value={formData.zipcode}
                isDarkMode={props.isDarkMode}
                required={true}
                label="Zip Code" />

                <_Dropdown
                containerStyle={styles.inputContainerStyle}
                isDarkMode={props.isDarkMode}
                options={getHousingType()}
                value={formData.housing_type}
                setValue={(text: string) => handleChange('housing_type', text)}
                required={true}
                label="Housing Type" />

                <_TextInput
                containerStyle={styles.inputContainerStyle}
                onChangeText={(text: any) => handleChange('price', parseFloat(text))}
                value={formData.price ? `$${formData.price}` : '$0'}
                keyboardType="numeric"
                placeholder="$0"
                label="Price (per month)"
                required={true}
                isDarkMode={props.isDarkMode} />

                <_TextInput
                containerStyle={styles.inputContainerStyle}
                onChangeText={(text: any) => handleChange('size', parseInt(text))}
                value={formData.size ? String(formData.size) : '0'}
                keyboardType="numeric"
                label="Square Feet"
                isDarkMode={props.isDarkMode} />

                <_Dropdown
                containerStyle={styles.inputContainerStyle}
                isDarkMode={props.isDarkMode}
                options={getOptions()}
                value={formData.rooms ? formData.rooms.toString() : ''}
                setValue={(text: string) => handleChange('rooms', parseInt(text))}
                required={true}
                label="Bedrooms" />            

              <_Dropdown
                containerStyle={styles.inputContainerStyle}
                isDarkMode={props.isDarkMode}
                options={getOptions()}
                value={formData.bathrooms ? formData.bathrooms.toString() : ''}
                setValue={(text: string) => handleChange('bathrooms', parseInt(text))}
                required={true}
                label="Bathrooms" />

              <_Dropdown
                containerStyle={[styles.inputContainerStyle, {marginBottom: 20}]}
                isDarkMode={props.isDarkMode}
                options={getYesNo()}
                value={formData.petsAllowed ? 'Yes' : (formData.petsAllowed === false) ? 'No' : ''}
                setValue={(text: string) => handleChange('petsAllowed', (text === 'Yes') ? true : (text === 'No') ? false : undefined)}
                required={true}
                label="Pets Allowed" />
                
              <View>
                {error ?
                  <_Text 
                  containerStyle={errorContainerStyle()}
                  innerContainerStyle={{justifyContent: 'center'}} 
                  style={errorStyle()}
                  >
                      {error}
                      </_Text>
                : null}
                <View
                style={styles.buttonContainer}
                >
                  <_Button
                    isDarkMode={props.isDarkMode}
                    containerStyle={{marginRight: 5, flex: 1}}
                    style={[Style(props.isDarkMode).buttonDanger]}
                    onPress={() => cancel()}
                  >
                    {'Cancel'}
                  </_Button>
                  <_Button
                    isDarkMode={props.isDarkMode}
                    containerStyle={{flex: 1}}
                    style={[Style(props.isDarkMode).buttonDefault]}
                    onPress={() => {handleSubmitListing()}}
                    disabled={disabled()}
                    loading={isLoading}
                  >
                    {props.currentListing ? 'Update' : 'Create'} {'Listing'}
                  </_Button>
                </View>
              </View>
            </View>
          </ScrollView>
        </View>
      </View>
    }
  </View>
  )
};

export default CreateListing;