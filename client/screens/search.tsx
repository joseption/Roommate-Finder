import { RouteProp, useNavigation } from '@react-navigation/native';
import React, { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Platform, ScrollView, StyleSheet, Text, TouchableHighlight, TouchableOpacity, View } from 'react-native';
import _Button from '../components/control/button';
import _Text from '../components/control/text';
import _TextInput from '../components/control/text-input';
import { navProp, NavTo } from '../helper';
import Profile from '../components/search/profiles';
import { Color, FontSize, Radius } from '../style';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';

interface SearchScreenProps {
  route: RouteProp<Record<string, any>, 'Search'>;
  isDarkMode: boolean;
  mobile: boolean;
  isMatches: boolean;
  setIsMatches: any;
  setNavSelector: any;
}

const SearchScreen = ({ route, isDarkMode, mobile, isMatches, setIsMatches, setNavSelector }: SearchScreenProps) => {
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
  const [noResults, setNoResults] = useState(false);
  const [filtersFetched, setFiltersFetched] = useState(false);
  const [filters, setFilters] = useState<any[]>([]);

  useEffect(() => {
    console.log(filtersParam.length);
    console.log(filters);
    if (filtersParam.length > 0) {
      setFilters(filtersParam);
      setFiltersFetched(true);
    }
    else if (filtersParam.length != 0 && filters && filters.length > 0) {
      setFilters(filters);
      setFiltersFetched(false);
    }
    else if (filtersParam.length == 0 && filters.length != 0) {
      setFilters([]);
      setFiltersFetched(false);
    }
  }, [filtersParam]);

  const styles = StyleSheet.create({
    exploreContainer: {
      flex: 1,
    },
    heading: {
      fontWeight: 'bold',
      fontSize: FontSize.large,
      color: Color(isDarkMode).text
    },
    buttonsRow: {

    },
    button: {
      padding: 10,
      borderRadius: Radius.round,
      margin: -5
    },
    buttonText: {
      color: 'white',
      fontSize: 14,
      fontWeight: 'bold',
      textAlign: 'center',
    },
    filterBox: {
      backgroundColor: Color(isDarkMode).contentHolder,
      borderRadius: Radius.round,
      paddingVertical: 5,
      paddingHorizontal: 15,
      marginRight: 2,
      borderColor: Color(isDarkMode).separator
    },
    filterText: {
      margin: 'auto',
      fontSize: FontSize.default,
      color: Color(isDarkMode).text
    },
    seeMore: {
      fontSize: 16,
      fontWeight: 'bold',
      color: 'grey',
      textAlign: 'right',
      textDecorationLine: 'underline',
      paddingRight: 15,
      marginBottom: 120
    },
    filterIcon: {
      ...Platform.select({
        web: {
          outlineStyle: 'none'
        }
      }),
    },
    header: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
      padding: 10
    },
    container: {
      height: '100%',
      justifyContent: 'flex-start'
    },
    filterContainer: {
      display: 'flex',
      flexDirection: 'row',
      marginBottom: 8,
      marginHorizontal: 10,
      paddingBottom: 10,
      minHeight: 45
    },
    filterContent: {
      justifyContent: 'center',
      alignItems: 'flex-start',
    }
  });

  return (
    <View style={styles.exploreContainer}>
        <View
        style={styles.container}
        >
          <View
          style={styles.header}
          >
            <_Text
            style={styles.heading}
            isDarkMode={isDarkMode}
            >
              Explore
            </_Text>
            <View style={styles.buttonsRow}>
              <TouchableHighlight
              underlayColor={Color(isDarkMode).underlayMask}
              style={styles.button}
              onPress={() => { navigation.navigate(NavTo.Filters, {params: filters.toString()} as never); }}
              >
                <FontAwesomeIcon 
                size={20} 
                color={filtersParam.length > 0 ? Color(isDarkMode).gold : Color(isDarkMode).text} 
                style={styles.filterIcon} 
                icon="filter"
                >
                </FontAwesomeIcon>
              </TouchableHighlight>
            </View>
          </View>
          {!noResults && filters && filters.length > 0 ?
          <ScrollView
          horizontal={true}
          style={styles.filterContainer}
          contentContainerStyle={styles.filterContent}
          >
          {
            filters?.map((item, key) => {
                return (
                    <View style={styles.filterBox}>
                      <_Text
                      style={styles.filterText}
                      >
                        {filters[key]}
                      </_Text>
                    </View>
                );
            })
          }
        </ScrollView>
        : null}
        <Profile filters={filters} filtersFetched={filtersFetched} isDarkMode={isDarkMode} setNoResults={setNoResults} />
        </View>
      </View>
  );
};

export default SearchScreen;