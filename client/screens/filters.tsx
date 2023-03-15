import { useNavigation } from '@react-navigation/native';
import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, TouchableHighlight } from 'react-native';
import _Button from '../components/control/button';
import _Group from '../components/control/group';
import _Text from '../components/control/text';
import { isDarkMode, navProp, NavTo } from '../helper';
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
            if (rt.params['genderFilter'])
                setGenderFilter(rt.params['genderFilter']);
            if (rt.params['locationFilter'])
                setLocationFilter(rt.params['locationFilter']);
            if (rt.params['sharingPrefFilter'])
                setSharingPrefFilter(rt.params['sharingPrefFilter']);
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

    const handleFilterPress = (filter: string) => {
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
        return tagStyles.map((item, key) => {
            return (
            <TouchableHighlight
            underlayColor={Color(props.isDarkMode).underlayMask}
            key={key}
            onPress={() => { handleFilterPress(item) }}
            style={[styles.filterStyle, filtersStyle(item)]}
            >
                <_Text 
                style={[styles.filterText, filtersTextStyle(item)]}
                >
                    {item}
                </_Text>
            </TouchableHighlight>
            );
        });
    }

    const setSingleFilter = (item: string, filter: any, setFilter: any) => {
        if (filter === item)
            setFilter('');
        else
            setFilter(item);
    }

    const item = (options: string[], filter: any, setFilter: any) => {
        return options.map((item, key) => {
            return (
                <TouchableHighlight
                underlayColor={Color(props.isDarkMode).underlayMask}
                key={key}
                onPress={() => { setSingleFilter(item, filter, setFilter) }}
                style={[styles.filterStyle, filterStyle(item, filter)]}
                >
                    <_Text
                    style={[styles.filterText, filterTextStyle(item, filter)]}
                    >
                        {item}
                    </_Text>
                </TouchableHighlight>
                );
        })
    }

    const filterStyle = (filter: string, active: string | undefined) => {
        let selected = active === filter;
        let style = [];
        style.push({
            backgroundColor: selected ? Color(props.isDarkMode).gold : props.isDarkMode ? Color(props.isDarkMode).holder : Color(props.isDarkMode).contentBackgroundSecondary,
        });

        return style;
    }

    const filterTextStyle = (filter: string, active: string | undefined) => {
        let selected = active === filter;
        let style = [];
        style.push({
            color: selected ? Color(props.isDarkMode).actualWhite : Color(props.isDarkMode).text
        });

        return style;
    }

    const filtersStyle = (filter: string) => {
        let selected = selectedFilters.includes(filter);
        let style = [];
        style.push({
            backgroundColor: selected ? Color(props.isDarkMode).gold : props.isDarkMode ? Color(props.isDarkMode).holder : Color(props.isDarkMode).contentBackgroundSecondary,
        });

        return style;
    }

    const filtersTextStyle = (filter: string) => {
        let selected = selectedFilters.includes(filter);
        let style = [];
        style.push({
            color: selected ? Color(props.isDarkMode).actualWhite : Color(props.isDarkMode).text
        });

        return style;
    }

    const styles = StyleSheet.create({
        filterStyle: {
            marginRight: 7,
            marginBottom: 7,
            borderRadius: Radius.round,
            paddingVertical: 5,
            paddingHorizontal: 15,
            borderColor: Color(props.isDarkMode).separator,
            borderWidth: .5
        },
        exploreContainer: {
            paddingHorizontal: 10,
        },
        exploreContent: {
        },
        heading: {
            fontSize: FontSize.large,
            fontWeight: 'bold',
            color: Color(props.isDarkMode).text,
            padding: 10,
        },
        row: {
            flexDirection: 'row',
            justifyContent: 'center',
            paddingTop: 20,
            width: '100%'
        },
        buttons: {
            flexDirection: 'row',
            justifyContent: 'center',
            margin: 10,
            height: 40
        },
        filterContainer: {
            flexDirection: 'row',
            flexWrap: 'wrap',
            justifyContent: 'center',
            alignItems: 'center',
            width: '100%',
            marginBottom: -5
        },
        filterText: {
            color: Color(props.isDarkMode).text,
            fontSize: FontSize.default
        },
        subheading: {
            fontWeight: 'bold'
        },
        group: {
            marginBottom: 20
        },
        container: {
            height: '100%',
            flexDirection: 'column',
            display: 'flex'
        },
        spacing: {
            height: 1
        }
    });

    return (
        <View
        style={styles.container}
        >
            <_Text
            style={styles.heading}
            isDarkMode={props.isDarkMode}
            >
                Filter Results
            </_Text>
            <ScrollView
            contentContainerStyle={styles.exploreContent}
            style={styles.exploreContainer}
            >
                {tagStyles ?
                    <_Group
                    containerStyle={styles.group}
                    isDarkMode={props.isDarkMode}
                    label="Interests and Activities"
                    vertical={true}
                    >
                        <View
                        style={styles.filterContainer}
                        >
                            {filters()}
                        </View>
                    </_Group>
                    : null
                }
                {genderOptions ?
                    <_Group
                    containerStyle={styles.group}
                    isDarkMode={props.isDarkMode}
                    label="Gender"
                    vertical={true}
                    >
                        <View
                        style={styles.filterContainer}
                        >
                            {item(genderOptions, genderFilter, setGenderFilter)}
                        </View>
                    </_Group>
                    : null
                }
                {locationOptions ?
                    <_Group
                    containerStyle={styles.group}
                    isDarkMode={props.isDarkMode}
                    label="Location"
                    vertical={true}
                    >
                        <View
                        style={styles.filterContainer}
                        >
                            {item(locationOptions, locationFilter, setLocationFilter)}
                        </View>
                    </_Group>
                    : null
                }
                {sharingPrefOptions ?
                    <_Group
                    containerStyle={styles.group}
                    isDarkMode={props.isDarkMode}
                    label="Sharing Preferences"
                    vertical={true}
                    >
                        <View
                        style={styles.filterContainer}
                        >
                            {item(sharingPrefOptions, sharingPrefFilter, setSharingPrefFilter)}
                        </View>
                    </_Group>
                    : null
                }
                <View
                style={styles.spacing}
                />
            </ScrollView >
            <View
            style={styles.buttons}
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
                    navigation.navigate(NavTo.Search, {
                        key: Math.random(),
                        filters: selectedFilters,
                        genderFilter: genderFilter,
                        locationFilter: locationFilter,
                        sharingPrefFilter: sharingPrefFilter
                    } as never)
                }}>
                    Search
                </_Button>
            </View>
        </View>
    );
};

export default FiltersScreen;
