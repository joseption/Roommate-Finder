import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import React from 'react';
import { View, TextInput, StyleSheet, Image } from 'react-native';

const SearchBar = (props: any, {navigation}:any) => {
    return(
        <View style = {styles.container}>
            <TextInput 
            style={styles.searchInput}
            placeholder='Enter an address or city'
            value={props.searchText}
            onChangeText={(text: any)=>props.setSearchText(text)}
            />   
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: '70%',
        height: 40,
        backgroundColor: '#F0F2F5',
        borderRadius: 15,
        justifyContent: 'center',
        margin: 'auto',
    },
    searchInput:{
        width: '100%',
        height: '100%',
        paddingLeft: 15,
        fontSize: 16,
    },
        
});

export default SearchBar;