import _TextInput from '../control/text-input';
import _Dropdown from '../control/dropdown';
import _Text from '../control/text';
import React, { useState } from 'react';
import { Color, FontSize, Radius, Style } from '../../style';
import _Button from '../control/button';
import _Image from '../control/image';
import _Cluster from '../control/cluster';
import _ClusterOption from '../control/cluster-option';
import { Platform, ScrollView, StyleSheet, View } from 'react-native';
import { AccountScreenType } from '../../helper';

const AccountAbout = (props: any, {navigation}:any) => {
    const [error,setError] = useState('');
    const [bioForm,setBioForm] = useState('');
    const [interestsForm,setInterestsForm] = useState('');
    const [activitiesForm,setActivitiesForm] = useState('');
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
        return "Tell us more about yourself";
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
                onPress={(e: any) => props.setView(AccountScreenType.info)}
                >
                    Edit Account
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
            <_TextInput
            multiline={true}
            height={250}
            label="Bio"
            required={true}
            containerStyle={_styles.formGap}
            showMaxLength={true}
            maxLength={1000}
            onChangeText={(e: any) => setBioForm(e)}
            >

            </_TextInput>
            <_Cluster
            label="Life Interests"
            required={true}
            minAmount={10}
            options={
                [{key:1, value:'TestSelect'},{key:42, value:'Another'},{key:2, value:'Select'},{key:3, value:'Testing'},{key:4, value:'LookHere'},{key:5, value:'What is this?'},{key:6, value:'Some Option'},{key:7, value:'No Thank you'},{key:8, value:'Another Test'},{key:9, value:'LookHere'},{key:10, value:'TestSelect'},{key:12, value:'Another'},{key:13, value:'Select'},{key:14, value:'Testing'},{key:15, value:'LookHere'},{key:16, value:'What is this?'},{key:17, value:'Some Option'},{key:18, value:'No Thank you'},{key:19, value:'Another Test'},{key:20, value:'LookHere'},{key:21, value:'TestSelect'},{key:22, value:'Another'},{key:23, value:'Select'},{key:24, value:'Testing'},{key:425, value:'LookHere'},{key:26, value:'What is this?'},{key:27, value:'Some Option'},{key:28, value:'No Thank you'},{key:29, value:'Another Test'},{key:30, value:'LookHere'}]
            }
            containerStyle={_styles.formGap}
            selected={setInterestsForm}
            >
            </_Cluster>
            <_Cluster
            label="Activities"
            required={true}
            minAmount={10}
            options={
                [{key:1, value:'TestSelect'},{key:42, value:'Another'},{key:2, value:'Select'},{key:3, value:'Testing'},{key:4, value:'LookHere'},{key:5, value:'What is this?'},{key:6, value:'Some Option'},{key:7, value:'No Thank you'},{key:8, value:'Another Test'},{key:9, value:'LookHere'},{key:10, value:'TestSelect'},{key:12, value:'Another'},{key:13, value:'Select'},{key:14, value:'Testing'},{key:15, value:'LookHere'},{key:16, value:'What is this?'},{key:17, value:'Some Option'},{key:18, value:'No Thank you'},{key:19, value:'Another Test'},{key:20, value:'LookHere'},{key:21, value:'TestSelect'},{key:22, value:'Another'},{key:23, value:'Select'},{key:24, value:'Testing'},{key:425, value:'LookHere'},{key:26, value:'What is this?'},{key:27, value:'Some Option'},{key:28, value:'No Thank you'},{key:29, value:'Another Test'},{key:30, value:'LookHere'}]
            }
            selected={setActivitiesForm}
            >
            </_Cluster>
        </View>
        <View
        style={_styles.buttonContainer}
        >
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
    formGap: {
        marginBottom: 20
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
});

export default AccountAbout;