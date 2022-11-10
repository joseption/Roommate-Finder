import { Platform, ScrollView, StyleSheet, View } from 'react-native';
import _TextInput from '../control/text-input';
import _Dropdown from '../control/dropdown';
import _Checkbox from '../control/checkbox';
import _Group from '../control/group';
import _Text from '../control/text';
import React, { useState } from 'react';
import { Color, FontSize, Radius, Style } from '../../style';
import { styles } from '../../screens/login';
import _Button from '../control/button';
import _Image from '../control/image';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import DocumentPicker, {DirectoryPickerResponse, DocumentPickerResponse, isInProgress, types} from 'react-native-document-picker'
import { AccountScreenType } from '../../helper';

const AccountInfo = (props: any, {navigation}:any) => {
    const [error,setError] = useState('');
    const [monthForm,setMonthForm] = useState('');
    const [dayForm,setDayForm] = useState('');
    const [yearForm,setYearForm] = useState('');
    const [genderForm,setGenderForm] = useState('');
    const [cityForm,setCityForm] = useState('');
    const [stateForm,setStateForm] = useState('');
    const [zipCodeForm,setZipCodeForm] = useState('');
    const [publicPhoneForm,setPublicPhoneForm] = useState(false);
    const [photoError,setPhotoError] = useState('');
    const [photoResult, setPhotoResult] = React.useState<Array<DocumentPickerResponse> | DirectoryPickerResponse | undefined | null>()
    // JA TODO props.accountIsSetup need to know if the account is setup or not
    const errorStyle = () => {
        var style = [];
        style.push(Style.textDanger);
        if (props.mobile)
          style.push(Style.errorText);        
        return style;
    }

    const errorContainerStyle = () => {
        var style = [];
        if (props.mobile) {
            style.push(Style.errorMsgMobile);
        }
        else {
            style.push(Style.errorMsg);
        }
        return style;
    }

    const containerStyle = () => {
        var padding = 20;
        var borderRadius = Radius.large;
        var borderColor = Color.border;
        var borderWidth = 1;
        var marginTop = 10;
        if (props.mobile) {
            padding = 0;
            borderRadius = 0;
            borderWidth = 0;
            marginTop = 0
        }

        return {
            padding: padding,
            borderRadius: borderRadius,
            borderColor: borderColor,
            borderWidth: borderWidth,
            marginTop: marginTop
        }
    }

    const title = () => {
        // JA TODO Switch text based on account setup or not
        return "Setup your profile";
    }

    const subtitle = () => {
        // JA TODO Switch text based on account setup or not
        return "We need some basic information";
    }

    const subTitleStyle = () => {
        var style = [];
        style.push(_styles.subtitle);
        if (props.mobile) {
            style.push(_styles.subTitleMobile);
        }
        
        return style;
    }

    const setPhoto = async () => {
        try { // JA NEED TO SETUP PROPERLY
            const img = await DocumentPicker.pick({type: types.images});;
            setPhotoResult(img);
        }
        catch (e: any) {
            var x = e;
        }
    }

    return (
    <ScrollView>
        <View>
            <View
            style={_styles.titleContainer}
            >
                <_Text
                style={_styles.title}
                >
                    {title()}
                </_Text>
                <_Button
                style={Style.buttonDefaultInverted}
                textStyle={Style.buttonDefaultInvertedText}
                onPress={(e: any) => props.setView(AccountScreenType.about)}
                >
                    Edit Interests
                </_Button>
            </View>
        </View>
        <View
        style={[containerStyle(), _styles.container]}
        >
            <_Text
            style={subTitleStyle()}
            >
                {subtitle()}
            </_Text>
            <View>
            <_Group
            vertical={true}
            style={_styles.imageContainer}
            >
                {!props.accountPhoto ?
                <View
                style={[_styles.image, _styles.defaultImage]}
                >
                    <FontAwesomeIcon style={_styles.newUserIcon} size={40} color={Color.border} icon="user-plus"></FontAwesomeIcon>
                </View>
                :
                <_Image
                style={_styles.image}
                // source={require(props.accountPhoto)}
                >
                </_Image>
                }
                {/* // JA todo need to hook up add photo button */}
                <_Text
                style={[Style.textSmallDanger, _styles.photoError]}
                >
                    {photoError}
                </_Text>
                <_Button
                onPress={(e: any) => setPhoto()}
                >
                    {!props.accountIsSetup ? 'Add Photo' : 'Change Photo'}
                </_Button>
            </_Group>
            </View>
            <_TextInput
            label="First Name"
            required={true}
            containerStyle={_styles.formGap}
            maxLength={50}
            ></_TextInput>
            <_TextInput
            label="Last Name"
            required={true}
            containerStyle={_styles.formGap}
            maxLength={50}
            ></_TextInput>
            <_Group
            required={true}
            style={_styles.formGap}
            mobile={props.mobile}
            label="Birthday"
            >
                <_Dropdown
                label="Month"
                options={
                    [{key:1, value:'TestSelect'},{key:42, value:'Another'},{key:2, value:'Select'},{key:3, value:'Testing'},{key:4, value:'LookHere'},{key:5, value:'What is this?'},{key:6, value:'Some Option'},{key:7, value:'No Thank you'},{key:8, value:'Another Test'},{key:9, value:'LookHere'},{key:10, value:'TestSelect'},{key:12, value:'Another'},{key:13, value:'Select'},{key:14, value:'Testing'},{key:15, value:'LookHere'},{key:16, value:'What is this?'},{key:17, value:'Some Option'},{key:18, value:'No Thank you'},{key:19, value:'Another Test'},{key:20, value:'LookHere'},{key:21, value:'TestSelect'},{key:22, value:'Another'},{key:23, value:'Select'},{key:24, value:'Testing'},{key:425, value:'LookHere'},{key:26, value:'What is this?'},{key:27, value:'Some Option'},{key:28, value:'No Thank you'},{key:29, value:'Another Test'},{key:30, value:'LookHere'}]
                }
                selected={(e: any) => setMonthForm(e)}
                ></_Dropdown>
                <_Dropdown
                label="Day"
                selected={(e: any) => setDayForm(e)}
                ></_Dropdown>
                <_Dropdown
                label="Year"
                selected={(e: any) => setYearForm(e)}
                ></_Dropdown>
            </_Group>
            <_Group
            mobile={props.mobile}
            style={_styles.formGap}
            noBackground={true}
            >
                <_TextInput
                label="Phone Number"
                required={true}
                maxLength={10}
                type="phone"
                ></_TextInput>
                <_Checkbox
                label="Public Phone Number"
                checked={(e: any) => setPublicPhoneForm(e)}
                />
            </_Group>
            <_Group
            label="Location"
            mobile={props.mobile}
            required={true}
            style={_styles.formGap}
            >
                <_TextInput
                label="Zip Code"
                onChangeText={(e: any) => setZipCodeForm(e)}
                ></_TextInput>
                <_TextInput
                label="City"
                onChangeText={(e: any) => setCityForm(e)}
                ></_TextInput>
                <_Dropdown
                label="State"
                selected={(e: any) => setStateForm(e)}
                ></_Dropdown>
            </_Group>
            <_Dropdown
            label="Gender"
            selected={(e: any) => setGenderForm(e)}
            ></_Dropdown>
        </View>
        <View
        style={_styles.buttonContainer}
        >
            {props.accountIsSetup ?
            <_Button
            style={[Style.buttonDefault, _styles.passwordButton]}
            >
                Change Password
            </_Button>
            : null }
            <_Button
            style={Style.buttonSuccess}
            >
                {props.accountIsSetup ? 'Save' : 'Next'}
            </_Button>
        </View>
        {props.error ?
        <_Text containerStyle={errorContainerStyle()} style={errorStyle()}>{error}</_Text>
        : null}
    </ScrollView>
    );
};

