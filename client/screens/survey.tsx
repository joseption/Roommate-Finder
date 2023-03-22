import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { useNavigation } from '@react-navigation/native';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Platform, Pressable, RefreshControl, ScrollView, StyleSheet, View } from 'react-native';
import _Button from '../components/control/button';
import _Image from '../components/control/image';
import _Progress from '../components/control/progress';
import _SurveyOption from '../components/control/survey-option';
import _Text from '../components/control/text';
import _TextInput from '../components/control/text-input';
import { env, getLocalStorage, authTokenHeader, NavTo, navProp, setLocalStorage } from '../helper';
import { Style, Color, FontSize, Radius } from '../style';

const SurveyScreen = (props: any) => {
    /*
    Joseph: Add all content for the single page view here,
    If you need to make reusable components, create a folder
    in the components folder named "survey" and add your component files there
    */
    const [error,setError] = useState('');
    const [questions,setQuestions] = useState([]);
    const [init,setInit] = useState(false);
    const [questionId,setQuestionId] = useState('');
    const [responseId,setResponseId] = useState('');
    const [questionText,setQuestionText] = useState('');
    const [options,setOptions] = useState([]);
    const [progress,setProgress] = useState(0);
    const [hasLastQuestion,setHasLastQuestion] = useState(false);
    const [canGotoQuestion,setCanGotoQuestion] = useState(false);
    const [nextButton,setNextButton] = useState('Loading...');
    const [totalNumber,setTotalNumber] = useState(-1);
    const [currentNumber,setCurrentNumber] = useState(-1);
    const [loading,setLoading] = useState(false);
    const [generating,setGenerating] = useState(false);
    const [complete,setComplete] = useState(false);
    const [isLoaded,setIsLoaded] = useState(false);
    const [reviewMode,setReviewMode] = useState(false);
    const navigation = useNavigation<navProp>();
    const [refreshing, setRefreshing] = useState(false); 
    
    useEffect(() => {
        if (!init) {
            getQuestions(0, false, true);
            setInit(true);
        }
    }, [questions, options, progress, questionId, totalNumber, currentNumber, complete]);
    const errorStyle = () => {
        var style = [];
        style.push(Style(props.isDarkMode).textDanger);
        if (props.mobile)
          style.push(Style(props.isDarkMode).errorText);        
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
        return "Survey";
    }

    const questionCountTextStyle = () => {
        var style = [];
        style.push(_styles.questionCntText);
        if (props.mobile) {
            style.push(_styles.questionCntTextMobile);
        }
        
        return style;
    }

    const questionCountInnerTextStyle = () => {
        var style = [];
        if (!props.mobile) {
            style.push(_styles.questionCountContainerStyle);
        }
        
        return style;
    }

    const questionTextStyle = () => {
        var style = [];
        style.push(_styles.questionText);
        if (props.mobile) {
            style.push(_styles.questionTextMobile);
        }
        
        return style;
    }

    const setResponse = (id: string) => {
        setResponseId(id);
        setCanGotoQuestion(true);
    }
    
    const mappedItems = () => {
        var count = 0;
        if (options && options.length > 0) {
            return options.map((item: any, key: any) => {
                return <_SurveyOption
                onPress={(e: any) => setResponse(item.id)}
                containerStyle={_styles.optionContainerStyle}
                item={item}
                key={key}
                selected={item.id == responseId}
                isDarkMode={props.isDarkMode}
                >{item.response}</_SurveyOption>
            })
        }
        else
            return <View></View>
    }

    const prepareQuestion = (question: any, idx: number, total: number) => {
        setQuestionId(question.id);
        setQuestionText(question.question_text);
        setOptions(question.response);
        if (question.ResponsesOnUsers && question.ResponsesOnUsers.length > 0)
            setResponseId(question.ResponsesOnUsers[0].responseId);
        else
            setResponseId('');
        setHasLastQuestion(idx != 0);
        setCanGotoQuestion(question.ResponsesOnUsers.length > 0);
        let next = (idx + 1 == total) ? 'Complete Survey' : 'Next';
        setTotalNumber(total);
        setCurrentNumber(idx + 1);
        setNextButton(next);
    }

    const setupQuestions = (res: any, goto: number = 0, restart: boolean = false, init: boolean = false, refreshing: boolean = false) => {
        let isSet = false;
        let progressCnt = 0;
        setQuestions(res);

        if (restart) {
            setComplete(false);
            prepareQuestion(res[0], 0, res.length);
        }
        else if (refreshing) {
            let idx = res.findIndex((x: any) => x.id == questionId);
            prepareQuestion(res[idx], idx, res.length);
            return;
        }
        else if (questionId && goto != 0) {
            let idx = res.findIndex((x: any) => x.id == questionId);
            var next = idx + goto;
            if (next >= 0) {
                prepareQuestion(res[next], next, res.length);
            }
            else
                goto = 0;
        }
        else
            goto = 0;
        
        for (let i = 0; i < res.length; i++) {
            // Get next available question or show last question if complete
            if (!restart && !isSet && goto == 0 && (res[i].ResponsesOnUsers.length == 0 || i == res.length - 1)) {
                prepareQuestion(res[i], i, res.length);
                isSet = true;
            }
            if (res[i].ResponsesOnUsers.length > 0) {
                progressCnt++;
            }
        }
        if (res.length > 0) {
            let percent = Math.ceil((progressCnt / res.length) * 100);
            setProgress(percent);
            if (percent == 100 && init) {
                setComplete(true);
                setReviewMode(true);
            }
        }
    }

    const getQuestions = async (goto: number, restart: boolean = false, init: boolean = false, refreshing: boolean = false) => {
        let hasError = false;
        setError('');
        try
        {   
            let data = await getLocalStorage();
            if (data) {
                let tokenHeader = await authTokenHeader();
                await fetch(`${env.URL}/survey/info`,
                {method:'GET',headers:{'Content-Type': 'application/json', 'authorization': tokenHeader}}).then(async ret => {
                    let res = JSON.parse(await ret.text());
                    if (res.Error)
                    {
                        if (res.Error == "Un-Authorized") {
                            await unauthorized();
                            return;
                        }
                        hasError = true;
                    }
                    else {
                        setupQuestions(res, goto, restart, init, refreshing);
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
            setError('Unable to load survey question, please refresh to try again.');

        setLoading(false);
        setIsLoaded(true);
    }

    const generateMatches = async () => {
        let hasError = false;
        setError('');
        setGenerating(true);
        try
        {   
            let data = await getLocalStorage();
            if (data && data.user) {
                let obj = {loggedInUserId:data.user.id};
                let js = JSON.stringify(obj);
                let tokenHeader = await authTokenHeader();
                await fetch(`${env.URL}/matches/create`,
                {method:'POST',body:js,headers:{'Content-Type': 'application/json', 'authorization': tokenHeader}}).then(async ret => {
                    let res = JSON.parse(await ret.text());
                    if (res.Error)
                    {
                        if (res.Error == "Un-Authorized") {
                            await unauthorized();
                            return;
                        }
                        hasError = true;
                    }
                    else {
                        setReviewMode(true);
                        setGenerating(false);
                        setComplete(true);
                        navigation.navigate(NavTo.Search, {view: 'matches'} as never);
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
        if (hasError) {
            setError('A problem occurred while generating your matches, press refresh to try again.');
        }

        setLoading(false);
    }

    const goToMatches = () => {
        props.setNavSelector(NavTo.Search);
        navigation.navigate(NavTo.Search, {view: 'matches'} as never);
    }

    const unauthorized = async () => {
        await setLocalStorage(null);
        navigation.navigate(NavTo.Login);
        navigation.reset({
            index: 0,
            routes: [{name: NavTo.Login, params: {timeout: 'yes'} as never}],
        });
        props.setIsLoggedIn(false);
        props.setIsSetup(false);
    }

    const submit = async (goto: number) => {
        setError('');
        setLoading(true);
        let hasError = false;
        let obj = {questionId:questionId, responseId:responseId};
        let js = JSON.stringify(obj);

        if (responseId) {
            try
            {   
                let data = await getLocalStorage();
                if (data) {
                    let tokenHeader = await authTokenHeader();
                    await fetch(`${env.URL}/survey/response`,
                    {method:'POST',body:js,headers:{'Content-Type': 'application/json', 'authorization': tokenHeader}}).then(async ret => {
                        let res = JSON.parse(await ret.text());
                        if (res.Error)
                        {
                            if (res.Error == "Un-Authorized") {
                                await unauthorized();
                                return;
                            }
                            hasError = true;
                        }
                        else {
                            if (goto == 1 && totalNumber - currentNumber == 0) {
                                setProgress(100);
                                await generateMatches();
                            }
                            else
                                getQuestions(goto);
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
        }
        else {
            getQuestions(goto);
        }

        if (hasError) {
            setError('Unable to load survey question, please refresh to try again.');
            setLoading(false);
        }
    }

    const promptMask = () => {
        if (props.mobile)
            return Style(props.isDarkMode).maskPromptMobile;
        else
            return Style(props.isDarkMode).maskPrompt;
    }

    const refresh = () => {
        setRefreshing(true);
        getQuestions(0, false, false, true);
        setRefreshing(false);
    };

    const _styles = StyleSheet.create({
        finishButton: {
            marginRight: 5,
        },
        error: {
            paddingTop: 20,
        },
        containerStyle: {
            backgroundColor: Color(props.isDarkMode).defaultLight,
            padding: 30,
            margin: 20,
        },
        reviewButton: {
            marginLeft: 8,
        },
        reviewButtonContainer: {
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection: 'row',
        },
        doneContainer: {
            justifyContent: 'center',
            alignItems: 'center',
            marginTop: 20,
            textAlign: 'center'
        },
        doneHeaderText: {
            fontSize: FontSize.large,
            fontWeight: 'bold',
            color: Color(props.isDarkMode).text
        },
        doneSubHeaderText: {
            fontSize: FontSize.default,
            textAlign: 'center',
            color: Color(props.isDarkMode).text
        },
        loading: {
            padding: 20,
            position: 'absolute',
            right: 95,
            top: 91,
        },
        refreshIconContainer: {
            padding: 20,
            position: 'absolute',
            right: 98,
            top: 93,
        },
        genTextContainer: {
            position: 'absolute',
            left: 120,
            top: 117,
        },
        genText: {
            fontWeight: 'bold'
        },
        questionContainer: {
            minHeight: 300,
            justifyContent: 'flex-start',
        },
        questionCountContainerStyle: {
            width: '100%',
            justifyContent: 'flex-end',
        },
        btmButtonContainer: {
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
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
        refreshIcon: {
            ...Platform.select({
                web: {
                    outlineStyle: 'none'
                }
            })
        },
        separator: {
            width: "100%",
            backgroundColor: Color(props.isDarkMode).separator,
            height: 1,
            marginTop: 40
        },
        groupContainer: {
            width: '100%',
            display: 'flex',
            justifyContent: 'center',
            flexDirection: 'column',
            alignItems: 'center',
        },
        titleContainer: {
            display: 'flex',
            justifyContent: 'space-between',
            flexDirection: 'row',
            alignItems: 'center'
        },
        buttonContainer: {
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'flex-end',
            marginTop: 20,
            marginBottom: 20
        },
        optionContainerStyle: {
            marginTop: 10
        },
        title: {
            fontFamily: 'Inter-SemiBold',
            fontSize: FontSize.large,
            color: Color(props.isDarkMode).titleText
        },
        questionText: {
            color: Color(props.isDarkMode).text,
            paddingBottom: 20,
            fontSize: FontSize.default,
            fontWeight: "bold"
        },
        questionTextMobile: {
            fontSize: FontSize.default,
        },
        questionCntText: {
            color: Color(props.isDarkMode).subTitleText,
            fontSize: FontSize.default,
            paddingBottom: 10,
            fontWeight: 'bold'
        },
        questionCntTextMobile: {
            fontSize: FontSize.default,
            paddingTop: 10
        }
    });
    
    return (
    <ScrollView        
    refreshControl={
        <RefreshControl
        refreshing={refreshing}
        onRefresh={refresh}
        colors={[Color(props.isDarkMode).gold]}
        progressBackgroundColor={Color(props.isDarkMode).contentHolder}
        enabled={!complete && !generating}
        />
        }
    contentContainerStyle={props.mobile ? {padding: 10} : null}
    >
        <View
        style={_styles.titleContainer}
        >
            <_Text
            style={_styles.title}
            >
                {title()}
            </_Text>
            <_Progress isDarkMode={props.isDarkMode} progress={progress}></_Progress>
        </View>
        <View
        style={[containerStyle()]}
        >
        {!complete ?
        <View>
        {!generating ?
        <View>
            <View>
                {currentNumber > -1 ?
                <_Text
                style={questionCountTextStyle()}
                innerContainerStyle={questionCountInnerTextStyle()}
                >
                    Question {currentNumber}/{totalNumber}
                </_Text>
                : null}
                <View
                style={_styles.questionContainer}
                >
                    <_Text
                    style={questionTextStyle()}
                    >
                        {questionText}
                    </_Text>
                    <View
                    style={_styles.groupContainer}
                    >
                    {mappedItems()}
                    </View>
                </View>
                <View
                style={_styles.separator}
                />
                <View
                style={_styles.btmButtonContainer}
                >
                    {hasLastQuestion ?
                    <Pressable
                    style={_styles.arrowContainer}
                    onPress={(e: any) => submit(-1)}
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
                    :
                    <View></View>
                    }
                    <View
                    style={_styles.buttonContainer}
                    >
                        {reviewMode && nextButton != 'Complete Survey' ?
                        <_Button
                        isDarkMode={props.isDarkMode}
                        style={[Style(props.isDarkMode).buttonDefault, _styles.finishButton]}
                        disabled={!canGotoQuestion}
                        onPress={(e: any) => {
                            submit(1);
                            generateMatches();
                            }
                        }
                        >
                            Finish
                        </_Button>
                        : null }
                        <_Button
                        isDarkMode={props.isDarkMode}
                        style={Style(props.isDarkMode).buttonGold}
                        disabled={!canGotoQuestion}
                        onPress={(e: any) => submit(1)}
                        loading={loading}
                        >
                            {nextButton}
                        </_Button>
                    </View>
                </View>
                {!isLoaded ?
                <View
                style={promptMask()}
                >
                    <ActivityIndicator
                    size="large"
                    color={Color(props.isDarkMode).gold}
                    style={Style(props.isDarkMode).maskLoading}
                    />    
                </View>
                : null }
            </View>
        </View>
        :
        <View
        style={_styles.doneContainer}
        >
            <_Text
            style={_styles.doneHeaderText}
            >
                We're getting your matches ready!
                </_Text>
            <_Text
            style={_styles.doneSubHeaderText}
            >
                You will be automatically redirected
            </_Text>
            <View>
                <_Image
                    source={require('../assets/images/matches.png')}
                    width={325}
                    containerStyle={_styles.containerStyle}
                ></_Image>
                <View
                style={!error ? _styles.loading : _styles.refreshIconContainer}
                >
                    {!error ?
                    <ActivityIndicator
                        size="large"
                        color={Color(props.isDarkMode).actualWhite}
                    />
                    :
                    <Pressable
                    onPress={(e: any) => generateMatches()}
                    >
                        <FontAwesomeIcon 
                            size={30} 
                            color={Color(props.isDarkMode).white} 
                            icon="refresh"
                            style={_styles.refreshIcon}
                        >
                        </FontAwesomeIcon>
                    </Pressable>
                    }
                </View>
                <_Text
                containerStyle={_styles.genTextContainer}
                style={_styles.genText}
                >{error ? 'Try again?' : 'Hang tight...'}</_Text>
            </View>
        </View>
        }
        </View>
        :
        <View>
            <View
            style={_styles.doneContainer}
            >
                <_Text
                style={_styles.doneHeaderText}
                >
                    Looks like you have some matches!
                    </_Text>
                <_Text
                style={_styles.doneSubHeaderText}
                >
                    Would you like to review your responses?
                </_Text>
                <_Image
                    source={require('../assets/images/checklist.png')}
                    width={325}
                    containerStyle={_styles.containerStyle}
                ></_Image>
                <View
                style={_styles.reviewButtonContainer}
                >
                <_Button
                        isDarkMode={props.isDarkMode}
                        style={Style(props.isDarkMode).buttonDefault}
                        onPress={(e: any) => goToMatches()}
                        >
                            Go to Matches
                </_Button>
                <_Button
                        isDarkMode={props.isDarkMode}
                        style={[Style(props.isDarkMode).buttonGold, _styles.reviewButton]}
                        onPress={(e: any) => getQuestions(0, true)}
                        >
                            Review Answers
                </_Button>
                </View>
            </View>
        </View>
        }
        {error || props.error ?
        <_Text 
        containerStyle={_styles.error}
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

export default SurveyScreen;