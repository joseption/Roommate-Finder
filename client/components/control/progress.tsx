import { useLinkProps, useNavigation } from '@react-navigation/native';
import React, { useEffect, useRef } from 'react';
import { ActivityIndicator, Platform, Pressable, StyleSheet, View } from 'react-native';
import _Text from '../../components/control/text';
import { navProp } from '../../helper';
import { Color, FontSize, Radius, Style } from '../../style';

const _Progress = (props: any) => {
    const navigation = useNavigation<navProp>();
    const totalWidth = 100;
    useEffect(() => {
    }, [props.progress]);

    const textStyle = () => {
        var style = [];
        style.push(styles.text);
        if (props.textStyle)
            style.push(props.textStyle);

        return style;
    }

    const containerStyle = () => {
        var style = [];
        style.push(styles.container);
        style.push(props.containerStyle);
        return style;
    }

    const indicatorStyle = () => {
        var style = [];
        style.push(styles.progressIndicator);
        if (props.progress >= 100) {
            style.push(styles.progressComplete);
        }
        else {
            style.push(styles.progressInComplete);
        }
        if (props.progress && props.progress >= 0)
            style.push({
                width:  props.progress + "%"
            });
        return style;
    }

    return (
    <View
    style={containerStyle()}
    >
            <_Text
            style={textStyle()}
            >
                {props.progress}%
            </_Text>
            <View
            style={styles.progressBar}
            >
                <View
                style={styles.progressBarContainer}
                >
                </View>
                <View
                style={indicatorStyle()}
                >
                </View>
            </View>
    </View>
    );
};

const styles = StyleSheet.create({
    text: {
        color: Color.textSecondary,
        fontSize: FontSize.default,
        marginRight: "5px"
    },
    progressBar: {
        height: "16px",
    },
    contentContainer: {
        display: 'flex',
        flexDirection: 'row'
    },
    container: {
        flexDirection: "row",
        alignItems: "center"
    },
    progressBarContainer: {
        backgroundColor: Color.grey,
        borderRadius: Radius.large,
        width: "100px",
        height: "100%"
    },
    progressIndicator: {
        backgroundColor: Color.gold,
        height: "100%",
        position: "absolute",
    },
    progressComplete: {
        borderRadius: Radius.large
    },
    progressInComplete: {
        borderTopLeftRadius: Radius.large,
        borderBottomLeftRadius: Radius.large
    }
});

export default _Progress;