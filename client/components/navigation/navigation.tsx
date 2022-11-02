import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import React, { useEffect, useState } from 'react';
import { Dimensions, Image, Linking, Pressable, StyleSheet, View } from 'react-native';
import _Button from '../control/button';
import _TextInput from '../control/text-input';
import _Text from '../control/text';
import _Image from '../control/image';
import { Color, Content, FontSize, Radius, Style } from '../../style';
import { isMobile } from '../../service';
import NavMenuButton from '../control/nav-menu-button';
import NavMobileButton from '../control/nav-mobile-button';
import { useNavigation } from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import { NavTo, Page } from '../../App';

type navProp = StackNavigationProp<Page>;
const Navigation = (props: any) => {
    const navigation = useNavigation<navProp>();
    const [showMenu,setShowMenu] = useState(false);
    const [mobile,setMobile] = useState(false);
    const [nav,setNav] = useState('');

    useEffect(() => {
        setMobile(isMobile());
        const subscription = Dimensions.addEventListener(
            "change",
            (e) => {
                setMobile(isMobile());
                if (isMobile()) {
                    setShowMenu(false);
                }
            }
        );

        Linking.getInitialURL().then((url: any) => {
            setNavigation(url);
        }).catch(() => setNavigation(''))

        return () => subscription?.remove();
    }, [mobile, nav]);

    const setNavigation = (url: string) => {
        if (loc(url, NavTo.Profile))
            setNav(NavTo.Profile);
        else if (loc(url, NavTo.Survey))
            setNav(NavTo.Survey);
        else if (loc(url, NavTo.Listings))
            setNav(NavTo.Listings);
        else if (loc(url, NavTo.Matches))
            setNav(NavTo.Matches);
        else if (loc(url, NavTo.Messages))
            setNav(NavTo.Messages);
        else
            setNav(NavTo.Home);
    };

    const loc = (url: string, param: string) => {
        return url.toLowerCase().includes(param.toLowerCase());
    }

    const navigate = (nav: never) => {
        navigation.navigate(nav);
        // JA TODO Hook up navigate highlighter for mobile view switch
    };

    const toggleMenu = () => {
        setShowMenu(!showMenu);
    };

    const getMenuStyle = () => {
        var style = [];
        style.push(styles.menu);
        var right = (props.dimensions.width - Content.width) / 2;
        var placement = {
            top: props.dimensions.height,
            right: right
        }
        style.push(placement);

        return style;
    }

    const setNavLayout = (e: any) => {
        props.setDimensions({height: e.nativeEvent.layout.height, width: e.nativeEvent.layout.width});
    }
    
    return (
        <View
        onLayout={(e: any) => setNavLayout(e)}
        style={styles.nav}
        >
            {!mobile ?
            <View
            style={styles.container}>
                <View
                style={styles.content}
                >
                    <_Image
                    source={require('../../assets/images/logo.png')}
                    height={40}
                    onPress={() => navigate(NavTo.Home)}
                    pressStyle={styles.logoContainer}
                    />
                    <View
                    style={styles.iconContainer}
                    >
                        <Pressable
                        onPress={() => null} // need to navigate to messages in the stack
                        style={styles.icon}
                        >
                            <FontAwesomeIcon style={styles.message} icon="message" />
                            <_Text
                            containerStyle={styles.countContainer}
                            style={styles.count}
                            >
                                7
                            </_Text>
                        </Pressable>
                        <Pressable
                        onPress={() => toggleMenu()}
                        style={styles.icon}
                        >
                            <View
                            style={styles.userIconContainer}
                            >
                                <_Image
                                style={styles.userIcon}
                                source={require('../../assets/images/logo.png')}
                                height={40}
                                />
                            </View>
                            <FontAwesomeIcon style={styles.menuIcon} icon="caret-down" />
                        </Pressable>
                    </View>
                </View>
                {showMenu ?
                <View>
                    <Pressable
                    onPress={() => setShowMenu(false)}
                    style={styles.menuVoid}
                    >
                    </Pressable>
                    <View
                    style={getMenuStyle()}
                    >
                        <NavMenuButton
                        navigate={NavTo.Profile}
                        icon="user"
                        value="View Profile"
                        onPress={() => setShowMenu(false)}
                        />
                        <NavMenuButton
                        navigate={NavTo.Account}
                        icon="edit"
                        value="Edit Account"
                        onPress={() => setShowMenu(false)}
                        />
                        <NavMenuButton
                        navigate={NavTo.Survey}
                        icon="poll"
                        value="Take the Survey"
                        onPress={() => setShowMenu(false)}
                        />
                        <NavMenuButton
                        navigate={NavTo.Matches}
                        icon="check-double"
                        value="See Matches"
                        onPress={() => setShowMenu(false)}
                        />
                        <NavMenuButton
                        navigate={NavTo.Explore}
                        icon="globe"
                        value="Explore"
                        onPress={() => setShowMenu(false)}
                        />
                        <NavMenuButton
                        navigate={NavTo.Listings}
                        icon="house-flag"
                        value="Room Listings"
                        onPress={() => setShowMenu(false)}
                        />
                    </View>
                </View>
                : null}
            </View>
            : 
            <View
            style={styles.mobileContainer}
            >
                <NavMobileButton
                navigate={NavTo.Profile}
                icon="user"
                currentNav={nav}
                />
                <NavMobileButton
                navigate={NavTo.Survey}
                icon="poll"
                currentNav={nav}
                />
                <NavMobileButton
                navigate={NavTo.Listings}
                icon="house-flag"
                currentNav={nav}
                />
                <NavMobileButton
                navigate={NavTo.Matches}
                icon="check-double"
                currentNav={nav}
                />
                <NavMobileButton
                navigate={NavTo.Messages}
                icon="message"
                currentNav={nav}
                />
            </View>
            }   
        </View>
        );
    };  

    const styles = StyleSheet.create({
        nav: {
            position: 'absolute',
            top: 0,
            backgroundColor: Color.white,
            width: '100%',
        },
        logoContainer: {
            display: 'flex',
            justifyContent: 'center',
        },
        container: {
            padding: 5,
            backgroundColor: Color.white,
            borderBottomColor: Color.border,
            borderBottomWidth: 1,
            display: 'flex',
            flexDirection: 'column-reverse',
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
            position: 'relative',
            outlineStyle: 'none',
        },
        userIconContainer: {
            height: 40,
            width: 40,
            overflow: 'hidden',
            borderRadius: Radius.round,
            display: 'flex',
            justifyContent: 'center'
        },
        message: {
            width: 18,
            height: 18,
            color: Color.icon,
            outlineStyle: 'none'
        },
        count: {
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
        countContainer: {
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
            borderRadius: Radius.round,
            outlineStyle: 'none',
        },
        menuIcon: {
            position: 'absolute',
            bottom: 0,
            right: -3,
            padding: 1,
            backgroundColor: Color.imgBackground,
            borderRadius: Radius.round,
            color: Color.icon,
            outlineStyle: 'none'
        },
        mobileContainer: {
            paddingTop: 10,
            backgroundColor: Color.white,
            borderBottomColor: Color.border,
            borderBottomWidth: 1,
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-around',
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
            width: 'max-content;',
            position: 'absolute',
            right: 0
        },
        menuVoid: {
            backgroundColor: Color.black,
            position: 'absolute',
            top: 0,
            left: 0,
            height: '100vh',
            width: '100vw',
            margin: -5,
            opacity: 0
        }
    });

export default Navigation;