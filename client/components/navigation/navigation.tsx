import React, { useEffect, useState } from 'react';
import { Platform, Pressable, StyleSheet, View } from 'react-native';
import _Button from '../control/button';
import _TextInput from '../control/text-input';
import _Text from '../control/text';
import _Image from '../control/image';
import { Color, Content, FontSize, Radius, Style } from '../../style';
import NavMenuButton from '../control/nav-menu-button';
import NavMobileButton from '../control/nav-mobile-button';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { AccountScreenType, navProp, NavTo } from '../../helper';
import { useNavigation } from '@react-navigation/native';

const Navigation = (props: any) => {
    const [showMenu,setShowMenu] = useState(false);
    const [visible,setVisible] = useState(false);
    const [init,setInit] = useState(false);
    const [navSelector,setNavSelector] = useState('');
    const navigation = useNavigation<navProp>();

    useEffect(() => {
        if (props.mobile) {
            setShowMenu(false);
        }

        let rt = route();
        if (rt && rt.name) {
            setNavigation(rt.name);
            if (!init) {
                if (Platform.OS !== 'web') {
                    setInit(true);
                }
            }
        }
        setVisible(props.isLoggedIn); // JA TEMP -> props.isLoggedIn
        
    }, [props.mobile, visible, props.navigation, props.isLoggedIn]);

    const route = () => {
        if (props.navigation) {
          let state = props.navigation.getState();
          if (state) {
            let idx = state.index;
            if (!idx) {
                idx = state.routes ? state.routes.length - 1 : 0;
            }
            return state.routes[idx];
          }
        }
    
        return null;
    }

    const setNavigation = (nav: any) => {
        if (props.setCurrentNav)
            props.setCurrentNav(nav);
        if (nav == NavTo.Account)
            nav = NavTo.Profile
        setNavSelector(nav)
        setVisible(nav != NavTo.Login);
    };

    const navigate = (nav: never, params: any = {}) => {
        setNavigation(nav);
        setShowMenu(false);
        if (props.navigation)
            props.navigation.navigate(nav, params as never);
        else if (navigation)
            navigation.navigate(nav, params as never);
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

    const setAccount = () => {
        props.setAccountView(AccountScreenType.info);
        navigate(NavTo.Account);
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
                    source={require('../../assets/images/logo.png')}
                    height={30}
                    onPress={() => navigate(NavTo.Home)}
                    pressStyle={styles.logoContainer}
                    containerStyle={styles.logoContainerStyle}
                    />
                    {visible ?
                    <View
                    style={styles.iconContainer}
                    >
                        <Pressable
                        onPress={() => navigate(NavTo.Messages)}
                        style={styles.icon}
                        >
                            <FontAwesomeIcon
                            size={18}
                            color={Color.icon}
                            style={styles.message}
                            icon="message"
                            />
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
                            <FontAwesomeIcon
                            color={Color.icon}
                            size={14}
                            style={styles.menuIcon}
                            icon="caret-down" />
                        </Pressable>
                    </View>
                    :
                    null
                    }
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
                        navigate={() => setAccount()}
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
                        navigate={() => {
                            navigate(NavTo.Search, {view: 'matches'});
                            props.setIsMatches(true)}
                        }
                        icon="check-double"
                        value="See Matches"
                        navTo={NavTo.Search}
                        />
                        <NavMenuButton
                        navigate={() => {
                            navigate(NavTo.Search);
                            props.setIsMatches(false)}
                        }
                        icon="globe"
                        value="Explore"
                        navTo={NavTo.Search}
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
                    currentNav={navSelector}
                    navTo={NavTo.Profile}
                    />
                    <NavMobileButton
                    navigate={() => navigate(NavTo.Survey)}
                    icon="poll"
                    currentNav={navSelector}
                    navTo={NavTo.Survey}
                    />
                    <NavMobileButton
                    navigate={() => navigate(NavTo.Listings)}
                    icon="house-flag"
                    currentNav={navSelector}
                    navTo={NavTo.Listings}
                    />
                    <NavMobileButton
                    navigate={
                        () => {
                            navigate(NavTo.Search, {view: 'matches'});
                            if (props.setIsMatches)
                                props.setIsMatches(true);
                        }
                    }
                    icon="check-double"
                    currentNav={navSelector}
                    navTo={NavTo.Search}
                    />
                    <NavMobileButton
                    navigate={() => navigate(NavTo.Messages)}
                    icon="message"
                    currentNav={navSelector}
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
                    position: 'fixed',
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
                    outlineStyle: 'none',
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
        },
        logoContainerStyle: {
            paddingTop: 5,
            paddingBottom: 5
        }
    });

export default Navigation;