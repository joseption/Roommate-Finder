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
import { AccountScreenType, getLocalStorage, isLoggedIn, isSetup, navProp, NavTo } from '../../helper';
import { useNavigation } from '@react-navigation/native';

const Navigation = (props: any) => {
    const [showMenu,setShowMenu] = useState(false);
    const [visible,setVisible] = useState(false);
    const [init,setInit] = useState(false);
    const [image,setImage] = useState('');
    const navigation = useNavigation<navProp>();

    useEffect(() => {
        if (!props.mobile)
            setShowMenu(false);
        let rt = route();
        if (rt && rt.name && !init)
            setNavigation(rt.name);
        setVisible(props.isLoggedIn);
        setInit(true);
        if (props.isLoggedIn)
            profilePicture();
        else
            setImage('');
        
    }, [props.mobile, visible, props.isLoaded, props.isLoggedIn, props.isSetup, props.navSelector, image]);

    const route = () => {
        if (navigation) {
          let state = navigation.getState();
          if (state && state.routes) {
            let idx = state.index;
            if (!idx) {
                idx = state.routes.length - 1;
            }
            return state.routes[idx];
          }
        }
    
        return null;
    }

    const setNavigation = (nav: any) => {
        if (nav == NavTo.Account)
            nav = NavTo.Profile
        props.setNavSelector(nav);
            
        setVisible(nav != NavTo.Login);
    };

    const navigate = (nav: never, params: any = {}) => {
        setNavigation(nav);
        setShowMenu(false);
        navigation.navigate(nav, params as never);
    };

    const toggleMenu = () => {
        setShowMenu(!showMenu);
    };

    const getMenuStyle = () => {
        var style = [];
        style.push(styles.menu);
        var right = (props.width - Content.width) / 2;
        var placement = {
            top: props.height,
            right: right
        }
        style.push(placement);

        return style;
    }

    const setNavLayout = (e: any) => {
        props.setHeight(e.nativeEvent.layout.height);
        props.setWidth(e.nativeEvent.layout.width);
    }

    const setAccount = () => {
        props.setAccountView(AccountScreenType.info);
        navigate(NavTo.Account);
    }

    const navigateMobileMatches = () => {
        navigate(NavTo.Search, {view: 'matches'});
        if (props.setIsMatches)
            props.setIsMatches(true);
    }

    const profilePicture = async () => {
        let data = await getLocalStorage();
        if (data && data.user) {
            setImage(data.user.image);
        }
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
                        {props.isSetup ?
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
                        : null }
                        <Pressable
                        onPress={() => toggleMenu()}
                        style={styles.icon}
                        >
                            <View
                            style={styles.userIconContainer}
                            >
                                {image ?
                                <_Image
                                style={styles.userIcon}
                                source={image}
                                height={40}
                                width={40}
                                />
                                :
                                <_Image
                                style={styles.userIcon}
                                source={require('../../assets/images/user.png')}
                                height={30}
                                width={30}
                                />
                                }
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
                        {props.isSetup ?
                        <View>
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
                        </View>
                        : null }
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
            {props.isSetup && visible ?
                <View
                style={styles.mobileContainer}
                >
                    <NavMobileButton
                    navigate={navigate}
                    icon="user"
                    currentNav={props.navSelector}
                    navTo={NavTo.Account}
                    />
                    <NavMobileButton
                    navigate={navigate}
                    icon="poll"
                    currentNav={props.navSelector}
                    navTo={NavTo.Survey}
                    />
                    <NavMobileButton
                    navigate={navigate}
                    icon="house-flag"
                    currentNav={props.navSelector}
                    navTo={NavTo.Listings}
                    />
                    <NavMobileButton
                    navigate={navigateMobileMatches}
                    icon="check-double"
                    currentNav={props.navSelector}
                    navTo={NavTo.Search}
                    />
                    <NavMobileButton
                    navigate={navigate}
                    icon="message"
                    currentNav={props.navSelector}
                    navTo={NavTo.Messages}
                    count={7}
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
            margin: 'auto',
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