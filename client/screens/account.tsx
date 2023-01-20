import { useNavigation } from '@react-navigation/native';
import { useEffect, useState } from 'react';
import { View } from 'react-native';
import AccountAbout from '../components/account/account-about-you';
import AccountInfo from '../components/account/account-basic-info';
import StartSurvey from '../components/account/start-survey';
import _Button from '../components/control/button';
import _Text from '../components/control/text';
import _TextInput from '../components/control/text-input';
import { AccountScreenType, getLocalStorage, navProp, NavTo } from '../helper';

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
                    setView(AccountScreenType.survey);
                }
                else
                    setView(AccountScreenType.info);
            }
            else
                setView(AccountScreenType.info);
        }
        else
            setView(AccountScreenType.info);
    }, [navigation, props.accountView, props.isLoggedIn]);

    const route = () => {
        if (navigation) {
            let state = navigation.getState();
            if (state) {
                return state.routes[state.index];
                }
            }
        return null;
    }

    const setView = async (type: AccountScreenType) => {
        let data = await getLocalStorage();
        //if (!data?.user?.is_setup && data.user.setup_step !== "survey" && type == AccountScreenType.survey)
           // type = AccountScreenType.info;
        // JA TODO need to auto save if user is switching views
        var view = 'info';
        if (type == AccountScreenType.about)
            view = 'about'
        else if (type == AccountScreenType.survey)
            view = 'survey'
        props.navigation.navigate(NavTo.Account, {view: view});
        props.setAccountView(type);
    }

    return (
    <View>
        {props.accountView === AccountScreenType.info ?
        <AccountInfo
        mobile={props.mobile}
        error={props.error}
        setError={props.setError}
        setView={(e: any) => setView(e)}
        />
        :
        <View>
            {props.accountView === AccountScreenType.about ?
            <AccountAbout
            mobile={props.mobile}
            error={props.error}
            setError={props.setError}
            setView={(e: any) => setView(e)}
            />
            :
            <View>
                {props.accountView === AccountScreenType.survey ?
                <StartSurvey
                mobile={props.mobile}
                error={props.error}
                setError={props.setError}
                setView={(e: any) => setView(e)}
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