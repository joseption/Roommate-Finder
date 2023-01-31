import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import _Text from '../../components/control/text';
import { Color, FontSize, Radius, Style } from '../../style';

const NavMenuButton = (props: any) => {
    /* Props
    NOTE: This is for the top navigation only. Use a regular button and add a new global style instead.
    icon: Give the icon an icon name (from the available Font Awesome icon library, you may need to implement more icons in app file)
    value: The text that appears next to the icon for the button
    */

    const styles = StyleSheet.create({
        content: {
            borderRadius: Radius.round,
            borderColor: Color(props.isDarkMode).imgBackground,
            borderWidth: 1,
            backgroundColor: Color(props.isDarkMode).imgBackground,
        },
        icon: {
            height: 16,
            width: 16,
            padding: 7,
            color: Color(props.isDarkMode).icon,
            outlineStyle: 'none'
        },
        container: {
            display: 'flex',
            flexDirection: 'row',
            gap: 10,
            alignItems: 'center',
            padding: 10,
            borderRadius: Radius.default
        },
        text: {
            color: Color(props.isDarkMode).textTertiary,
            fontSize: FontSize.default,
            fontFamily: 'Inter-SemiBold'
        }
    });
    
    return (
    <Pressable
    onPress={() => props.navigate()}
    style={styles.container}
    >
        <View
        style={styles.content}
        >
            <FontAwesomeIcon
            style={styles.icon}
            icon={props.icon}
            />
        </View>
        <_Text
        style={styles.text}
        >
            {props.value}
        </_Text>
    </Pressable>
    );
};

export default NavMenuButton;
