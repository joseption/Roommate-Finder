import { View, _Text } from 'react-native';
import AccountInfo from '../components/account/account-basic-info';
import _Button from '../components/control/button';
import _TextInput from '../components/control/text-input';

const AccountScreen = (props: any, {navigation}:any) => {
    /*
    Joseph: Use "account" components and add them here.
    */

    return (
    <View>
        <AccountInfo mobile={props.mobile}></AccountInfo>
    </View>
    );
};

export default AccountScreen;