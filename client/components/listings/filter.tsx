import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Platform, TouchableHighlight} from 'react-native';
import _Text from '../control/text';
import { Color, FontSize, Radius, Style } from '../../style';
import _Button from '../control/button';
import _Image from '../control/image';
import { ScrollView } from 'react-native-gesture-handler';
import _Dropdown from '../control/dropdown';
import _TextInput from '../control/text-input';
import _Group from '../control/group';

const Filter = (props: any) => {

  const [housing_type, setHousingType] = useState();
  const [price, setPrice] = useState<number | undefined>(props.filters.price);
  const [petsAllowed, setPetsAllowed] = useState<boolean | undefined>(props.filters.petsAllowed);
  const [rooms, setRooms] = useState<number | undefined>(props.filters.rooms);
  const [bathrooms, setBathrooms] = useState<number | undefined>(props.filters.bathrooms);
  const [distanceToUcf, setDistance] = useState<number | undefined>(props.filters.distanceToUcf);

  const handleApply = () => {
    props.onFilter({
      housing_type,
      price,
      petsAllowed,
      distanceToUcf,
      rooms,
      bathrooms,
    });
    onClose();
  };

  useEffect(() => {
    setFilters();
  }, [props.filters]); 

  useEffect(() => {
    setFilters();
  }, [props.showFilter]); 

  const setFilters = () => {
    setHousingType(props.filters.housing_type);
    setPrice(props.filters.price);
    setPetsAllowed(props.filters.petsAllowed);
    setRooms(props.filters.rooms);
    setBathrooms(props.filters.bathrooms);
    setDistance(props.filters.distanceToUcf);
  }

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
      { key: 1, value: 'Yes' },
      { key: 2, value: 'No' },
    ];
  };

  const onClose = () => {
    props.setShowFilter(false)
  };

  const handlePetsAllowedChange = (text: string) => {
    if (text === 'Yes') 
      setPetsAllowed(true);
    else if (text === 'No')
      setPetsAllowed(false);
    else 
      setPetsAllowed(undefined);
  };
  

  const handlePriceChange = (text: string) => {
    const num = parseFloat(text) || 0;
    setPrice(num);
  };

  const handleRoomsChange = (text: string) => {
    const num = parseInt(text);
    setRooms(num);
  };

  const handleBathroomChange = (text: string) => {
    const num = parseInt(text);
    setBathrooms(num);
  };

  const handleDistanceChange = (text: string) => {
    const num = parseInt(text) || 0;
    setDistance(num);
  };

  const hasFilters = () => {
    return bathrooms || distanceToUcf || housing_type || petsAllowed || price || rooms;
  }

  const clearFilter = () => {
    setBathrooms(undefined);
    setDistance(undefined);
    setHousingType(undefined);
    setPetsAllowed(undefined);
    setPrice(undefined);
    setRooms(undefined);
  }

  const containerStyle = () => {
    var container = Color(props.isDarkMode).contentBackground;
    var padding = 10;
    var borderRadius = Radius.large;
    var borderColor = Color(props.isDarkMode).border;
    var borderWidth = 1;
    var marginTop = 10;
    var marginBottom = 0;
    var flex = 1;
    if (props.mobile) {
        padding = 0;
        borderRadius = 0;
        borderWidth = 0;
        marginTop = 0
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
        marginTop: marginTop,
        backgroundColor: container,
        flex: flex,
        marginBottom: marginBottom
    }
  }

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
      buttons: {
        flexDirection: 'row',
        justifyContent: 'center',
        margin: 10,
        height: 40
    },
    clearButton: {
      paddingVertical: 2,
      paddingHorizontal: 10,
      borderRadius: Radius.round,
    },
    header: {
      justifyContent: 'space-between',
      display: 'flex',
      alignItems: 'center',
      flexDirection: 'row',
      padding: props.mobile ? 10 : 0
  },
  });

  return (
    <View style={styles.container}>
      <View
      style={styles.header}
      >
      <_Text style={styles.title}>Filter Listing</_Text>
      {hasFilters() ?
      <TouchableHighlight
      underlayColor={Color(props.isDarkMode).holderUnderlay}
      style={[Style(props.isDarkMode).buttonInverted, styles.clearButton]}
      onPress={() => clearFilter()}
      >
          <_Text
          style={Style(props.isDarkMode).buttonInvertedText}
          >
              Clear All
          </_Text>
      </TouchableHighlight>
      : null }
      </View>
      <View
      style={containerStyle()}
      >
        <ScrollView
          keyboardShouldPersistTaps={'handled'}
        >
          <View style={styles.formContainer}>

            <_Dropdown
              containerStyle={styles.inputContainerStyle}
              isDarkMode={props.isDarkMode}
              options={getHousingType()}
              value={housing_type}
              setValue={setHousingType}
              label="Housing Type"
            />   

            <_TextInput
              containerStyle={styles.inputContainerStyle}
              onChangeText={handlePriceChange}
              value={price !== undefined ? `$${price.toString()}` : ""}
              keyboardType="numeric"
              placeholder="$0"
              label="Max Price (per month)"
              isDarkMode={props.isDarkMode}
            />
            
            <_Dropdown
              containerStyle={styles.inputContainerStyle}
              isDarkMode={props.isDarkMode}
              options={getYesNo()}
              value={petsAllowed !== null && petsAllowed !== undefined ? (petsAllowed? 'Yes' : 'No') : null}
              setValue={handlePetsAllowedChange}
              label="Pets Allowed"
            />

            <_Dropdown
              containerStyle={styles.inputContainerStyle}
              isDarkMode={props.isDarkMode}
              options={getOptions()}
              value={rooms !== null && rooms !== undefined && !Number.isNaN(rooms) ? rooms.toString() : null}
              setValue={handleRoomsChange}
              label="Rooms"
            />

            <_Dropdown
              containerStyle={styles.inputContainerStyle}
              isDarkMode={props.isDarkMode}
              options={getOptions()}
              value={bathrooms !== null && bathrooms !== undefined && !Number.isNaN(bathrooms) ? bathrooms.toString() : null}
              setValue={handleBathroomChange}
              label="Bathrooms"
            />

            <_TextInput
              containerStyle={styles.inputContainerStyle}
              onChangeText={handleDistanceChange}
              value={distanceToUcf !== undefined ? distanceToUcf.toString() : ""}
              keyboardType="numeric"
              placeholder="0 miles"
              label="Max Distance from UCF"
              isDarkMode={props.isDarkMode}
            />
          </View>
        </ScrollView>
      <View
      style={styles.buttons}
      >
          <_Button
          isDarkMode={props.isDarkMode}
          containerStyle={{flex: 1, marginRight: 5}}
          style={Style(props.isDarkMode).buttonInverted}
          textStyle={Style(props.isDarkMode).buttonInvertedText}
          onPress={() => onClose()}
          >
              Cancel
          </_Button>
          <_Button
          isDarkMode={props.isDarkMode}
          containerStyle={{flex: 1}}
          style={Style(props.isDarkMode).buttonGold}
          onPress={() => handleApply()}
          >
              Apply Filters
          </_Button>
      </View>
    </View>
    </View>
  );
};

export default Filter;
