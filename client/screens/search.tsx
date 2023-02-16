import { RouteProp, useNavigation } from '@react-navigation/native';
import React, { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import _Button from '../components/control/button';
import _Text from '../components/control/text';
import _TextInput from '../components/control/text-input';
import { navProp, NavTo } from '../helper';
import Profile from '../components/search/profiles';

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
  const filtersParam = route.params?.filters || [];

  const [filtersFetched, setFiltersFetched] = useState(false);
  const [filters, setFilters] = useState<any[]>([]);

  useEffect(() => {
    console.log("Inside useEffect of search screen");
    if (filtersParam.length) {
      console.log(filtersParam);
      setFilters(filtersParam);
      setFiltersFetched(true);
    }
    else {
      setFiltersFetched(false);
    }
  }, [filtersParam]);

  return (
    <ScrollView style={styles.exploreContainer}>
      {filtersFetched ?
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
          <Profile filters={filters} filtersFetched={filtersFetched} />
        </>
        :
        <>
          <Text style={styles.heading}>You are viewing{'\n'}everyone here!</Text>
          <View style={styles.buttonsRow}>
            <TouchableOpacity style={styles.button} onPress={() => { navigation.navigate(NavTo.Filters); }}>
              <Text style={styles.buttonText}>Filter Results</Text>
            </TouchableOpacity>
          </View>
          <Profile filters={filters} filtersFetched={filtersFetched} />
        </>
      }
    </ScrollView>
  );
};

export default SearchScreen;


const styles = StyleSheet.create({
  exploreContainer: {
    flex: 1,
    backgroundColor: 'white',
    paddingTop: '10%',
    // height: '100%',
    paddingBottom: '25%',
    // borderWidth: 3,
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
    // marginBottom: 30,
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