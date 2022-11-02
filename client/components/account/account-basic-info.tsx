import { View, _Text } from 'react-native';
import _TextInput from '../control/text-input';
import _Dropdown from '../control/dropdown';
import _Checkbox from '../control/checkbox';
import _Group from '../control/group';

const AccountInfo = (props: any, {navigation}:any) => {
    return (
    <View>
        <View>

        </View>
        <_TextInput></_TextInput>
        <_TextInput></_TextInput>
        <_Group>
            <_Dropdown></_Dropdown>
            <_Dropdown></_Dropdown>
            <_Dropdown></_Dropdown>
        </_Group>
        <View>
        <_TextInput></_TextInput>
        <_Checkbox></_Checkbox>
        </View>
        <_Group>
            <_Dropdown></_Dropdown>
            <_Dropdown></_Dropdown>
            <_Dropdown></_Dropdown>
        </_Group>
        <_Dropdown></_Dropdown>
    </View>
    );
};

export default AccountInfo;