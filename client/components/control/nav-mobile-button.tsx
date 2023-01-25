import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import React, { useEffect, useState } from 'react';
import { Platform, Pressable, StyleSheet, View } from 'react-native';
import _Text from '../../components/control/text';
import { NavTo } from '../../helper';
import { Color, FontSize, Radius, Style } from '../../style';

const NavMobileButton = (props: any) => {
    /* Props
    NOTE: This is for the top navigation only. Use a regular button and add a new global style instead.
    icon: Give the icon an icon name (from the available Font Awesome icon library, you may need to implement more icons in app file)
    currentNav: The current page in the stack
    navigate: Navigate to a page in the stack using a NavTo option
    */
   useEffect(() => {

   }, []);      
    const iconStyle = () => {
        if (props.navTo != props.currentNav)
            return styles.icon;
        else
            return styles.iconSelected;
    };

    const indicateStyle = () => {
        if (props.navTo == props.currentNav)
            return styles.indicator;
        else
            return null;
    };

    const count = () => {
        if (props.count > 99) {
            return '99+';
        }
        return props.count;
    }

    const navigate = () => {
        if (props.navTo == NavTo.Search)
            props.navigate();
        else
            props.navigate(props.navTo);
    }

    return (
    <Pressable
    onPress={() => navigate()}
    style={styles.container}
    >
        <FontAwesomeIcon
        size={23}
        style={iconStyle()}
        icon={props.icon}
        />
        {props.count ?
        <_Text
        containerStyle={styles.countContainer}
        innerContainerStyle={styles.innerCountContainer}
        style={styles.count}
        >
            {count()}
        </_Text>
        : null }
        <View
        style={indicateStyle()}
        >          
        </View>
    </Pressable>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    icon: {
        height: 23,
        width: 23,
        color: Color.icon,
        marginBottom: 10,
        outlineStyle: 'none',
    },
    iconSelected: {
        color: Color.gold,
        height: 23,
        width: 23,
        marginBottom: 10,
        outlineStyle: 'none',
    },
    indicator: {
        width: '100%',
        borderBottomColor: Color.gold,
        borderBottomWidth: 2,
        position: 'absolute',
        bottom: 0,
        left: 0
    },
    count: {
        backgroundColor: Color.danger,
        fontSize: FontSize.tiny,
        color: Color.white,
        borderRadius: Radius.round,
        display: 'flex',
        alignItems: 'center',
        minWidth: 17,
        justifyContent: 'center',
        minHeight: 17,
        textAlign: 'center'
    },
    countContainer: {
        position: 'absolute',
    },
    innerCountContainer: {
        position: 'absolute',
        top: -23,
        left: 0
    }
});

export default NavMobileButton;
