import { useCallback, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import _Button from '../components/control/button';
import _Progress from '../components/control/progress';
import _SurveyOption from '../components/control/survey-option';
import _Text from '../components/control/text';
import _TextInput from '../components/control/text-input';
import { Style, Color, FontSize, Radius } from '../style';

const SurveyScreen = (props: any, {navigation}:any) => {
    /*
    Joseph: Add all content for the single page view here,
    If you need to make reusable components, create a folder
    in the components folder named "survey" and add your component files there
    */
    const [error,setError] = useState('');
    const [selected,setSelected] = useState('');
    // const updateSelectedOption = useCallback((value: any) => { 
    //     //setFocus(value);
    //   }, []);
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

    const subtitle = () => {
        return "This is the currently selected question being worked on but I made the text a little bit longer to take up space.";
    }

    const subTitleStyle = () => {
        var style = [];
        style.push(_styles.subtitle);
        if (props.mobile) {
            style.push(_styles.subTitleMobile);
        }
        
        return style;
    }

    const optionContainerStyle = (count: number) => {
        var style = [];
        if (count > 0) 
            style.push(_styles.optionContainerStyle);
        return style;
    }
    
    // ja temp
    const options = [{key:1, value: 'This is a possible response'}, {key:2, value: 'Here is another response that is a bit longer and might spill onto another line and that is ok'}, {key:3, value: 'Pick me!'}, {key:4, value: 'Do not pick this one'}];

    const mappedItems = () => {
        var count = 0;
        return options.map((item: any, key: any) => {
            return <_SurveyOption
            onPress={(e: any) => {setSelected(item.key)}}
            containerStyle={optionContainerStyle(count++)}
            key={item.key}
            item={item}
            selected={item.key == selected}
            >{item.value}</_SurveyOption>
        })
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
                <_Progress progress={30}></_Progress>
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
                {mappedItems()}
                </View>
            <View
            style={_styles.separator}
            />
            <View
            style={_styles.buttonContainer}
            >
                <_Button
                        style={Style.buttonDefault}
                        >
                            Next Question
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
    </View>
    );
};

const _styles = StyleSheet.create({
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
        alignItems: 'center'
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
    subtitle: {
        color: Color.text,
        paddingBottom: 20,
        fontSize: FontSize.default,
        fontWeight: "bold"
    },
    subTitleMobile: {
        fontSize: FontSize.default,
        paddingTop: "10px"
    }
});

export default SurveyScreen;