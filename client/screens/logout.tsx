import { useNavigation } from '@react-navigation/native';
import { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import _Button from '../components/control/button';
import _Text from '../components/control/text';
import _TextInput from '../components/control/text-input';
import { env, getCurrentRooms, getLocalStorage, navProp, NavTo, setLocalAppSettingsCurrentChat, setLocalAppSettingsCurrentRooms, setLocalAppSettingsOpenPushChat, setLocalAppSettingsPushMessageToken, setLocalStorage } from '../helper';
import { Color } from '../style';

const LogoutScreen = (props: any) => {
    /*
    Joseph
    */
    const navigation = useNavigation<navProp>();
    const [message, setMessage] = useState('Logging out...');

    useEffect(() => {
        logout();
    },[props.isSetup, props.isLoggedIn]);

    const logout = async () => {
        let error = false;
        let user;
        try
        {   
            user = await getLocalStorage();
            let obj = {refreshToken:user.refreshToken};
            let js = JSON.stringify(obj);

            await fetch(`${env.URL}/auth/logout`,
            {method:'POST',body:js,headers:{'Content-Type': 'application/json'}}).then(async ret => {
                let res = JSON.parse(await ret.text());
                if (res.Error)
                {
                    error = true;
                }
                else
                {
                    setMessage('Redirecting...');
                    await setLocalStorage(null);
                    await setLocalAppSettingsCurrentRooms(null);
                    await setLocalAppSettingsCurrentChat(null);
                    await setLocalAppSettingsPushMessageToken("");
                    nav();
                    return;
                }
            });
        }
        catch(e)
        {
            error = true;
        } 
    }

    const nav = () => {
        // Set delay so rendering occurs properly to hide navigation
        props.setIsLoggingOut(true);
        props.setIsLoggedIn(false);
        props.setIsSetup(false);
        props.socket.disconnect();
        navigation.navigate(NavTo.Login);
        navigation.reset({
            index: 0,
            routes: [{name: NavTo.Login}],
        });
    }

    const styles = StyleSheet.create({
        text: {
            fontWeight: "bold",
            color: Color(props.isDarkMode).textSecondary
        },
        textContainer: {
            justifyContent: "center",
            padding: 20
        }
    });

    return (
    <View>
        <_Text
        style={styles.text}
        innerContainerStyle={styles.textContainer}
        >
            {message}
        </_Text>
    </View>
    );
};

export default LogoutScreen;