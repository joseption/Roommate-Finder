import { Platform, ScrollView, StyleSheet, TextInput, View } from 'react-native';
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
import DocumentPicker, {DirectoryPickerResponse, DocumentPickerResponse, isInProgress} from 'react-native-document-picker'
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
    const [dayOptions,setDayOptions] = useState([]);
    const dayRef = React.useRef<React.ElementRef<typeof _Dropdown> | null>(null);
    const [photoResult, setPhotoResult] = React.useState<Array<DocumentPickerResponse> | DirectoryPickerResponse | undefined | null>()
    // JA TODO props.accountIsSetup need to know if the account is setup or not
    const errorStyle = () => {
        var style = [];
        style.push(Style.textDanger);
        if (props.mobile)
          style.push(Style.errorText);        
        return style;
    }

    const setMonth = (e: any) => {
        setMonthForm(e);
        getDayOptions(e, yearForm);
    }

    const setYear = (e: any) => {
        setYearForm(e);
        getDayOptions(monthForm, e);
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
            const img = await DocumentPicker.pickSingle({type: [DocumentPicker.types.images]});
            setPhotoResult(img);
        }
        catch (e: any) {
            var x = e;
        }
    }

    const getYearOptions = () => {
        var years = [];
        var year = new Date().getFullYear();
        for (var i = 0; i < 100; i++) {
            years.push({key:year, value:year.toString()});
            year--;
        }
        return years;
    }

    const getMonthOptions = () => {
        return [{key:1, value:'January'},{key:2, value:'February'},{key:3, value:'March'},{key:4, value:'April'},{key:5, value:'May'},{key:6, value:'June'},{key:7, value:'July'},{key:8, value:'August'},{key:9, value:'September'},{key:10, value:'October'},{key:11, value:'November'},{key:12, value:'December'}]
    }

    const getStateOptions = () => {
        return [{key:'AL', value: 'Alabama'},{key:'AK', value: 'Alaska'},{key:'AZ', value: 'Arizona'},{key:'AR', value: 'Arkansas'},{key:'CA', value: 'California'},{key:'CO', value: 'Colorado'},{key:'CT', value: 'Connecticut'},{key:'DE', value: 'Delaware'},{key:'DC', value: 'District Of Columbia'},{key:'FL', value: 'Florida'},{key:'GA', value: 'Georgia'},
{key:'HI', value: 'Hawaii'},{key:'ID', value: 'Idaho'},{key:'IL', value: 'Illinois'},{key:'IN', value: 'Indiana'},{key:'IA', value: 'Iowa'},{key:'KS', value: 'Kansas'},{key:'KY', value: 'Kentucky'},{key:'LA', value: 'Louisiana'},{key:'ME', value: 'Maine'},{key:'MD', value: 'Maryland'},{key:'MA', value: 'Massachusetts'},{key:'MI', value: 'Michigan'},{key:'MN', value: 'Minnesota'},{key:'MS', value: 'Mississippi'},{key:'MO', value: 'Missouri'},{key:'MT', value: 'Montana'},{key:'NE', value: 'Nebraska'},{key:'NV', value: 'Nevada'},{key:'NH', value: 'New Hampshire'},{key:'NJ', value: 'New Jersey'},{key:'NM', value: 'New Mexico'},{key:'NY', value: 'New York'},{key:'NC', value: 'North Carolina'},{key:'ND', value: 'North Dakota'},{key:'OH', value: 'Ohio'},{key:'OK', value: 'Oklahoma'},{key:'OR', value: 'Oregon'},{key:'PA', value: 'Pennsylvania'},{key:'RI', value: 'Rhode Island'},{key:'SC', value: 'South Carolina'},{key:'SD', value: 'South Dakota'},{key:'TN', value: 'Tennessee'},{key:'TX', value: 'Texas'},{key:'UT', value: 'Utah'},{key:'VT', value: 'Vermont'},{key:'VA', value: 'Virginia'},{key:'WA', value: 'Washington'},{key:'WV', value: 'West Virginia'},{key:'WI', value: 'Wisconsin'},{key:'WY', value: 'Wyoming'}];
    }

    const setGenderOptions = () => {
        return [{key:'Male', value: 'Male'}, {key:'Female', value: 'Female'}, {key:'Non-BInary', value: 'Non-Binary'}];
    }

    const getDayOptions = (sMonth: any, sYear: any) => {
        var days = [];
        if (sMonth && sYear) {
            var count = new Date(parseInt(sYear), parseInt(sMonth), 0).getDate();
            for (var i = 1; i <= count; i++) {
                days.push({key:i, value:i.toString()});
            }
            if (dayForm && parseInt(dayForm) > count) {
                setDayForm('');

            }
        }
        setDayOptions(days as never);
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
                    <FontAwesomeIcon
                    style={_styles.newUserIcon}
                    size={40} color={Color.border}
                    icon="user-plus"
                    >
                    </FontAwesomeIcon>
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
                label="Year"
                options={getYearOptions()}
                selected={(e: any) => setYear(e)}
                placeholder="Select..."
                ></_Dropdown>
                <_Dropdown
                label="Month"
                options={getMonthOptions()}
                selected={(e: any) => setMonth(e)}
                placeholder="Select..."
                ></_Dropdown>
                <_Dropdown
                label="Day"
                options={dayOptions}
                selected={(e: any) => setDayForm(e)}
                placeholder="Select..."
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
                label="Make Phone Public"
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
                maxLength={5}
                keyboardType="numeric"
                ></_TextInput>
                <_TextInput
                label="City"
                onChangeText={(e: any) => setCityForm(e)}
                ></_TextInput>
                <_Dropdown
                label="State"
                options={getStateOptions()}
                selected={(e: any) => setStateForm(e)}
                placeholder="Select..."
                direction="top"
                ></_Dropdown>
            </_Group>
            <_Dropdown
            label="Gender"
            selected={(e: any) => setGenderForm(e)}
            options={setGenderOptions()}
            direction="top"
            placeholder="Select..."
            ></_Dropdown>
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
            <_Text 
            containerStyle={errorContainerStyle()}
            innerContainerStyle={{justifyContent: 'center'}} 
            style={errorStyle()}
            >
                {error}
                </_Text>
            : null}
        </View>
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