import React, { useEffect, useState } from 'react';
import { View, Alert, StyleSheet, TextInput, TouchableOpacity, Platform, FlatList, Pressable} from 'react-native';
import _Text from '../control/text';
import { Color, FontSize, Radius, Style } from '../../style';
import { env } from '../../helper';
import { authTokenHeader, getLocalStorage } from '../../helper';
import _Button from '../control/button';
import { ImagePickerResponse, launchCamera, launchImageLibrary } from 'react-native-image-picker';
import _Image from '../control/image';
import { ScrollView } from 'react-native-gesture-handler';
import _Dropdown from '../control/dropdown';
import axios, { AxiosResponse } from 'axios';
import _TextInput from '../control/text-input';
import _Group from '../control/group';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';

const Filter = (props: any) => {

  const [selectedFilter, setSelectedFilter] = useState('all');
  const [selectedSort, setSelectedSort] = useState('default');
  const [housingType, setHousingType] = useState('');
  const [priceMin, setPriceMin] = useState('');
  const [priceMax, setPriceMax] = useState(''); 
  const [petsAllowed, setPetsAllowed] = useState('');
  const [rooms, setRooms] = useState('');
  const [bathrooms, setBathrooms] = useState('');
  const [size, setSize] = useState('');
  const [distance, setDistance] = useState('');

  const handleApply = () => {
    props.onFilter({
      housingType,
      priceMin,
      priceMax,
      petsAllowed,
      rooms,
      bathrooms,
      size,
      distance,
    });
    props.setShowFilter(false);
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

  const getDistanceOptions = () => {
    return [
      { key: 1, value: '<3 miles' },
      { key: 2, value: '<10 miles' },
      { key: 3, value: '+10 miles' },
    ];
  };

  const onClose = () => {
    props.setShowFilter(false)
  };

  const styles = StyleSheet.create({
    container: {
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
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
      },
      modalOverlay: {
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        zIndex: 9999,
        justifyContent: "center",
        alignItems: "center",
      },
      modalBox: {
        backgroundColor: "white",
        width: 300,
        padding: 24,
        borderRadius: 8,
        alignItems: "center",
      },
      modalTitle: {
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 16,
      },
      modalMessage: {
        fontSize: 16,
        marginBottom: 24,
      },
      modalCloseButton: {
        backgroundColor: "#e0e0e0",
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 4,
      },
      modalCloseButtonText: {
        fontSize: 16,
      },
  });

  return (
    <View style={styles.container}>
      <ScrollView>
        <_Text style={styles.title}>Filter Listing</_Text>
        <View style={styles.formContainer}>

            <View style={{ flexDirection: 'row' }}>
            <_TextInput
              containerStyle={{ flex: 1, marginRight: 8 }}
              style={styles.input}
              onChangeText={setPriceMin}
              value={priceMin}
              keyboardType="numeric"
              placeholder="$0"
              label="Min Price (per month)"
              isDarkMode={props.isDarkMode}
            />
            <_TextInput
              containerStyle={{ flex: 1, marginLeft: 8 }}
              style={styles.input}
              onChangeText={setPriceMax}
              value={priceMax}
              keyboardType="numeric"
              placeholder="$0"
              label="Max Price (per month)"
              isDarkMode={props.isDarkMode}
            />
          </View>

          <_Dropdown
            containerStyle={styles.inputContainerStyle}
            isDarkMode={props.isDarkMode}
            options={getHousingType()}
            value={housingType}
            setValue={setHousingType}
            label="Housing Type"
          />      
          
          <_Dropdown
            containerStyle={styles.inputContainerStyle}
            isDarkMode={props.isDarkMode}
            options={getYesNo()}
            value={petsAllowed}
            setValue={setPetsAllowed}
            label="Pets Allowed"
          />

          <_Dropdown
            containerStyle={styles.inputContainerStyle}
            isDarkMode={props.isDarkMode}
            options={getOptions()}
            value={rooms}
            setValue={setRooms}
            label="Rooms"
          />

          <_Dropdown
            containerStyle={styles.inputContainerStyle}
            isDarkMode={props.isDarkMode}
            options={getOptions()}
            value={bathrooms}
            setValue={setBathrooms}
            label="Bathrooms"
          />

          <_Dropdown
            containerStyle={styles.inputContainerStyle}
            isDarkMode={props.isDarkMode}
            options={getDistanceOptions()}
            value={distance}
            setValue={setDistance}
            label="Distance"
          />

<         View style={styles.submitContainer}>
            <_Button containerStyle={{flex:1}}style={[Style(props.isDarkMode).buttonInverted,{marginRight:5}]}textStyle={Style(props.isDarkMode).buttonInvertedText}onPress={()=>{onClose()}}>Cancel</_Button>
            <_Button containerStyle={{flex:1}}style={[Style(props.isDarkMode).buttonGold,{marginRight:5}]}onPress={()=>{handleApply()}}>Apply Filter</_Button>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default Filter;