const _styles = StyleSheet.create({
    photoError: {
        marginBottom: 5,
        height: 17
    },
    newUserIcon: {
        ...Platform.select({
            web: {
                outlineStyle: 'none'
            }
        })
    },
    passwordButton: {
        marginRight: 5,
    },
    buttonContainer: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'flex-end',
        marginTop: 20,
        marginBottom: 20
    },
    titleContainer: {
        display: 'flex',
        justifyContent: 'space-between',
        flexDirection: 'row',
        alignItems: 'center'
    },
    defaultImage: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },
    imageContainer: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 15,
        marginBottom: 15,
    },
    image: {
        width: 125,
        height: 125,
        backgroundColor: Color.white,
        borderColor: Color.border,
        borderWidth: 1,
        borderRadius: Radius.round,
        marginBottom: 5,
    },
    group: {
        backgroundColor: Color.default
    },
    groupFocus: {
        zIndex: 1,
        elevation: 1
    },
    container: {
        backgroundColor: Color.white,
    },
    title: {
        fontFamily: 'Inter-SemiBold',
        fontSize: FontSize.large
    },
    subtitle: {
        color: Color.textTertiary,
        paddingBottom: 20,
        fontSize: FontSize.large
    },
    subTitleMobile: {
        fontSize: FontSize.default
    },
    formGap: {
        marginBottom: 15
    },
    checkbox: {
        ...Platform.select({
            android: {
                backgroundColor: Color.black
            }
        }),
    }
});

export default AccountInfo;