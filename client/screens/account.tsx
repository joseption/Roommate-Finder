import { useEffect, useState } from 'react';
import { View, _Text } from 'react-native';
import AccountAbout from '../components/account/account-about-you';
import AccountInfo from '../components/account/account-basic-info';
import StartSurvey from '../components/account/start-survey';
import _Button from '../components/control/button';
import _TextInput from '../components/control/text-input';
import { AccountScreenType, NavTo } from '../helper';

const AccountScreen = (props: any, {navigation}:any) => {
    useEffect(() => {
        if (props.accountView &&
            props.accountView === AccountScreenType.about ||
            !props.accountView &&
            props.url &&
            props.url.includes("?view=about")) {
            setView(AccountScreenType.about);
        }
        else if (props.accountView &&
            props.accountView === AccountScreenType.survey ||
            !props.accountView &&
            props.url &&
            props.url.includes("?view=survey")) {
            setView(AccountScreenType.survey);
        }
        else
            setView(AccountScreenType.info);
    }, [props.url, props.accountView]);

    const setView = (type: AccountScreenType) => {
        // JA TODO need to auto save if user is switching views
        var view = 'info';
        if (type == AccountScreenType.about)
            view = 'about'
        else if (type == AccountScreenType.survey)
            view = 'survey' // JA todo nav back to info if someone tries to manually nav here
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
            <StartSurvey
            mobile={props.mobile}
            error={props.error}
            setError={props.setError}
            setView={(e: any) => setView(e)}
            />
            }
        </View>
        }
    </View>
    );
};

export default AccountScreen;