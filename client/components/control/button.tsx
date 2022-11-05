import { useLinkProps, useNavigation } from '@react-navigation/native';
import React, { useRef } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import _Text from '../../components/control/text';
import { navProp } from '../../service';
import { Color, FontSize, Style } from '../../style';

const _Button = (props: any) => {
    /* Props
    disabled: Disables the button
    navigate: Navigate to a location in the stack using NavTo
    onPress: Trigger your function
    style: Give the button custom styling or use one of the predefined button styles
    value: Give the button text
    children: If the value is empty, the button will use the nested content
    */
    const navigation = useNavigation<navProp>();

    const textStyle = () => {
        return (props.disabled) ? styles.textDisabled : styles.text;
    }

    const press = () => {
        if (props.navigate) {
            navigation.navigate(props.navigate);
        }
        else if (props.onPress) {
            props.onPress();
        }
    }

    const style = () => {
        if (!props.style) {
            return [Style.buttonDefault, Style.button];
         }
         else {
            return [props.style, Style.button];
         }
      }

    return (
    <View>
        <Pressable
        disabled={props.disabled}
        style={style()}
        onPress={() => press()}
        >
            <_Text
            style={textStyle()}
            onPress={() => press()}
            >
                {props.value ? props.value : props.children}
            </_Text>
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