import React, { useState } from 'react';
import { StyleSheet, View, _Text } from 'react-native';
import _Button from '../components/control/button';
import _TextInput from '../components/control/textinput';
import { Style } from '../style';

const Account = (props: any, {navigation}:any) => {
    enum screen {
        info, about, survey
    }

    const [showScreen,setShowScreen] = useState();


    return (
    <View>
        
    </View>
    );
};

export default Account;