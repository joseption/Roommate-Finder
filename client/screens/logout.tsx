import { useNavigation } from '@react-navigation/native';
import { userInfo } from 'os';
import { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import _Button from '../components/control/button';
import _Text from '../components/control/text';
import _TextInput from '../components/control/text-input';
import { env, getLocalStorage, navProp, NavTo, setLocalStorage } from '../helper';
import { Color } from '../style';

const LogoutScreen = (props: any) => {
    /*
    Joseph
    */
    const navigation = useNavigation<navProp>();
    const [message, setMessage] = useState('Logging out...');

    useEffect(() => {
        logout();
    },[]);

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
                    user = await setLocalStorage(null);
                }
            });
        }
        catch(e)
        {
            error = true;
        } 

        if (!error || !user) {
            navigation.navigate(NavTo.Login);
            props.setIsLoggedIn(false);
        }
        else
            setMessage("An error occurred while logging out, please reload the page and try again.");
    }

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

export const styles = StyleSheet.create({
    text: {
        fontWeight: "bold",
        color: Color.textSecondary
    },
    textContainer: {
        justifyContent: "center",
        padding: 20
    }
});

export default LogoutScreen;