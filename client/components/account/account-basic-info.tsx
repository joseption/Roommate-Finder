import { ActivityIndicator, Platform, ScrollView, StyleSheet, TextInput, View } from 'react-native';
import _TextInput from '../control/text-input';
import _Dropdown from '../control/dropdown';
import _Checkbox from '../control/checkbox';
import _Group from '../control/group';
import _Text from '../control/text';
import React, { useEffect, useState } from 'react';
import { Color, FontSize, Radius, Style } from '../../style';
import _Button from '../control/button';
import _Image from '../control/image';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import DocumentPicker, {DirectoryPickerResponse, DocumentPickerResponse, isInProgress} from 'react-native-document-picker'
import { AccountScreenType, authTokenHeader, env, getLocalStorage, isMobile, navProp, NavTo, setLocalStorage } from '../../helper';
import { color } from 'react-native-reanimated';
import { useNavigation } from '@react-navigation/native';
import { ImagePickerResponse, launchCamera, launchImageLibrary } from 'react-native-image-picker';
import { rmSync } from 'fs';

const AccountInfo = (props: any) => {
    const navigation = useNavigation<navProp>();
    const [error,setError] = useState('');
    const [month,setMonth] = useState('');
    const [day,setDay] = useState('');
    const [year,setYear] = useState('');
    const [firstName,setFirstName] = useState('');
    const [lastName,setLastName] = useState('');
    const [phone,setPhone] = useState('');
    const [gender,setGender] = useState('');
    const [city,setCity] = useState('');
    const [state,setState] = useState('');
    const [zipCode,setZipCode] = useState('');
    const [imageError,setImageError] = useState('');
    const [isLoading,setIsLoading] = useState(false);
    const [isPasswordLoading,setIsPasswordLoading] = useState(false);
    const [promptPassword,setPromptPassword] = useState(false);
    const [passwordEmailSent,setPasswordEmailSent] = useState(false);
    const [passwordEmailError,setPasswordEmailError] = useState(false);
    const [isSaved,setIsSaved] = useState(false);
    const [isLoaded,setIsLoaded] = useState(false);
    const [imageURL,setImageURL] = useState('');
    const [init,setInit] = useState(false);
    const [imageUri, setImageUri] = useState('');
    const [email, setEmail] = useState('');
    const [isComplete,setIsComplete] = useState(false);
    const lastNameRef = React.useRef<React.ElementRef<typeof TextInput> | null>(null);
    const yearRef = React.useRef<React.ElementRef<typeof TextInput> | null>(null);
    const phoneRef = React.useRef<React.ElementRef<typeof TextInput> | null>(null);
    const zipRef = React.useRef<React.ElementRef<typeof TextInput> | null>(null);
    const cityRef = React.useRef<React.ElementRef<typeof TextInput> | null>(null);
    const stateRef = React.useRef<React.ElementRef<typeof TextInput> | null>(null);
    useEffect(() => {
        if (!init) {
            onLoad();
            setInit(true);
        }
        if (props.isSetup && isComplete) {
            setIsSaved(true);
            setIsComplete(false);
        }
    }, [props.isSetup, isLoaded, imageURL, imageUri, isComplete])
    
    const errorStyle = () => {
        var style = [];
        style.push(Style(props.isDarkMode).textDanger);
        if (props.mobile)
          style.push(Style(props.isDarkMode).errorText);        
        return style;
    }

    const errorContainerStyle = () => {
        var style = [];
        if (props.mobile) {
            style.push(Style(props.isDarkMode).errorMsgMobile);
        }
        else {
            style.push(Style(props.isDarkMode).errorMsg);
        }
        return style;
    }

    const containerStyle = () => {
        var container = Color(props.isDarkMode).contentBackground;
        var padding = 20;
        var borderRadius = Radius.large;
        var borderColor = Color(props.isDarkMode).border;
        var borderWidth = 1;
        var marginTop = 10;
        if (props.mobile) {
            padding = 0;
            borderRadius = 0;
            borderWidth = 0;
            marginTop = 0
            container = Color(props.isDarkMode).contentBackgroundSecondary;
        }

        return {
            padding: padding,
            borderRadius: borderRadius,
            borderColor: borderColor,
            borderWidth: borderWidth,
            marginTop: marginTop,
            backgroundColor: container
        }
    }

    const title = () => {
        return props.isSetup ? "Profile settings" : "Setup your profile";
    }

    const subtitle = () => {
        return props.isSetup ? "Your basic personal information" : "We need some basic information";
    }

    const subTitleStyle = () => {
        var style = [];
        style.push(_styles.subtitle);
        if (props.mobile) {
            style.push(_styles.subTitleMobile);
        }
        
        return style;
    }

    const handleImage = (res: ImagePickerResponse) => {
        setImageError('');
        if (res && res.assets) {
            if (Platform.OS === 'web') {
                if (res.assets[0].uri) {
                    setImageUri(res.assets[0].uri);
                }
                else {
                    setImageError("Photo could not be attached");
                }
            }
            else {
                if (res.assets[0].base64) {
                    if (res.assets[0].uri) {
                        setImageURL(res.assets[0].uri);
                    }
                    setImageUri("data:image/jpeg;base64," + res.assets[0].base64);
                }
                else {
                    setImageError("Photo could not be attached");
                }
            }
        }
        else if (res.errorCode)
            setImageError("A problem occurred while attaching your photo, please try again");

        setIsSaved(false);
    }

    const takePhoto = async () => {
        launchCamera({mediaType: 'photo', maxHeight: 1000, maxWidth: 1000, cameraType: 'front', includeBase64: true, saveToPhotos: true}, (res) => {
            handleImage(res);
        });
    }

    const uploadPhoto = async () => {
        launchImageLibrary({mediaType: 'photo', maxHeight: 1000, maxWidth: 1000, includeBase64: true}, (res) => {
            handleImage(res);
        });
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
        return [{key:'Male', value: 'Male'}, {key:'Female', value: 'Female'}, {key:'Other', value: 'Other'}];
    }

    const getDayOptions = () => {
        var days = [];
        if (year && month) {
            let m = getMonthOptions().find(x => x.value == month);
            if (m) {
                var count = new Date(parseInt(year), parseInt(m.key.toString()), 0).getDate();
                for (var i = 1; i <= count; i++) {
                    days.push({key:i, value:i.toString()});
                }
                if (day && parseInt(day) > count) {
                    setDay('');

                }
            }
        }
        return days;
    }

    const triggerPrompt = () => {
        props.setPrompt(true);
        setPromptPassword(true);
    }

    const closePasswordPrompt = () => {
        setPromptPassword(false);
        setPasswordEmailSent(false);
        setPasswordEmailError(false);
        props.setPrompt(false);
    }

    const passwordContainerStyle = () => {
        let style = [];
        style.push({backgroundColor: !props.isDarkMode ? Color(props.isDarkMode).holderMask : Color(props.isDarkMode).promptMaskMobile});
        style.push(_styles.passwordPromptContainer);
        if (props.mobile) {
            style.push(_styles.passwordPromptContainerMobile);
        }
        return style;
    }

    const passwordContentStyle = () => {
        let style = [];
        style.push(_styles.passwordContainerContent);
        let top = props.scrollY ? props.scrollY : 0;
        style.push({
            top: top
        });
        return style;
    }

    const doSendEmail = async () => 
    {
        setPasswordEmailError(false);
        let hasError = false;
        try
        {    
            let email = '';
            setIsPasswordLoading(true);  
            let data = await getLocalStorage();
            if (data && data.user) {
                email = data.user.email;
            }     
            let obj = {email:email, type:'update'};
            let js = JSON.stringify(obj);
            await fetch(`${env.URL}/auth/resetPassword`,
                {method:'POST',body:js,headers:{'Content-Type': 'application/json'}}).then(async ret => {
                    let res = JSON.parse(await ret.text());
                    if(res.Error)
                    {
                        hasError = true;
                    }
                    else
                    {
                        setPasswordEmailSent(true);
                    }
                });
        }
        catch(e)
        {
            hasError = true;
        }    
        if (hasError) {
            setPasswordEmailError(true);
        }
        setIsPasswordLoading(false);
    };

    const checkSubmitDisabled = () => {
        let hasImage = imageUri || imageURL;
        return isSaved || !hasImage || !firstName || !lastName || !year || !month || !day || !phone || !zipCode || !city || !state || !gender
    }

    const completeSave = () => {
        setIsLoading(false);
        setIsSaved(true);
        if (!props.isSetup) {
            navigation.navigate(NavTo.Account, {view: 'about'} as never);
            props.setView(AccountScreenType.about);
        }
    }

    const checkSaved = () => {
        if (isLoaded) {
            setIsSaved(false);
        }
    }

    const setBirthday = (stamp: string) => {
        if (stamp) {
            let date = new Date(stamp);
            if (date) {
                let l_year = date.getFullYear().toString();
                let l_month = getMonthOptions().find(x => x.key === (date.getMonth() + 1));
                let l_day = date.getDate().toString();
                if (l_year)
                    setYear(l_year);
                if (l_month && l_month.value.length > 0)
                    setMonth(l_month.value);

                if (l_month && l_year && l_day) {
                    setDay(l_day);
                }
            }
        }
    }

    const setupPage = (data: any) => {
        if (data) {
            if (data.image)
                setImageURL(data.image);
            if (data.first_name)
                setFirstName(data.first_name);
            if (data.last_name)
                setLastName(data.last_name);
            if (data.createdAt)
                setBirthday(data.birthday);
            if (data.phone_number)
                setPhone(data.phone_number);
            if (data.zip_code)
                setZipCode(data.zip_code);
            if (data.city)
                setCity(data.city);
            if (data.state)
                setState(data.state);
            if (data.gender)
                setGender(data.gender);

            if (props.isSetup)
                setIsSaved(true);
        }
    }

    const onSave = async () => {
        if (!isSaved) {
            let hasError = false;
            setIsLoading(true);
            let birthday;
            let monthNumber = getMonthOptions().find(x => x.value == month);
            birthday = `${monthNumber?.key}/${day}/${year}`;
            let obj = {
                first_name:firstName,
                last_name:lastName, 
                birthday: birthday,
                phone_number: phone,
                zip_code: zipCode,
                city: city,
                state: state,
                gender: gender,
                imageUri: imageUri,
                imageURL: imageURL
            };

            let js = JSON.stringify(obj);
    
            try
            {   
                let tokenHeader = await authTokenHeader();
                await fetch(`${env.URL}/users/updateAllProfile`,
                {method:'POST',body:js,headers:{'Content-Type': 'application/json', 'authorization': tokenHeader}}).then(async ret => {
                let res = JSON.parse(await ret.text());
                if (res.Error)
                {
                    if (res.Error == "Un-Authorized") {
                        await props.unauthorized();
                        return;
                    }
                    hasError = true;
                }
                else
                {
                    completeSave();
                }
                });
            }
            catch(e)
            {
                hasError = true;
            }  
            if (hasError) {
                setError('A problem occurred while saving account information, please try again.');
                setIsSaved(false);
            } 

            setIsLoading(false);
        }
        else
            completeSave();
    }

    const onLoad = async () => {
        setError('');
        let hasError = false;
        try
        {   
            let data = await getLocalStorage();
            if (data && data.user) {
                setEmail(data.user.email);
                let userId = data.user.id;
                let tokenHeader = await authTokenHeader();
                await fetch(`${env.URL}/users/profile?userId=${userId}`,
                {method:'GET',headers:{'Content-Type': 'application/json', 'authorization': tokenHeader}}).then(async ret => {
                    let res = JSON.parse(await ret.text());
                    if (res.Error)
                    {
                        if (res.Error == "Un-Authorized") {
                            await props.unauthorized();
                            return;
                        }
                        hasError = true;
                    }
                    else {
                        setIsComplete(true);
                        setupPage(res);
                    }
                });
            }
            else {
                hasError = true;
            }
        }
        catch(e)
        {
            hasError = true;
        } 
        if (hasError)
            setError('A problem occurred while retrieving account information, please reload the page and try again.');
    
        setIsLoaded(true);
    }

    const submitText = () => {
        if (isSaved) {
            return !props.isSetup ? 'No Changes' : 'Changes Saved';
        }
        else {
            return !props.isSetup ? 'Next' : 'Save';
        }
    }

    const getPhoto = () => {
        if (Platform.OS === 'web') {
            if (imageUri)
                return imageUri;
        }
        if (imageURL)
            return imageURL;
        else
            '';
    }

    const _styles = StyleSheet.create({
        photoButton: {
            marginLeft: 5
        },
        photoButtonContainer: {
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center'
        },
        passwordResetText: {
            fontWeight: 'bold',
            marginBottom: 10,
            color: Color(props.isDarkMode).text
        },
        spacingLeft: {
            marginLeft: 8,
        },
        passwordPromptContainer: {
            height: '100%',
            width: '100%',
            position: 'absolute',
            top:0,
            left:0,
            zIndex:99,
            ...Platform.select({
                android: {
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center'
                }
            }),
        },
        passwordContainerContent: {
            ...Platform.select({
                web: {
                    height: '100vh'
                },
            }),
        },
        passwordPromptContainerMobile: {
            backgroundColor: Color(props.isDarkMode).whiteMask
        },
        passwordButtonContainer: {
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'flex-end',
        },
        passwordDialog: {
            margin: 'auto',
            backgroundColor: Color(props.isDarkMode).white,
            padding: 20,
            borderWidth: 1,
            borderStyle: 'solid',
            borderColor: Color(props.isDarkMode).border,
            borderRadius: 20,
            maxWidth: 400
        },
        imageError: {
            marginBottom: 5,
            height: 20
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
            backgroundColor: Color(props.isDarkMode).white,
            borderColor: Color(props.isDarkMode).border,
            borderWidth: 1,
            borderRadius: Radius.round,
            marginBottom: 5,
        },
        group: {
            backgroundColor: Color(props.isDarkMode).default
        },
        groupFocus: {
            zIndex: 1,
            elevation: 1
        },
        title: {
            fontFamily: 'Inter-SemiBold',
            fontSize: FontSize.large,
            color: Color(props.isDarkMode).titleText
        },
        subtitle: {
            color: Color(props.isDarkMode).text,
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
                    backgroundColor: Color(props.isDarkMode).black
                }
            }),
        }
    });

    return (
    <View>
        {promptPassword ?
        <View
        style={passwordContainerStyle()}
        >
            <View
            style={passwordContentStyle()}
            >
                <View
                style={_styles.passwordDialog}
                >
                    {!passwordEmailError ?
                    <View>
                        {!passwordEmailSent ?
                        <View>
                            <_Text
                            style={_styles.passwordResetText}
                            >Would you like to update your password? We will attempt to send a password update link to the email on file.</_Text>
                            <View
                            style={_styles.passwordButtonContainer}
                            >
                                <_Button
                                style={Style(props.isDarkMode).buttonDanger}
                                onPress={(e: any) => closePasswordPrompt()}
                                isDarkMode={props.isDarkMode}
                                >
                                    Cancel
                                </_Button>
                                <_Button
                                style={[Style(props.isDarkMode).buttonDefault, _styles.spacingLeft]}
                                onPress={(e: any) => doSendEmail()}
                                loading={isPasswordLoading}
                                isDarkMode={props.isDarkMode}
                                >
                                Continue
                                </_Button>
                            </View>
                        </View>
                        :
                        <View>
                            <_Text
                            style={_styles.passwordResetText}
                            >A password update request has been sent, please check your inbox to complete the password reset process.</_Text>
                            <View
                            style={_styles.passwordButtonContainer}
                            >
                                <_Button
                                style={Style(props.isDarkMode).buttonDanger}
                                onPress={(e: any) => closePasswordPrompt()}
                                isDarkMode={props.isDarkMode}
                                >
                                Close
                                </_Button>
                                <_Button
                                style={[Style(props.isDarkMode).buttonGold, _styles.spacingLeft]}
                                onPress={(e: any) => doSendEmail()}
                                loading={isPasswordLoading}
                                isDarkMode={props.isDarkMode}
                                >
                                Resend Email
                            </_Button>
                            </View>
                        </View>
                    }
                    </View>
                    :
                    <View>
                    <_Text
                    style={_styles.passwordResetText}
                    >An error occurred while attempting to send a password update email request. Would you like to try again?</_Text>
                    <View
                    style={_styles.passwordButtonContainer}
                    >
                        <_Button
                        style={Style(props.isDarkMode).buttonDanger}
                        onPress={(e: any) => closePasswordPrompt()}
                        isDarkMode={props.isDarkMode}
                        >
                            Cancel
                        </_Button>
                        <_Button
                        style={[Style(props.isDarkMode).buttonGold, _styles.spacingLeft]}
                        onPress={(e: any) => doSendEmail()}
                        loading={isPasswordLoading}
                        isDarkMode={props.isDarkMode}
                        >
                        Try Again
                        </_Button>
                    </View>
                </View>
                }

                </View>
            </View>
        </View>
        : null}
        <ScrollView
        keyboardShouldPersistTaps={'handled'}
        >
            <View>
                <View
                style={_styles.titleContainer}
                >
                    <_Text
                    style={_styles.title}
                    >
                        {title()}
                    </_Text>
                    {props.isSetup ?
                    <_Button
                    style={Style(props.isDarkMode).buttonInverted}
                    textStyle={Style(props.isDarkMode).buttonInvertedText}
                    onPress={(e: any) => props.setView(AccountScreenType.about)}
                    isDarkMode={props.isDarkMode}
                    >
                        Edit Interests
                    </_Button>
                    : null}
                </View>
            </View>
            <View
            style={[containerStyle()]}
            >
                <_Text
                style={subTitleStyle()}
                >
                    {subtitle()}
                </_Text>
                <View>
                <_Group
                isDarkMode={props.isDarkMode}
                vertical={true}
                style={_styles.imageContainer}
                >
                    {!imageURL && !imageUri ?
                    <View
                    style={[_styles.image, _styles.defaultImage]}
                    >
                        <FontAwesomeIcon
                        style={_styles.newUserIcon}
                        size={40} color={Color(props.isDarkMode).userIcon}
                        icon="user-plus"
                        >
                        </FontAwesomeIcon>
                    </View>
                    :
                    <_Image
                    style={_styles.image}
                    source={Platform.OS === 'web' ? getPhoto() : {uri: getPhoto()}}
                    height={125}
                    width={125}
                    >
                    </_Image>
                    }
                    <_Text
                    style={[Style(props.isDarkMode).textSmallDanger, _styles.imageError]}
                    >
                        {imageError}
                    </_Text>
                    <View
                    style={_styles.photoButtonContainer}
                    >
                        <_Button
                        isDarkMode={props.isDarkMode}
                        onPress={(e: any) => uploadPhoto()}
                        style={Style(props.isDarkMode).buttonDefault}
                        >
                            {Platform.OS === 'web' ? (imageUri || imageURL) ? 'Change Photo' : 'Upload Photo' : (imageUri || imageURL) ? 'Change' : 'Upload'}
                        </_Button>
                        {Platform.OS !== 'web' ?
                        <_Button
                        onPress={(e: any) => takePhoto()}
                        style={[Style(props.isDarkMode).buttonGold, _styles.photoButton]}
                        isDarkMode={props.isDarkMode}
                        >
                            Take Photo
                        </_Button>
                        : null }
                    </View>
                </_Group>
                </View>
                <_TextInput
                label="Email"
                containerStyle={_styles.formGap}
                value={email}
                readonly={true}
                isDarkMode={props.isDarkMode}
                ></_TextInput>
                <_TextInput
                label="First Name"
                required={true}
                containerStyle={_styles.formGap}
                maxLength={50}
                value={firstName}
                setValue={setFirstName}
                onChangeText={(e: any) => setIsSaved(false)}
                blurOnSubmit={false}
                onSubmit={() => { lastNameRef.current?.focus(); }}
                returnKeyType='next'
                isDarkMode={props.isDarkMode}
                ></_TextInput>
                <_TextInput
                label="Last Name"
                required={true}
                containerStyle={_styles.formGap}
                maxLength={50}
                value={lastName}
                setValue={setLastName}
                onChangeText={(e: any) => setIsSaved(false)}
                blurOnSubmit={false}
                onSubmit={() => { yearRef.current?.focus(); }}
                returnKeyType='next'
                innerRef={lastNameRef}
                isDarkMode={props.isDarkMode}
                ></_TextInput>
                <_Group
                isDarkMode={props.isDarkMode}
                required={true}
                style={_styles.formGap}
                mobile={props.mobile}
                label="Birthday"
                >
                    <_Dropdown
                    isDarkMode={props.isDarkMode}
                    label="Year"
                    selected={(e: any) =>
                        {
                            if (e)
                                checkSaved();
                        }
                    }
                    options={getYearOptions()}
                    placeholder="Select..."
                    value={year}
                    setValue={setYear}
                    innerRef={yearRef}
                    ></_Dropdown>
                    <_Dropdown
                    isDarkMode={props.isDarkMode}
                    label="Month"
                    selected={(e: any) =>
                        {
                            if (e)
                                checkSaved();
                        }
                    }
                    options={getMonthOptions()}
                    placeholder="Select..."
                    value={month}
                    setValue={setMonth}
                    ></_Dropdown>
                    <_Dropdown
                    isDarkMode={props.isDarkMode}
                    label="Day"
                    options={getDayOptions()}
                    placeholder="Select..."
                    value={day}
                    setValue={setDay}
                    selected={(e: any) =>
                        {
                            if (e)
                                checkSaved();
                        }
                    }
                    ></_Dropdown>
                </_Group>
                <_Group
                isDarkMode={props.isDarkMode}
                mobile={props.mobile}
                style={_styles.formGap}
                noBackground={true}
                >
                    <_TextInput
                    label="Phone Number"
                    required={true}
                    maxLength={10}
                    type="phone"
                    value={phone}
                    setValue={setPhone}
                    onChangeText={(e: any) => setIsSaved(false)}
                    blurOnSubmit={false}
                    onSubmit={() => { zipRef.current?.focus(); }}
                    returnKeyType='next'
                    innerRef={phoneRef}
                    isDarkMode={props.isDarkMode}
                    ></_TextInput>
                    {/* <_Checkbox
                    visible={false}
                    label="Make Phone Public"
                    checked={(e: any) => setPublicPhoneForm(e)}
                    /> */}
                </_Group>
                <_Group
                isDarkMode={props.isDarkMode}
                label="Location"
                mobile={props.mobile}
                required={true}
                style={_styles.formGap}
                >
                    <_TextInput
                    label="Zip Code"
                    maxLength={5}
                    keyboardType="numeric"
                    value={zipCode}
                    setValue={setZipCode}
                    onChangeText={(e: any) => setIsSaved(false)}
                    blurOnSubmit={false}
                    onSubmit={() => { cityRef.current?.focus(); }}
                    returnKeyType='next'
                    innerRef={zipRef}
                    isDarkMode={props.isDarkMode}
                    ></_TextInput>
                    <_TextInput
                    label="City"
                    value={city}
                    setValue={setCity}
                    onChangeText={(e: any) => setIsSaved(false)}
                    blurOnSubmit={false}
                    onSubmit={() => { stateRef.current?.focus(); }}
                    returnKeyType='next'
                    innerRef={cityRef}
                    isDarkMode={props.isDarkMode}
                    ></_TextInput>
                    <_Dropdown
                    isDarkMode={props.isDarkMode}
                    label="State"
                    options={getStateOptions()}
                    placeholder="Select..."
                    direction="top"
                    value={state}
                    setValue={setState}
                    innerRef={stateRef}
                    selected={(e: any) => {
                        if (e)
                            checkSaved();
                        }
                    }
                    ></_Dropdown>
                </_Group>
                <_Dropdown
                isDarkMode={props.isDarkMode}
                label="Gender"
                options={setGenderOptions()}
                direction="top"
                placeholder="Select..."
                value={gender}
                setValue={setGender}
                required={true}
                selected={(e: any) => {
                    if (e)
                        checkSaved();
                    }
                }
                ></_Dropdown>
                <View
                style={_styles.buttonContainer}
                >
                    {props.isSetup ?
                    <_Button
                    isDarkMode={props.isDarkMode}
                    style={[Style(props.isDarkMode).buttonDefault, _styles.passwordButton]}
                    onPress={(e: any) => triggerPrompt()}
                    >
                        Update Password
                    </_Button>
                    : null }
                    <_Button
                    style={Style(props.isDarkMode).buttonGold}
                    loading={isLoading}
                    onPress={(e: any) => onSave()}
                    disabled={checkSubmitDisabled()}
                    isDarkMode={props.isDarkMode}
                    >
                        {submitText()}
                    </_Button>
                </View>
                {error || props.error ?
                <_Text 
                containerStyle={errorContainerStyle()}
                innerContainerStyle={{justifyContent: 'center'}} 
                style={errorStyle()}
                >
                    {error}
                    </_Text>
                : null}
                {!isLoaded ?
                <View
                style={Style(props.isDarkMode).maskPrompt}
                >
                    <ActivityIndicator
                    size="large"
                    color={Color(props.isDarkMode).gold}
                    style={Style(props.isDarkMode).maskLoading}
                    />    
                </View>
                : null }
            </View>
        </ScrollView>
    </View>
    );
};

export default AccountInfo;