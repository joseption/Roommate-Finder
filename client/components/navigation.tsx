import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import React, { useEffect, useState } from 'react';
import { Dimensions, Image, Linking, Pressable, StyleSheet, View } from 'react-native';
import _Button from '../components/control/button';
import _TextInput from '../components/control/textinput';
import _Text from '../components/control/text';
import { Color, FontSize, Radius, Style } from '../style';
import { isMobile } from '../service';
import { brotliDecompress } from 'zlib';

const Navigation = (props: any, {navigation}:any) => {
    const enum navi {
        profile,
        survey,
        listings,
        matches,
        messages
    }
    const [showMenu,setShowMenu] = useState(false);
    const [mobile,setMobile] = useState(false);
    const [nav,setNav] = useState(-1);

    useEffect(() => {
        setMobile(isMobile());
        const subscription = Dimensions.addEventListener(
            "change",
            () => {
            setMobile(isMobile());
            }
        );

        Linking.getInitialURL().then((url: any) => {
            setNavigation(url);
        }).catch(() => setNavigation(''))

        return () => subscription?.remove();
    }, [mobile, nav]);

    const setNavigation = (url: string) => {
        if (url.includes("login")) // JA just testing, change this to "profile"!!
            setNav(navi.profile);
        else if (url.includes("survey"))
            setNav(navi.survey);
        else if (url.includes("listings"))
            setNav(navi.listings);
        else if (url.includes("matches"))
            setNav(navi.matches);
        else if (url.includes("messages"))
            setNav(navi.messages);
        else
            setNav(-1);
    };

    const iconStyle = (navi: navi) => {
        var style = [];
        style.push(styles.mobileMenuIcon);

        if (navi == nav)
            style.push(styles.iconSelected);

        return style;
    };

    const indicateStyle = (navi: navi) => {
        if (navi == nav)
            return styles.indicator;
        else
            return null;
    };

    const navigate = (navi: navi) => {
        if (mobile) {

        }
        else {

        }
    };

    const toggleMenu = () => {
        
    };
    
    return (
        <View>
            {!mobile ?
            <View
            style={styles.container}>
                <View
                style={styles.content}
                >
                    <Image
                    style={styles.logo}
                    source={require('../assets/images/logo.png')}
                    />
                    <View
                    style={styles.iconContainer}
                    >
                        <Pressable
                        onPress={() => null} // need to navigate to messages in the stack
                        style={styles.icon}
                        >
                            <FontAwesomeIcon style={styles.messageIcon} icon="message" />
                            <_Text
                            containerStyle={styles.messageCountContainer}
                            style={styles.messageCount}
                            >
                                7
                            </_Text>
                        </Pressable>
                        <Pressable
                        onPress={() => toggleMenu()}
                        style={styles.icon}
                        >
                            <Image
                            style={styles.userIcon}
                            source={require('../assets/images/logo.png')}
                            />
                            <FontAwesomeIcon style={styles.menuIcon} icon="caret-down" />
                        </Pressable>
                    </View>
                </View>
                <View
                style={styles.menu}
                >
                <Pressable
                onPress={() => navigate(navi.survey)}
                style={styles.mobileMenuIconContent}
                >
                    <FontAwesomeIcon style={iconStyle(navi.survey)} icon="user" />
                    <_Text>
                        View Profile
                    </_Text>
                </Pressable>
                </View>
            </View>
            : 
            <View
            style={styles.mobileContainer}
            >
                <Pressable
                onPress={() => navigate(navi.profile)}
                style={styles.mobileMenuIconContent}
                >
                    <FontAwesomeIcon style={iconStyle(navi.profile)} icon="user" />
                    <View style={indicateStyle(navi.profile)}></View>
                </Pressable>
                <Pressable
                onPress={() => navigate(navi.survey)}
                style={styles.mobileMenuIconContent}
                >
                    <FontAwesomeIcon style={iconStyle(navi.survey)} icon="poll" />
                    <View style={indicateStyle(navi.survey)}></View>
                </Pressable>
                <Pressable
                onPress={() => navigate(navi.listings)}
                style={styles.mobileMenuIconContent}
                >
                    <FontAwesomeIcon style={iconStyle(navi.listings)} icon="house-flag" />  
                    <View style={indicateStyle(navi.listings)}></View>
                </Pressable>
                <Pressable
                onPress={() => navigate(navi.matches)}
                style={styles.mobileMenuIconContent}
                >
                    <FontAwesomeIcon style={iconStyle(navi.matches)} icon="check-double" />
                    <View style={indicateStyle(navi.matches)}></View>
                </Pressable>
                <Pressable
                onPress={() => navigate(navi.profile)}
                style={styles.mobileMenuIconContent}
                >
                    <FontAwesomeIcon style={iconStyle(navi.messages)} icon="message" />
                    <View style={indicateStyle(navi.messages)}></View>
                </Pressable>
            </View>
            }   
        </View>
        );
    };  

    const styles = StyleSheet.create({
        logo: {
            height: 40,
            width: 80
        },
        container: {
            padding: 10,
            background: Color.white,
            borderBottomColor: Color.border,
            borderBottomWidth: 1,
        },
        content: {
            width: 980,
            margin: 'auto',
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between'
        },
        icon: {
            backgroundColor: Color.imgBackground,
            height: 40,
            width: 40,
            borderRadius: Radius.round,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            position: 'relative'
        },
        messageIcon: {
            width: 18,
            height: 18,
            color: Color.icon,
        },
        messageCount: {
            backgroundColor: Color.danger,
            fontSize: FontSize.tiny,
            color: Color.white,
            padding: 5,
            borderRadius: Radius.round,
            maxHeight: 20,
            display: 'flex',
            alignItems: 'center',
            minWidth: 20,
            justifyContent: 'center',
            height: 20,
        },
        messageCountContainer: {
            position: 'absolute',
            top: -3,
            right: -3
        },
        iconContainer: {
            display: 'flex',
            flexDirection: 'row',
            gap: 10
        },
        userIcon: {
            height: 40,
            width: 40,
            borderRadius: Radius.round,
            borderColor: Color.imgBackground,
            borderWidth: 1
        },
        menuIcon: {
            position: 'absolute',
            bottom: 0,
            right: -3,
            padding: 1,
            backgroundColor: Color.imgBackground,
            borderRadius: Radius.round,
            color: Color.icon
        },
        mobileContainer: {
            paddingTop: 10,
            background: Color.white,
            borderBottomColor: Color.border,
            borderBottomWidth: 1,
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-around',
        },
        mobileMenuIconContent: {
            flex: 1,
            justifyContent: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
        },
        mobileMenuIcon: {
            height: 20,
            color: Color.icon,
            paddingBottom: 10,
        },
        iconSelected: {
            color: Color.default
        },
        indicator: {
            width: '100%',
            borderBottomColor: Color.default,
            borderBottomWidth: 2
        },
        menu: {
            backgroundColor: Color.white,
            borderColor: Color.border,
            borderWidth: 1,
            shadowColor: Color.black,
            shadowOffset: {width: -4, height: 4},
            shadowOpacity: .15,
            shadowRadius: 15,
            padding: 10,
            borderRadius: Radius.default,
            width: 'fit-content'
        }
    });

export default Navigation;