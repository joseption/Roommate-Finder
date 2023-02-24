import { useNavigation } from '@react-navigation/native';
import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, TouchableHighlight } from 'react-native';
import _Button from '../components/control/button';
import _Text from '../components/control/text';
import { navProp, NavTo } from '../helper';
import { Color, FontSize, Radius, Style } from '../style';


const FiltersScreen = (props: any) => {

    const navigation = useNavigation<navProp>();
    const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
    const [genderFilter, setGenderFilter] = useState<string>();
    const [locationFilter, setLocationFilter] = useState<string>();
    const [sharingPrefFilter, setSharingPrefFilter] = useState<string>();

    const tagStyles = [
        "✈️ Travel",
        "📷 Photography",
        "💪 Fitness",
        "🍲 Food",
        "📖 Reading",
        "🎵 Music",
        "🎨 Arts",
        "💻 Technology",
        "⚽ Sports",
        "🐾 Pets",
        "🚗 Cars",
        "💼 Business",
        "🎥 Film",
        "🎮 Gaming",
        "🔬 Science",
        "🏛 History",
        "🌸 Anime",
        "🛍 Shopping"
    ];

    const genderOptions = ["Male", "Female", "Does not matter"];
    const locationOptions = ["On Campus", "Oviedo", "Union Park", "Orlando", "Lake Nona"];
    const sharingPrefOptions = ["Never", "Sometimes", "Always"];

    useEffect(() => {
        let rt = route();
        if (rt && rt.params && rt.name && rt.name == NavTo.Filters) {
          if (rt.params['params']) {
            let params = (rt.params['params'] as string).split(',');
            addFilters(params);
          }
        }
        props.setNavSelector(NavTo.Search);
    }, []);

    const route = () => {
        if (navigation) {
          let state = navigation.getState();
          if (state && state.routes) {
            return state.routes[state.index];
          }
        }
        return null;
    }

    const addFilters = (filters: string[]) => {
        let allFilters = [] as never[];
        filters.forEach(f => {
            let match = tagStyles.find(x => x.includes(f));
            if (match) {
                allFilters.push(f as never);
            }
        });
        setSelectedFilters(allFilters);
    }

    const handleFilterPress = (filter: string, init: boolean = false) => {
        let filters = [] as never[];
        selectedFilters.forEach(x => filters.push(x as never))
        let filterText = filter.substring(3, filter.length);
        let idx = selectedFilters.findIndex(x => x.includes(filterText));
        if (idx > -1) {
            filters.splice(idx, 1)
            setSelectedFilters(filters);
        }
        else {
            let match = tagStyles.find(x => x.includes(filterText));
            if (match) {
                setSelectedFilters([...filters, match]);
            }
        }
    }

    const filters = () => {
        console.log("rerender!");
        return tagStyles.map((item, key) => {
            return (
            <TouchableHighlight
            underlayColor={Color(props.isDarkMode).underlayMask}
            key={key}
            onPress={() => { handleFilterPress(item) }}
            style={[styles.filterStyle, filterStyle(item)]}
            >
                <_Text style={styles.filterText}>
                    {item}
                </_Text>
            </TouchableHighlight>
            );
        });
    }

    const filterStyle = (filter: string) => {
        let selected = selectedFilters.includes(filter);
        let style = [];
        style.push({
            backgroundColor: selected ? Color(props.isDarkMode).gold : Color(props.isDarkMode).contentHolder
        });

        return style;
    }

    const styles = StyleSheet.create({
        filterStyle: {
            marginRight: 5,
            marginBottom: 5,
            borderRadius: Radius.round,
            paddingVertical: 5,
            paddingHorizontal: 15
        },
        exploreContainer: {
            padding: 10,
            height: '100%'
        },
        heading: {
            fontSize: FontSize.large,
            fontWeight: 'bold',
            color: Color(props.isDarkMode).text,
            paddingBottom: 20,
        },
        row: {
            flexDirection: 'row',
            justifyContent: 'center',
            paddingTop: 20,
            width: '100%'
        },
        rowContainer: {

        },
        filterContainer: {
            flexDirection: 'row',
            flexWrap: 'wrap',
            justifyContent: 'center',
            alignItems: 'center',
        },
        filterText: {
            color: Color(props.isDarkMode).text,
            fontSize: FontSize.default
        },
        exploreContent: {
            height: '100%'
        }
    });

    const genderFilters = genderOptions.map((filter, index) => {
        return (
            <TouchableOpacity key={filter} onPress={() => { setGenderFilter(filter) }}
                style={{
                    width: '42%',
                    height: 40,
                    marginRight: 5,
                    marginLeft: 5,
                    borderColor: 'skyblue',
                    borderWidth: 2,
                    borderRadius: 15,
                    backgroundColor: genderFilter === filter ? 'steelblue' : 'powderblue'
                }}>
                <Text style={{
                    margin: 'auto',
                    fontWeight: '500',
                    color: genderFilter === filter ? 'powderblue' : 'steelblue'
                }}>
                    {filter}
                </Text>
            </TouchableOpacity>
        );
    });

    const locationFilters = locationOptions.map((filter, index) => {
        return (
            <TouchableOpacity key={filter} onPress={() => { setLocationFilter(filter) }}
                style={{
                    width: '42%',
                    height: 40,
                    marginRight: 5,
                    marginLeft: 5,
                    borderColor: 'skyblue',
                    borderWidth: 2,
                    borderRadius: 15,
                    backgroundColor: locationFilter === filter ? 'steelblue' : 'powderblue'
                }}>
                <Text style={{
                    margin: 'auto',
                    fontWeight: '500',
                    color: locationFilter === filter ? 'powderblue' : 'steelblue'
                }}>
                    {filter}
                </Text>
            </TouchableOpacity>
        );
    });

    const sharingPrefFilters = sharingPrefOptions.map((filter, index) => {
        return (
            <TouchableOpacity key={filter} onPress={() => { setSharingPrefFilter(filter) }}
                style={{
                    width: '42%',
                    height: 40,
                    marginRight: 5,
                    marginLeft: 5,
                    borderColor: 'skyblue',
                    borderWidth: 2,
                    borderRadius: 15,
                    backgroundColor: sharingPrefFilter === filter ? 'steelblue' : 'powderblue'
                }}>
                <Text style={{
                    margin: 'auto',
                    fontWeight: '500',
                    color: sharingPrefFilter === filter ? 'powderblue' : 'steelblue'
                }}>
                    {filter}
                </Text>
            </TouchableOpacity>
        );
    });

    return (
        <ScrollView
        contentContainerStyle={styles.exploreContent}
        style={styles.exploreContainer}
        >
            <_Text style={styles.heading}>Filter Results</_Text>
            {tagStyles ?
                <View
                style={styles.filterContainer}
                >
                {filters()}
                </View>
                : null
            }
            <Text style={styles.subheading}>Gender</Text>
            {genderFilters &&
                genderFilters.map((item, index) => {
                    if (index % 2 === 0) {
                        return (
                            <View key={index} style={styles.filtersRow}>
                                {genderFilters[index]}
                                {genderFilters[index + 1] && genderFilters[index + 1]}
                            </View>
                        );
                    }
                })
            }
            <Text style={styles.subheading}>Location</Text>
            {locationFilters &&
                locationFilters.map((item, index) => {
                    if (index % 2 === 0) {
                        return (
                            <View key={index} style={styles.filtersRow}>
                                {locationFilters[index]}
                                {locationFilters[index + 1] && locationFilters[index + 1]}
                            </View>
                        );
                    }
                })
            }
            <Text style={styles.subheading}>Sharing Preferences</Text>
            {sharingPrefFilters &&
                sharingPrefFilters.map((item, index) => {
                    if (index % 2 === 0) {
                        return (
                            <View key={index} style={styles.filtersRow}>
                                {sharingPrefFilters[index]}
                                {sharingPrefFilters[index + 1] && sharingPrefFilters[index + 1]}
                            </View>
                        );
                    }
                })
            }
            <View style={styles.row}>
                <TouchableOpacity style={styles.searchBtn} onPress={() => {
                    navigation.navigate(NavTo.Search, {
                        key: Math.random(),
                        filters: selectedFilters,
                        genderFilter: genderFilter,
                        locationFilter: locationFilter,
                        sharingPrefFilter: sharingPrefFilter
                    } as never)
                }}>
                    <Text style={styles.searchBtnText}>Search</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.cancelBtn} onPress={() => {
                    navigation.goBack()
                }}>
                    <Text style={styles.cancelBtnText}>Cancel</Text>
                </TouchableOpacity>         
            </View>
            <View
            style={styles.rowContainer}
            >
                <View
                style={styles.row}
                >
                    <_Button
                    containerStyle={{flex: 1}}
                    style={[Style(props.isDarkMode).buttonInverted, {marginRight: 5}]}
                    textStyle={Style(props.isDarkMode).buttonInvertedText}
                    onPress={() => {
                        navigation.goBack()
                    }}
                    >
                        Cancel
                    </_Button>
                    <_Button
                    containerStyle={{flex: 1}}
                    style={Style(props.isDarkMode).buttonGold}
                    onPress={() => {
                        navigation.navigate(NavTo.Search, { key: Math.random(), filters: selectedFilters } as never)
                    }}
                    >
                        Search
                    </_Button>
                </View>
            </View>
        </ScrollView >
    );
};

export default FiltersScreen;
