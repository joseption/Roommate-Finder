import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { navProp } from '../../App';
import _Text from '../../components/control/text';
import { Color, FontSize, Radius, Style } from '../../style';

const NavMobileButton = (props: any) => {
    /* Props
    NOTE: This is for the top navigation only. Use a regular button and add a new global style instead.
    icon: Give the icon an icon name (from the available Font Awesome icon library, you may need to implement more icons in app file)
    currentNav: The current page in the stack
    navigate: Navigate to a page in the stack using a NavTo option
    */
    const navigation = useNavigation<navProp>();
    const iconStyle = (nav: string) => {
        if (nav != props.currentNav)
            return styles.icon;
        else
            return styles.iconSelected;
    };

    const indicateStyle = (nav: string) => {
        if (nav == props.currentNav)
            return styles.indicator;
        else
            return null;
    };

    const press = () => {
        if (props.navigate) {
            navigation.navigate(props.navigate);
        }
    }

    return (
    <Pressable
    onPress={() => press()}
    style={styles.container}
    >
        <FontAwesomeIcon style={iconStyle(props.navigate)} icon={props.icon} />
        <View style={indicateStyle(props.navigate)}></View>
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
        color: Color.icon,
        paddingBottom: 10,
        outlineStyle: 'none'
    },
    iconSelected: {
        color: Color.default,
        height: 20,
        paddingBottom: 10,
    },
    indicator: {
        width: '100%',
        borderBottomColor: Color.default,
        borderBottomWidth: 2
    },
});

export default NavMobileButton;
