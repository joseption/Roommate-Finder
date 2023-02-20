import { RouteProp, useNavigation } from '@react-navigation/native';
import React, { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import _Button from '../components/control/button';
import _Text from '../components/control/text';
import _TextInput from '../components/control/text-input';
import { navProp, NavTo } from '../helper';
import Profile from '../components/search/profiles';
import Icon from 'react-native-vector-icons/FontAwesome5';


interface SearchScreenProps {
  route: RouteProp<Record<string, any>, 'Search'>;
}

const SearchScreen = ({ route }: SearchScreenProps) => {
  /*
  Daniyal: This screen should be used to add all the components
  that you will need to it for search. I have created a components
  folder named "search" where you can create the filter component (filter.tsx)
  and profile cards (profile-card.tsx) that you will need to generate within
  profiles (profiles.tsx) component. So, this page will really just have
  profiles.tsx and filter.tsx on it and whatever else you need to add here.
  If you need to create other components please add them to the search folder
  that I already generated for you.
  */

  const navigation = useNavigation<navProp>();

  const [filtersFetched, setFiltersFetched] = useState(false);
  const [filters, setFilters] = useState<any[]>(route.params?.filters || []);
  const [genderFilter, setGenderFilter] = useState<string>(route.params?.genderFilter || "");
  const [locationFilter, setLocationFilter] = useState<string>(route.params?.locationFilter || "");
  const [sharingPrefFilter, setSharingPrefFilter] = useState<string>(route.params?.sharingPrefFilter || "");
  const [sorting, setSorting] = useState(false);

  useEffect(() => {
    setFilters(route.params?.filters || []);
    setGenderFilter(route.params?.genderFilter || "");
    setLocationFilter(route.params?.locationFilter || "");
    setSharingPrefFilter(route.params?.sharingPrefFilter || "");
    if (route.params?.filters?.length || route.params?.genderFilter?.length ||
      route.params?.locationFilter?.length || route.params?.sharingPrefFilter?.length) {
      setFiltersFetched(true);
    }
    else {
      setFiltersFetched(false);
    }
  }, [route.params?.filters, route.params?.genderFilter, route.params?.locationFilter, route.params?.sharingPrefFilter]);

  const handleToggleButtonPress = () => {
    setSorting(!sorting);
  };

  const icon = sorting ? 'toggle-on' : 'toggle-off';
  const iconColor = sorting ? '#4CAF50' : '#000';

  const toggleButton =
    <TouchableOpacity style={styles.toggleButton} onPress={handleToggleButtonPress}>
      <Icon name={icon} size={25} color={iconColor} />
    </TouchableOpacity>;

  return (
    <ScrollView style={styles.exploreContainer}>
      <View style={styles.myProfileRow}>
        <TouchableOpacity onPress={() => { navigation.navigate(NavTo.MyProfile) }}>
          <Text style={styles.myProfileBtnText}>My Profile</Text>
        </TouchableOpacity>
      </View>
      {
        filtersFetched ?
          <>
            <Text style={styles.heading}>You are viewing{'\n'}filtered profiles!</Text>
            <View style={styles.buttonsRow}>
              <TouchableOpacity style={styles.button} onPress={() => { navigation.navigate(NavTo.Filters); }}>
                <Text style={styles.buttonText}>Change Filters</Text>
              </TouchableOpacity>
            </View>
            {
              filters?.map((item, index) => {
                if (index % 3 === 0) {
                  return (
                    <View key={index} style={styles.filtersRow}>
                      <View style={styles.filterBox}><Text style={styles.filterText}>{filters[index]}</Text></View>
                      {filters[index + 1] && <View style={styles.filterBox}><Text style={styles.filterText}>{filters[index + 1]}</Text></View>}
                      {filters[index + 2] && <View style={styles.filterBox}><Text style={styles.filterText}>{filters[index + 2]}</Text></View>}
                    </View>
                  );
                }
              })
            }
            <View style={styles.toggleRow}>
              <View><Text style={styles.toggleLabel}>Sort by Match Percentage</Text></View>
              {toggleButton}
            </View>
            <Profile filters={filters} filtersFetched={filtersFetched} genderFilter={genderFilter}
              locationFilter={locationFilter} sharingPrefFilter={sharingPrefFilter} sorting={sorting} />
          </>
          :
          <>
            <Text style={styles.heading}>You are viewing{'\n'}everyone here!</Text>
            <View style={styles.buttonsRow}>
              <TouchableOpacity style={styles.button} onPress={() => { navigation.navigate(NavTo.Filters); }}>
                <Text style={styles.buttonText}>Filter Results</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.toggleRow}>
              <View><Text style={styles.toggleLabel}>Sort by Match Percentage</Text></View>
              {toggleButton}
            </View>
            <Profile filters={filters} filtersFetched={filtersFetched} genderFilter={genderFilter}
              locationFilter={locationFilter} sharingPrefFilter={sharingPrefFilter} sorting={sorting} />
          </>
      }
    </ScrollView >
  );
};

export default SearchScreen;


const styles = StyleSheet.create({
  exploreContainer: {
    flex: 1,
    backgroundColor: 'white',
    paddingTop: '10%',
    paddingBottom: '25%',
  },
  heading: {
    fontWeight: 'bold',
    fontSize: 20,
    textAlign: 'center',
    marginLeft: 'auto',
    marginRight: 'auto',
    // elevation: 4,
    // shadowColor: '#000',
    // shadowOffset: { width: 0, height: 1 },
    // shadowOpacity: 0.8,
    // shadowRadius: 2,
  },
  myProfileRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: 10,
  },
  myProfileBtnText: {
    color: '#000',
    fontSize: 16,
    fontWeight: 'bold',
    textDecorationLine: 'underline',
    paddingRight: 6
  },
  buttonsRow: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 25,
    marginBottom: 10,
  },
  button: {
    marginLeft: 7,
    marginRight: 7,
    padding: 10,
    borderRadius: 7,
    backgroundColor: 'grey',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 1, height: 1 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
  },
  buttonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  filtersRow: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    marginTop: 20,
    // backgroundColor: 'green',
  },
  filterBox: {
    backgroundColor: '#72e335',
    borderRadius: 30,
    paddingLeft: 14,
    paddingRight: 14,
    paddingTop: 7,
    paddingBottom: 10
  },
  filterText: {
    margin: 'auto',
    fontSize: 13
  },
  toggleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 25,
    marginHorizontal: 15
  },
  toggleLabel: {
    fontSize: 15,
    fontWeight: '700',
  },
  toggleButton: {
    borderRadius: 5,
    alignItems: 'center',
  },
  seeMore: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'grey',
    textAlign: 'right',
    textDecorationLine: 'underline',
    paddingRight: 15,
    marginBottom: 120
  }
});