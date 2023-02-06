import { useNavigation } from '@react-navigation/native';
import { useEffect, useState } from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import _Button from '../components/control/button';
import _Text from '../components/control/text';
import _TextInput from '../components/control/text-input';
import { env, getLocalStorage, navProp, NavTo, setLocalStorage } from '../helper';
import { Color } from '../style';

const AuthScreen = (props: any) => {
    /*
    Joseph
    */
    const navigation = useNavigation<navProp>();
    const [message, setMessage] = useState('Redirecting...');

    useEffect(() => {
        let rt = route();
        let params = rt?.params as any;
        if (Platform.OS !== 'web') {
            if (params?.params) { // App open already
                params.params.type = params.screen;
                params = params.params;
            }
            else if (rt?.name) { // App not open
                params.type = rt.name;
            }
        }
        else if (params) { // Web only
            let name = rt?.name ? rt.name : '';
            Object.defineProperty(params, 'type', {value: name});
        }
        logout(params);
    },[props.isSetup, props.isLoggedIn]);

    const route = () => {
        if (navigation) {
          let state = navigation.getState();
          if (state && state.routes) {
            let idx = state.index;
            if (!idx) {
                idx = state.routes.length - 1;
            }
            let cState = state.routes[idx];
            let pState = cState.state;
            if (cState && pState) {
                // Web
                if (pState && pState.routes[0]) {
                    return pState.routes[0]
                }
            }
            else {
                // Mobile
                return cState;
            }
          }
        }
    
        return null;
    }

    const logout = async (params: any) => {
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
            navigation.reset({
                index: 0,
                routes: [{name: NavTo.Login}],
            });
            navigation.navigate(NavTo.Login, params as never);
            props.setIsLoggedIn(false);
            props.setIsSetup(false);
        }
        else
            setMessage("An error occurred while preparing account setup, reload the app and try again.");
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

export default AuthScreen;