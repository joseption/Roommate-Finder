import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, TouchableHighlight, Platform } from 'react-native';
import { Color, FontSize, Radius, Style } from '../../style';
import { navProp, NavTo, getAge } from '../../helper';
import { useNavigation } from '@react-navigation/native';
import _Text from '../control/text';
import _Image from '../control/image';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';


const ProfileCard = (props: any) => {
  /*
  Daniyal: A single card view of a profile will be on this component.
  Generate this component inside of the profiles component only.
  */
  const [profile, setProfile] = useState(props.profileInfo);
  const navigation = useNavigation<navProp>();

  useEffect(() => {
    let age = 0;
    if (profile && profile.birthday)
      age = getAge(profile.birthday);

    setProfile({ ...profile, age: age });
  }, []);

  const styles = StyleSheet.create({
    cardContainer: {
      backgroundColor: Color(props.isDarkMode).contentHolder,
      width: '100%',
      borderRadius: Radius.default,
      marginBottom: 10,
      padding: 10,
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
    },
    backIcon: {
      ...Platform.select({
        web: {
          outlineStyle: 'none'
        }
      }),
    },
    iconLabel: {
      flexDirection: 'row',
      alignItems: 'center'
    },
    labelIcon: {
      marginRight: 5
    },
    firstLabelContainer: {
    },
    card: {
      marginHorizontal: 10
    }
  });

  return (
    <View
    style={styles.card}
    >
      <TouchableHighlight
      underlayColor={Color(props.isDarkMode).underlayMask}
      onPress={() => { navigation.navigate(NavTo.Profile, { profile: profile.id, match: profile.matchPercentage } as never) }}
      style={styles.cardContainer}
      >
        <View>
          <View style={styles.row}>
            <View style={styles.column1}>
              <_Image height={100} width={100} style={styles.profileImg} source={{uri: profile.image}} />
            </View>
            <View style={styles.column2}>
            {profile.first_name && profile.last_name ?
              <_Text style={styles.name}>{profile.first_name + " " + profile.last_name}</_Text>
              : null }
            {profile?.gender ?
              <View
              style={[styles.iconLabel, styles.firstLabelContainer]}
              >
                <FontAwesomeIcon 
                  size={15} 
                  color={Color(props.isDarkMode).text} 
                  style={[styles.backIcon, styles.labelIcon]} 
                  icon={profile?.gender === "Female" ? 'person-dress' : 'person'}
                  >
                </FontAwesomeIcon>
                <_Text
                isDarkMode={props.isDarkMode}
                >
                  {profile?.gender === "Other" ? "Non-Binary" : profile?.gender}
                </_Text>
              </View>
              : null }
              {profile?.birthday ?
              <View
              style={styles.iconLabel}
              >
                <FontAwesomeIcon 
                  size={15} 
                  color={Color(props.isDarkMode).text} 
                  style={[styles.backIcon, styles.labelIcon]} 
                  icon="cake-candles"
                  >
                </FontAwesomeIcon>
                <_Text
                isDarkMode={props.isDarkMode}
                >
                  {getAge(profile?.birthday)} years old
                </_Text>
              </View>
              : null }
              {profile?.city && profile?.state ?
              <View
              style={styles.iconLabel}
              >
                <FontAwesomeIcon 
                  size={15} 
                  color={Color(props.isDarkMode).text} 
                  style={[styles.backIcon, styles.labelIcon]} 
                  icon="location-dot"
                  >
                </FontAwesomeIcon>
                <_Text
                isDarkMode={props.isDarkMode}
                >
                  {profile?.city}, {profile?.state}
                </_Text>
              </View>
              : null }
              {!profile?.city && !profile?.state && !profile?.birthday && !profile?.gender ?
                <_Text
                isDarkMode={props.isDarkMode}
                >
                  {profile?.bio}
                </_Text>
                : null }
            </View>
            {profile.matchPercentage ?
            <View style={styles.column3}>
              <_Text style={styles.match}>{Math.ceil(profile.matchPercentage)}%</_Text>
            </View>
            : null }
          </View>
        </View>
      </TouchableHighlight>
    </View>
  );

}

export default ProfileCard;
