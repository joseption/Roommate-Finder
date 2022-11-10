import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import React, { useEffect } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import _Text from '../../components/control/text';
import { Color, FontSize, Radius, Style } from '../../style';

const NavMobileButton = (props: any) => {
    /* Props
    NOTE: This is for the top navigation only. Use a regular button and add a new global style instead.
    icon: Give the icon an icon name (from the available Font Awesome icon library, you may need to implement more icons in app file)
    currentNav: The current page in the stack
    navigate: Navigate to a page in the stack using a NavTo option
    */   
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

    return (
    <Pressable
    onPress={() => props.navigate()}
    style={styles.container}
    >
        <FontAwesomeIcon
        size={20}
        style={iconStyle()}
        icon={props.icon}
        />
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
        height: 20,
        width: 20,
        color: Color.icon,
        marginBottom: 10,
        outlineStyle: 'none',
    },
    iconSelected: {
        color: Color.default,
        height: 20,
        width: 20,
        marginBottom: 10,
    },
    indicator: {
        width: '100%',
        borderBottomColor: Color.default,
        borderBottomWidth: 2,
        position: 'absolute',
        bottom: 0,
        left: 0
    },
});

export default NavMobileButton;
