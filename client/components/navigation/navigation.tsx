import React, { useEffect, useState } from 'react';
import { Platform, Pressable, StyleSheet, View } from 'react-native';
import _Button from '../control/button';
import _TextInput from '../control/text-input';
import _Text from '../control/text';
import _Image from '../control/image';
import { Color, Content, FontSize, Radius, Style } from '../../style';
import { isMobile, NavTo, Page } from '../../helper';
import NavMenuButton from '../control/nav-menu-button';
import NavMobileButton from '../control/nav-mobile-button';
import { useNavigation, useNavigationState } from '@react-navigation/native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';

const Navigation = (props: any) => {
    const navigation = useNavigation();
    const [showMenu,setShowMenu] = useState(false);
    const [visible,setVisible] = useState(false);
    const [init,setInit] = useState(false);
    const [nav,setNav] = useState('');

    useEffect(() => {
        if (isMobile()) {
            setShowMenu(false);
        }
        if (props.screen) {
            if (!init) {
                setNavigation(props.screen);
                if (Platform.OS !== 'web') {
                    setInit(true);
                }
            }
        }
        else {
            var state = navigation.getState();
                if (state) {
                var routes = state.routes;
                if (routes) {
                    var route = routes[routes.length - 1].path;
                    setNavigation(route);
                }
            }
        }
    }, [props.mobile, nav, visible, props.route, props.screen]);

    const setNavigation = (route: any) => {
        if (loc(route, NavTo.Profile))
            setNav(NavTo.Profile);
        else if (loc(route, NavTo.Survey))
            setNav(NavTo.Survey);
        else if (loc(route, NavTo.Listings))
            setNav(NavTo.Listings);
        else if (loc(route, NavTo.Matches))
            setNav(NavTo.Matches);
        else if (loc(route, NavTo.Messages))
            setNav(NavTo.Messages);
        else
            setNav(NavTo.Home);

        setVisible(!loc(route, NavTo.Login));
    };

    const loc = (route: string, link: string) => {
        if (route && link) {
            return route.toLowerCase().includes(link.toLowerCase());
        }
        else {
            return false;
        }
    }

    const navigate = (nav: never) => {
        setNavigation(nav);
        setShowMenu(false)
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
            {!props.mobile ?
            <View
            style={styles.container}>
                <View
                style={styles.content}
                >
                    <_Image
                    //source={require('../../assets/images/logo.png')} //JA failing on android is it because it's a static image? look at image.getsize
                    height={40}
                    onPress={() => navigate(NavTo.Home)}
                    pressStyle={styles.logoContainer}
                    />
                    <View
                    style={styles.iconContainer}
                    >
                        <Pressable
                        onPress={() => null} // JA need to navigate to messages in the stack
                        style={styles.icon}
                        >
                            <FontAwesomeIcon size={18} color={Color.icon} style={styles.message} icon="message" />
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
                                // source={require('../../assets/images/logo.png')} // JA not working android with image.getsize .. is it because it's local??
                                height={40}
                                />
                            </View>
                            <FontAwesomeIcon color={Color.icon} size={14} style={styles.menuIcon} icon="caret-down" />
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
                        navigate={() => navigate(NavTo.Profile)}
                        icon="user"
                        value="View Profile"
                        navTo={NavTo.Profile}
                        />
                        <NavMenuButton
                        navigate={() => navigate(NavTo.Account)}
                        icon="edit"
                        value="Edit Account"
                        navTo={NavTo.Account}
                        />
                        <NavMenuButton
                        navigate={() => navigate(NavTo.Survey)}
                        icon="poll"
                        value="Take the Survey"
                        navTo={NavTo.Survey}
                        />
                        <NavMenuButton
                        navigate={() => navigate(NavTo.Matches)}
                        icon="check-double"
                        value="See Matches"
                        navTo={NavTo.Matches}
                        />
                        <NavMenuButton
                        navigate={() => navigate(NavTo.Explore)}
                        icon="globe"
                        value="Explore"
                        navTo={NavTo.Explore}
                        />
                        <NavMenuButton
                        navigate={() => navigate(NavTo.Listings)}
                        icon="house-flag"
                        value="Room Listings"
                        navTo={NavTo.Listings}
                        />
                        <NavMenuButton
                        navigate={() => navigate(NavTo.Logout)}
                        icon="sign-out"
                        value="Logout"
                        navTo={NavTo.Logout}
                        />
                    </View>
                </View>
                : null}
            </View>
            :
            <View>
            {visible ?
                <View
                style={styles.mobileContainer}
                >
                    <NavMobileButton
                    navigate={() => navigate(NavTo.Profile)}
                    icon="user"
                    currentNav={nav}
                    navTo={NavTo.Profile}
                    />
                    <NavMobileButton
                    navigate={() => navigate(NavTo.Survey)}
                    icon="poll"
                    currentNav={nav}
                    navTo={NavTo.Survey}
                    />
                    <NavMobileButton
                    navigate={() => navigate(NavTo.Listings)}
                    icon="house-flag"
                    currentNav={nav}
                    navTo={NavTo.Listings}
                    />
                    <NavMobileButton
                    navigate={() => navigate(NavTo.Matches)}
                    icon="check-double"
                    currentNav={nav}
                    navTo={NavTo.Matches}
                    />
                    <NavMobileButton
                    navigate={() => navigate(NavTo.Messages)}
                    icon="message"
                    currentNav={nav}
                    navTo={NavTo.Messages}
                    />
                </View>
                :
                null }
            </View>
            }   
        </View>
        );
    };  

    const styles = StyleSheet.create({
        nav: {
            backgroundColor: Color.white,
            width: '100%',
            ...Platform.select({
                web: {
                    position: 'fixed', // JA Has error on 'nav' style but works on web
                }
            })
        },
        logoContainer: {
            display: 'flex',
            justifyContent: 'center',
        },
        container: {
            paddingTop: 5,
            paddingBottom: 5,
            backgroundColor: Color.white,
            borderBottomColor: Color.border,
            borderBottomWidth: 1,
            display: 'flex',
            flexDirection: 'column-reverse',
        },
        content: {
            width: Content.width ,
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
            marginLeft: 10,
            ...Platform.select({
                web: {
                    outlineStyle: 'none',
                }
            }),
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
            ...Platform.select({
                web: {
                    outlineStyle: 'none', // JA Has error but works fine on web
                }
            }),
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
        },
        userIcon: {
            borderRadius: Radius.round,
            ...Platform.select({
                web: {
                outlineStyle: 'none',
                }
            }),
        },
        menuIcon: {
            position: 'absolute',
            bottom: 0,
            right: -3,
            padding: 1,
            backgroundColor: Color.imgBackground,
            borderRadius: Radius.round,
            ...Platform.select({
                web: {
                outlineStyle: 'none',
                }
            }),
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