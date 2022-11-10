import { Platform, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import _TextInput from '../control/text-input';
import _Dropdown from '../control/dropdown';
import _Checkbox from '../control/checkbox';
import _Group from '../control/group';
import _Text from '../control/text';
import React, { useState } from 'react';
import { Color, Content, FontSize, Radius, Style } from '../../style';
import { styles } from '../../screens/login';
import _Button from '../control/button';
import _Image from '../control/image';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import DocumentPicker, {DirectoryPickerResponse, DocumentPickerResponse, isInProgress, types} from 'react-native-document-picker'

const StartSurvey = (props: any, {navigation}:any) => {
    const [error,setError] = useState('');
    const [explore,setIsExplore] = useState(false);
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

    return (
    <ScrollView>
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
        style={[containerStyle(), _styles.container]}
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
                        {!explore ?
                        <View
                        style={_styles.innerContainer}
                        >
                            <_Text
                            style={[_styles.surveyText, _styles.innerGap]}
                            >
                                Find your ideal roommates by taking the survey. Get better matches by answering more questions.
                            </_Text>
                            <_Button
                            style={[Style.buttonDefault, _styles.surveyButton, _styles.innerGap]}
                            textStyle={ _styles.surveyButtonText}
                            containerStyle={_styles.surveyButtonContainer}
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
                            style={[Style.buttonSuccess, _styles.surveyButton, _styles.innerGap]}
                            textStyle={ _styles.surveyButtonText}
                            containerStyle={_styles.surveyButtonContainer}
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
                        >
                            <FontAwesomeIcon size={20} color={Color.textSecondary} style={_styles.backArrow} icon="arrow-left"></FontAwesomeIcon>
                            <_Text
                            style={Style.textDefaultSecondary}
                            >
                                Go Back
                            </_Text>
                        </Pressable>
                        {!explore ?
                        <_Text
                        onPress={(e: any) => setIsExplore(true)}
                        style={_styles.exploreToggle}
                        >
                            Let me find my own roommates
                        </_Text>
                        :
                        <_Text
                        onPress={(e: any) => setIsExplore(false)}
                        style={_styles.exploreToggle}
                        >
                            Take the survey instead
                        </_Text>
                        }
                    </View> 
                </View>
            </View>
        </View>
        {props.error ?
        <_Text containerStyle={errorContainerStyle()} style={errorStyle()}>{error}</_Text>
        : null}
    </ScrollView>
    );
};

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
    exploreToggle: {
        color: Color.default,
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
        textAlign: 'center'
    },
    innerContainer: {
        display: 'flex',
        justifyContent: 'center'
    },
    innerGap: {
        marginBottom: 80
    },
    tipText: {
        color: Color.textSecondary,
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
    group: {
        maxWidth: Content.width / 2,
        backgroundColor: Color.holder,
        display: 'flex',
        borderRadius: Radius.default,
        padding: 40,
        shadowColor: Color.holderSecondary,
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

export default StartSurvey;