import { Platform, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import _TextInput from '../control/text-input';
import _Dropdown from '../control/dropdown';
import _Checkbox from '../control/checkbox';
import _Group from '../control/group';
import _Text from '../control/text';
import React, { useEffect, useState } from 'react';
import { Color, Content, FontSize, Radius, Style } from '../../style';
import { styles } from '../../screens/login';
import _Button from '../control/button';
import _Image from '../control/image';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import DocumentPicker, {DirectoryPickerResponse, DocumentPickerResponse, isInProgress, types} from 'react-native-document-picker'
import { AccountScreenType, authTokenHeader, env, navProp, NavTo, setLocalStorage } from '../../helper';
import { useNavigation } from '@react-navigation/native';

const StartSurvey = (props: any) => {
    const [error,setError] = useState('');
    const [search,setIsSearch] = useState(false);
    const navigation = useNavigation<navProp>();
    const errorStyle = () => {
        var style = [];
        style.push(Style(props.isDarkMode).textDanger);
        if (props.mobile)
          style.push(Style(props.isDarkMode).errorText);        
        return style;
    }

    const errorContainerStyle = () => {
        var style = [];
        style.push(_styles.error);
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
        return "Find some roommates";
    }

    const subtitle = () => {
        return "Answer questions to start matching";
    }

    const subTitleStyle = () => {
        var style = [];
        style.push(_styles.subtitle);
        if (props.mobile) {
            style.push(_styles.subTitleMobile);
        }
        
        return style;
    }

    const completeSetup = async (gotoSurvey: boolean) => {
        setError('');
        let hasError = false;
        let step = gotoSurvey ? 'survey' : 'explore';
        let obj = {setup_step:step};
        let js = JSON.stringify(obj);

        try
        {   
            let tokenHeader = await authTokenHeader();
            await fetch(`${env.URL}/users/completeSetup`,
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
                else {
                    props.setIsSetup(true);
                    if (gotoSurvey) {
                        navigation.navigate(NavTo.Survey);
                    }
                    else {
                        navigation.navigate(NavTo.Search);
                    }
                }
            });
        }
        catch(e)
        {
            hasError = true;
        } 
        if (hasError) {
            setError('A problem occurred, please try reloading the page.');
        }
    }

    const goBack = () => {
        navigation.navigate(NavTo.Account, {view: 'about'} as never);
        props.setView(AccountScreenType.about);
    }

    const _styles = StyleSheet.create({
        innerGroup: {
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            ...Platform.select({
                android: {
                    width: '100%'
                }
            })
        },
        searchToggle: {
            color: Color(props.isDarkMode).default,
            fontFamily: 'Inter-SemiBold'
        },
        arrowContainer: {
            display: 'flex',
            justifyContent: 'center',
            flexDirection: 'row'
        },
        backArrow: {
            marginRight: 5,
            ...Platform.select({
                web: {
                    outlineStyle: 'none'
                }
            })
        },
        options: {
            display: 'flex',
            justifyContent: 'space-between',
            flexDirection: 'row',
            margin: 'auto',
            marginTop: 20,
            alignItems: 'center',
            width: '100%',
        },
        groupContainer: {
            width: '100%',
            display: 'flex',
            justifyContent: 'center',
            flexDirection: 'column',
            alignItems: 'center'
        },
        surveyButton: {
            fontSize: FontSize.large,
            width: 200,
        },
        surveyButtonContainer: {
            justifyContent: 'center',
            display: 'flex',
            flexDirection: 'row'
        },
        surveyButtonText: {
            fontSize: FontSize.huge,
            fontFamily: 'Inter-Bold'
        },
        surveyText: {
            display: 'flex',
            justifyContent: 'center',
            flexDirection: 'row',
            width: '100%',
            textAlign: 'center',
            color: Color(props.isDarkMode).text
        },
        innerContainer: {
            display: 'flex',
            justifyContent: 'center'
        },
        innerGap: {
            marginBottom: 80
        },
        tipText: {
            color: Color(props.isDarkMode).textSecondary,
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'center',
            width: '100%'
        },
        formGap: {
            marginBottom: 20
        },
        buttonContainer: {
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'flex-end',
            marginTop: 20,
            marginBottom: 20,
        },
        titleContainer: {
            display: 'flex',
            justifyContent: 'space-between',
            flexDirection: 'row',
            alignItems: 'center'
        },
        title: {
            fontFamily: 'Inter-SemiBold',
            fontSize: FontSize.large,
            color: Color(props.isDarkMode).titleText,
        },
        subtitle: {
            color: Color(props.isDarkMode).textTertiary,
            paddingBottom: 20,
            fontSize: FontSize.large
        },
        subTitleMobile: {
            fontSize: FontSize.default
        },
        error: {
            marginTop: 40
        },
        group: {
            maxWidth: Content.width / 2,
            backgroundColor: Color(props.isDarkMode).contentDialogBackground,
            display: 'flex',
            borderRadius: Radius.default,
            padding: 40,
            shadowColor: Color(props.isDarkMode).contentDialogBackgroundSecondary,
            shadowOffset: {width: -3, height: 3},
            shadowOpacity: 1,
            shadowRadius: 0,
            marginLeft: 3,
            ...Platform.select({
                android: {
                    marginLeft: 0,
                    width: '100%',
                    padding: 30,
                }
            })
        },
    });

    return (
    <ScrollView
    keyboardShouldPersistTaps={'handled'}
    >
        <View
        style={_styles.titleContainer}
        >
            <_Text
            style={_styles.title}
            >
                {title()}
            </_Text>
        </View>
        <View
        style={[containerStyle()]}
        >
            <_Text
            style={subTitleStyle()}
            >
                {subtitle()}
            </_Text>
            <View
            style={_styles.groupContainer}
            >
                <View
                style={_styles.innerGroup}
                >
                    <View
                    style={_styles.group}
                    >
                        {!search ?
                        <View
                        style={_styles.innerContainer}
                        >
                            <_Text
                            style={[_styles.surveyText, _styles.innerGap]}
                            >
                                Find your ideal roommates by taking the survey. Get better matches by answering more questions.
                            </_Text>
                            <_Button
                            style={[Style(props.isDarkMode).buttonDefault, _styles.surveyButton, _styles.innerGap]}
                            textStyle={ _styles.surveyButtonText}
                            containerStyle={_styles.surveyButtonContainer}
                            onPress={(e: any) => completeSetup(true)}
                            isDarkMode={props.isDarkMode}
                            >
                                Start Survey
                            </_Button>
                            <_Text
                            style={_styles.tipText}
                            >
                                Tip: If you need a break from the survey, you can always come back to it later.
                            </_Text>
                        </View>
                        :
                        <View
                        style={_styles.innerContainer}
                        >
                            <_Text
                            style={[_styles.surveyText, _styles.innerGap]}
                            >
                                If you decide to answer questions later, you can access the survey from the navigation menu.
                            </_Text>
                            <_Button
                            style={[Style(props.isDarkMode).buttonGold, _styles.surveyButton, _styles.innerGap]}
                            textStyle={ _styles.surveyButtonText}
                            containerStyle={_styles.surveyButtonContainer}
                            onPress={(e: any) => completeSetup(false)}
                            isDarkMode={props.isDarkMode}
                            >
                                Explore
                            </_Button>
                            <_Text
                            style={_styles.tipText}
                            >
                                Tip: Use the search filters to narrow down potential roommates.
                            </_Text>
                        </View>
                        }
                    </View>  
                    <View
                    style={_styles.options}
                    >
                        <Pressable
                        style={_styles.arrowContainer}
                        onPress={(e: any) => goBack()}
                        >
                            <FontAwesomeIcon 
                            size={20} 
                            color={Color(props.isDarkMode).textSecondary} 
                            style={_styles.backArrow} 
                            icon="arrow-left"
                            >
                            </FontAwesomeIcon>
                            <_Text
                            style={Style(props.isDarkMode).textDefaultSecondary}
                            >
                                Go Back
                            </_Text>
                        </Pressable>
                        {!search ?
                        <_Text
                        onPress={(e: any) => setIsSearch(true)}
                        style={_styles.searchToggle}
                        >
                            Let me find my own roommates
                        </_Text>
                        :
                        <_Text
                        onPress={(e: any) => setIsSearch(false)}
                        style={_styles.searchToggle}
                        >
                            Take the survey instead
                        </_Text>
                        }
                    </View> 
                </View>
                {error || props.error ?
                <_Text
                containerStyle={errorContainerStyle()}
                style={errorStyle()}
                >
                    {error}
                </_Text>
                : null}
            </View>
        </View>
    </ScrollView>
    );
};

export default StartSurvey;