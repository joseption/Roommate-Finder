import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, Platform, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { SectionList } from 'react-navigation';
import _Button from '../components/control/button';
import _Progress from '../components/control/progress';
import _SurveyOption from '../components/control/survey-option';
import _Text from '../components/control/text';
import _TextInput from '../components/control/text-input';
import { env, getLocalStorage, authTokenHeader, NavTo } from '../helper';
import { Style, Color, FontSize, Radius } from '../style';
import { styles } from './login';

const SurveyScreen = (props: any, {navigation}:any) => {
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
    const [complete,setComplete] = useState(false);
    const [askReview,setAskReview] = useState(true);
    
    useEffect(() => {
        if (!init) {
            getQuestions(0);
            setInit(true);
        }
    }, [questions, options, progress, questionId, totalNumber, currentNumber]);
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

    const optionContainerStyle = (count: number) => {
        var style = [];
        if (count > 0) 
            style.push(_styles.optionContainerStyle);
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
                containerStyle={optionContainerStyle(count++)}
                item={item}
                key={key}
                selected={item.id == responseId}
                >{item.response}</_SurveyOption>
            })
        }
        else
            return null
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
        let next = (idx + 1 == total) ? 'Complete Survey' : 'Next Question';
        setTotalNumber(total);
        setCurrentNumber(idx + 1);
        setNextButton(next);
    }

    const setupQuestions = (res: any, goto: number = 0, restart: boolean = false) => {
        let isSet = false;
        let progressCnt = 0;
        setQuestions(res);

        if (restart) {
            setAskReview(false);
            prepareQuestion(res[0], 0, res.length);
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
        }
    }

    const getQuestions = async (goto: number, restart: boolean = false) => {
        let hasError = false;
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
                            navigation.navigate(NavTo.Login, {timeout: 'yes'});
                            return;
                        }
                        hasError = true;
                    }
                    else {
                        setupQuestions(res, goto, restart);
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
    }

    const generateMatches = async () => {
        setComplete(true);

        setLoading(false);
    }

    const submit = async (goto: number) => {
        if (goto == 1) {
            setLoading(true);
        }
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
                            hasError = true;
                        }
                        else {
                            if (goto == 1 && totalNumber - currentNumber == 0) {
                                setProgress(100);
                                generateMatches();
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
    
    return (
    <View>
        <ScrollView>
            <View
            style={_styles.titleContainer}
            >
                <_Text
                style={_styles.title}
                >
                    {title()}
                </_Text>
                <_Progress progress={progress}></_Progress>
            </View>
            {!askReview ?
            <View>
            {!complete ?
            <View>
                <View
                style={[containerStyle(), _styles.container]}
                >
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
                            color={Color.textSecondary} 
                            style={_styles.backArrow} 
                            icon="arrow-left"
                            >
                            </FontAwesomeIcon>
                            <_Text
                            style={Style.textDefaultSecondary}
                            >
                                Previous Question
                            </_Text>
                        </Pressable>
                        :
                        <View></View>
                        }
                        <View
                        style={_styles.buttonContainer}
                        >
                            <_Button
                            style={Style.buttonGold}
                            disabled={!canGotoQuestion}
                            onPress={(e: any) => submit(1)}
                            loading={loading}
                            >
                                {nextButton}
                            </_Button>
                        </View>
                    </View>
                </View>
            </View>
            :
            <View
            style={[containerStyle(), _styles.container, _styles.doneContainer]}
            >
                <_Text
                style={_styles.doneHeaderText}
                >
                    Hang tight
                    </_Text>
                <_Text
                style={_styles.doneSubHeaderText}
                >
                    We're getting your matches ready!
                </_Text>
                <ActivityIndicator
                    size="large"
                    color={Color.gold}
                    style={_styles.loading}
                />
                <_Text>Comparing matches</_Text>
            </View>
            }
            </View>
            :
            <View>
                <View
                style={[containerStyle(), _styles.container]}
                >
                    <_Text>Screen for...Want to review your survey questions?</_Text>
                    <_Button
                            style={Style.buttonGold}
                            onPress={(e: any) => getQuestions(0, true)}
                            >
                                Review Answers
                    </_Button>
                </View>
            </View>
            }
            {error || props.error ?
            <_Text 
            containerStyle={errorContainerStyle()}
            innerContainerStyle={{justifyContent: 'center'}} 
            style={errorStyle()}
            >
                {error}
                </_Text>
            : null}
        </ScrollView>
    </View>
    );
};

const _styles = StyleSheet.create({
    doneContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 20
    },
    doneHeaderText: {
        fontSize: FontSize.large,
        fontWeight: 'bold'
    },
    doneSubHeaderText: {
        fontSize: FontSize.default
    },
    loading: {
        padding: 20
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
    separator: {
        width: "100%",
        backgroundColor: Color.border,
        height: "1px",
        marginTop: "40px"
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
    container: {
        backgroundColor: Color.white,
    },
    buttonContainer: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'flex-end',
        marginTop: 20,
        marginBottom: 20
    },
    optionContainerStyle: {
        marginTop: "10px"
    },
    title: {
        fontFamily: 'Inter-SemiBold',
        fontSize: FontSize.large
    },
    questionText: {
        color: Color.text,
        paddingBottom: 20,
        fontSize: FontSize.default,
        fontWeight: "bold"
    },
    questionTextMobile: {
        fontSize: FontSize.default,
    },
    questionCntText: {
        color: Color.textSecondary,
        fontSize: FontSize.default,
        paddingBottom: 10,
        fontWeight: 'bold'
    },
    questionCntTextMobile: {
        fontSize: FontSize.default,
        paddingTop: 10
    }
});

export default SurveyScreen;