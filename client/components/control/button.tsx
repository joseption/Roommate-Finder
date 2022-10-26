import { useLinkProps } from '@react-navigation/native';
import React, { useRef } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import _Text from '../../components/control/text';
import { Color, FontSize, Style } from '../../style';

const _Button = (props: any) => {
    const ref = useRef(null);
    const textStyle = () => {
        return (props.disabled) ? styles.textDisabled : styles.text;
    }

    const press = () => {
        if (props.navigation) {
            props.navigation.navigate(props.navigateTo);
        }
        else if (props.onPress) {
            props.onPress();
        }
    }

    return (
    <View>
        <Pressable
            style={[props.style, Style.button]}
            onPress={() => press()}
        >
            <_Text style={textStyle()}>{props.children}</_Text>
        </Pressable>
    </View>
    );
};

const styles = StyleSheet.create({
    text: {
        color: Color.white,
        fontSize: FontSize.default
    },
    textDisabled: {
        color: Color.textDisabled,
        fontSize: FontSize.default
    }
  });

export default _Button;