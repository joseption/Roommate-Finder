import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, TouchableHighlight } from 'react-native';
import { Color, FontSize, Radius, Style } from '../../style';
import { navProp, NavTo } from '../../helper';
import { useNavigation } from '@react-navigation/native';
import _Text from '../control/text';
import _Image from '../control/image';


const ProfileCard = (props: any) => {
  /*
  Daniyal: A single card view of a profile will be on this component.
  Generate this component inside of the profiles component only.
  */
  const [profile, setProfile] = useState(props.profileInfo);
  const navigation = useNavigation<navProp>();

  useEffect(() => {
    setProfile({ ...profile, age: profile.birthday ? getAge(profile.birthday) : 0 });
  }, []);

  function getAge(dateString: any) {
    var today = new Date();
    var birthDate = new Date(dateString);
    var age = today.getFullYear() - birthDate.getFullYear();
    var m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  }

  const styles = StyleSheet.create({
    cardContainer: {
      backgroundColor: Color(props.isDarkMode).contentHolder,
      width: '100%',
      borderRadius: Radius.default,
      marginBottom: 10,
      padding: 10
    },
    row: {
      flexDirection: "row",
      flexWrap: "wrap",
    },
    row2: {
      paddingTop: 10
    },
    column1: {
      paddingRight: 10
    },
    column2: {
      flex: 1,
      paddingRight: 10
    },
    column3: {

    },
    name: {
      fontSize: FontSize.default,
      color: Color(props.isDarkMode).text,
      fontWeight: 'bold',
    },
    regText: {
      color: Color(props.isDarkMode).text,
    },
    profileImg: {
      width: 100,
      height: 100,
      borderWidth: 1,
      borderColor: Color(props.isDarkMode).separator,
      borderRadius: Radius.default,
      backgroundColor: Color(props.isDarkMode).userIcon
    },
    match: {
      color: Color(props.isDarkMode).text,
      fontStyle: 'italic',
      fontWeight: 'bold'
    }
  });

  return (
    <TouchableHighlight
    underlayColor={Color(props.isDarkMode).underlayMask}
    onPress={() => { navigation.navigate(NavTo.Profile, { profile: profile } as never) }}
    style={styles.cardContainer}
    >
      <>
        <View style={styles.row}>
          <View style={styles.column1}>
            <_Image height={100} width={100} style={styles.profileImg} source={{uri: profile.image}} />
          </View>
          <View style={styles.column2}>
            <_Text style={styles.name}>{profile.first_name + " " + profile.last_name}</_Text>
            <_Text style={styles.regText}>{profile.age} years old</_Text>
            <_Text style={styles.regText}>{profile.city + ", " + profile.state}</_Text>
            <_Text numberOfLines={2} style={styles.regText}>{profile.bio}</_Text>
          </View>
          {profile.matchPercentage ?
          <View style={styles.column3}>
            <_Text style={styles.match}>{profile.matchPercentage}%</_Text>
          </View>
          : null }
        </View>
      </>
    </TouchableHighlight>
  );

}

export default ProfileCard;
