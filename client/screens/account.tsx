import { useNavigation } from '@react-navigation/native';
import { useEffect, useState } from 'react';
import { View } from 'react-native';
import AccountAbout from '../components/account/account-about-you';
import AccountInfo from '../components/account/account-basic-info';
import StartSurvey from '../components/account/start-survey';
import _Button from '../components/control/button';
import _Text from '../components/control/text';
import _TextInput from '../components/control/text-input';
import { AccountScreenType, navProp, NavTo, setLocalStorage } from '../helper';

const AccountScreen = (props: any) => {
    const navigation = useNavigation<navProp>();

    useEffect(() => {
        let rt = route();
        if (rt && rt.params && rt.name && rt.name == NavTo.Account) {
            if (rt.params['view']) {
                let view = (rt.params['view'] as string).toLowerCase();
                if (props.accountView &&
                    props.accountView === AccountScreenType.about ||
                    !props.accountView &&
                    view.includes("about")) {
                    setView(AccountScreenType.about);
                }
                else if (props.accountView &&
                    props.accountView === AccountScreenType.survey ||
                    !props.accountView &&
                    view.includes("survey")) {
                    if (props.isSetup) {
                        if (props.setup_step == 'explore') {
                            navigation.navigate(NavTo.Search);
                        }
                        else {
                            navigation.navigate(NavTo.Survey);
                        }
                    }
                    else
                        setView(AccountScreenType.survey);
                }
                else
                    setView(AccountScreenType.info);
            }
            else
                setView(AccountScreenType.info);
        }
    }, [navigation, props.accountView, props.isLoggedIn, props.setupStep, props.isSetup]);

    const route = () => {
        if (navigation) {
            let state = navigation.getState();
            if (state && state.routes) {
                return state.routes[state.index];
            }
        }
        return null;
    }

    const setView = async (type: AccountScreenType) => {
        var view = 'info';
        if (type == AccountScreenType.about)
            view = 'about'
        else if (type == AccountScreenType.survey)
            view = 'survey'
        props.navigation.navigate(NavTo.Account, {view: view});
        props.setAccountView(type);
    }

    const unauthorized = async () => {
        await setLocalStorage(null);
        navigation.navigate(NavTo.Login);
        navigation.reset({
            index: 0,
            routes: [{name: NavTo.Login, params: {timeout: 'yes'} as never}],
        });
        props.setIsLoggedIn(false);
        props.setIsSetup(false);
    }

    const containerStyle = () => {
        if (!props.mobile) {
            return {paddingBottom: 20};
        }
        return {};
    }

    return (
    <View
    style={containerStyle()}
    >
        {props.accountView === AccountScreenType.info ?
        <AccountInfo
        mobile={props.mobile}
        error={props.error}
        setError={props.setError}
        setView={(e: any) => setView(e)}
        isSetup={props.isSetup}
        setPrompt={props.setPrompt}
        scrollY={props.scrollY}
        unauthorized={unauthorized}
        isDarkMode={props.isDarkMode}
        setIsDarkMode={props.setIsDarkMode}
        setUpdatePicture={props.setUpdatePicture}
        />
        :
        <View>
            {props.accountView === AccountScreenType.about ?
            <AccountAbout
            mobile={props.mobile}
            error={props.error}
            setError={props.setError}
            setView={(e: any) => setView(e)}
            isSetup={props.isSetup}
            unauthorized={unauthorized}
            isDarkMode={props.isDarkMode}
            />
            :
            <View>
                {props.accountView === AccountScreenType.survey ?
                <StartSurvey
                mobile={props.mobile}
                error={props.error}
                setError={props.setError}
                setView={(e: any) => setView(e)}
                isSetup={props.isSetup}
                setIsSetup={props.setIsSetup}
                unauthorized={unauthorized}
                isDarkMode={props.isDarkMode}
                />
                : null }
            </View>
            }
        </View>
        }
    </View>
    );
};

export default AccountScreen;