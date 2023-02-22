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