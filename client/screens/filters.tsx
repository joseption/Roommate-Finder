import { useNavigation } from '@react-navigation/native';
import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView } from 'react-native';
import { navProp, NavTo } from '../helper';


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

    const handleFilterPress = (filter: string) => {
        if (selectedFilters.includes(filter)) {
            setSelectedFilters(selectedFilters.filter(f => f !== filter));
        }
        else {
            setSelectedFilters([...selectedFilters, filter]);
        }
    }

    const filterTags = tagStyles.map((filter) => {
        return (
            <TouchableOpacity key={filter} onPress={() => { handleFilterPress(filter) }}
                style={{
                    width: '42%',
                    height: 40,
                    marginRight: 5,
                    marginLeft: 5,
                    borderColor: 'skyblue',
                    borderWidth: 2,
                    borderRadius: 15,
                    backgroundColor: selectedFilters.includes(filter) ? 'steelblue' : 'powderblue'
                }}>
                <Text style={{
                    margin: 'auto',
                    fontWeight: '500',
                    color: selectedFilters.includes(filter) ? 'powderblue' : 'steelblue'
                }}>
                    {filter}
                </Text>
            </TouchableOpacity>
        );
    });

    return (
        <ScrollView style={styles.exploreContainer}>
            <Text style={styles.heading}>Filter Results</Text>
            <Text style={styles.info}>Please pick options that you would like to filter{"\n"}search results by</Text>
            {filterTags &&
                filterTags.map((item, index) => {
                    if (index % 2 === 0) {
                        return (
                            <View key={index} style={styles.filtersRow}>
                                {filterTags[index]}
                                {filterTags[index + 1]}
                            </View>
                        );
                    }
                })
            }
            <View style={styles.row}>
                <TouchableOpacity style={styles.searchBtn} onPress={() => {
                    navigation.navigate(NavTo.Search, { key: Math.random(), filters: selectedFilters } as never)
                }}>
                    <Text style={styles.searchBtnText}>Search</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.cancelBtn} onPress={() => {
                    navigation.goBack()
                }}>
                    <Text style={styles.cancelBtnText}>Cancel</Text>
                </TouchableOpacity>
            </View>
        </ScrollView >
    );
};

export default FiltersScreen;


const styles = StyleSheet.create({
    exploreContainer: {
        flex: 1,
        backgroundColor: 'white',
        paddingTop: '10%',
        paddingBottom: '28%',
        // height: '100%',
        // paddingBottom: '29%',
        // borderWidth: 3,
    },
    heading: {
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 6,
        // elevation: 4,
        // shadowColor: '#000',
        // shadowOffset: { width: 0, height: 1 },
        // shadowOpacity: 0.8,
        // shadowRadius: 2,
    },
    info: {
        textAlign: 'center',
        paddingLeft: 10,
        paddingRight: 10,
        marginBottom: 35
    },
    filtersRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        marginBottom: 10,
    },
    row: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        marginTop: 15,
    },
    // filterBox: {

    // },
    // filterText: {

    // },
    cancelBtn: {
        width: '35%',
        marginLeft: 4,
        marginRight: 4,
        padding: 10,
        borderRadius: 7,
        borderColor: '#da3a7e',
        backgroundColor: 'white',
        // shadowColor: '#000',
        // shadowOffset: { width: 1, height: 1 },
        shadowOpacity: 0.6,
        shadowRadius: 2,
        // elevation: 4
    },
    cancelBtnText: {
        fontSize: 14,
        color: '#da3a7e',
        fontWeight: 'bold',
        textAlign: 'center'
    },
    searchBtn: {
        width: '35%',
        marginLeft: 4,
        marginRight: 4,
        padding: 10,
        borderRadius: 7,
        backgroundColor: '#da3a7e',
        shadowColor: '#000',
        shadowOffset: { width: 1, height: 1 },
        shadowOpacity: 0.8,
        shadowRadius: 2,
        elevation: 4
    },
    searchBtnText: {
        fontSize: 14,
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center'
    }
});