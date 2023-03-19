import { useNavigation } from '@react-navigation/native';
import { ActivityIndicator, Pressable, StyleSheet, TouchableHighlight, View } from 'react-native';
import _Text from '../../components/control/text';
import { navProp } from '../../helper';
import { Color, FontSize, Radius, Style } from '../../style';

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
        var style = [];
        style.push(Style(props.isDarkMode).font);
        if (props.disabled || props.loading)
            style.push(styles.textDisabled)
        else
            style.push(styles.text);

        if (props.textStyle)
            style.push(props.textStyle);

        return style;
    }

    const press = () => {
        if (!props.disabled) {
            if (props.navigate) {
                navigation.navigate(props.navigate);
            }
            else if (props.onPress) {
                props.onPress();
            }
        }
    }

    const style = () => {
        var style = [];
        style.push(Style(props.isDarkMode).button);
        if (!props.style) {
            style.push(Style(props.isDarkMode).buttonDefault);
         }
         else {
            style.push(props.style);
         }

         if (props.disabled || props.loading) {
            style.push(Style(props.isDarkMode).buttonDisabled);
         }

         return style;
    }

    const getUnderlay = () => {
        return props.isDarkMode ? Color(props.isDarkMode).whiteUnderlay : Color(props.isDarkMode).holderUnderlay
    }

    const styles = StyleSheet.create({
        text: {
            color: Color(props.isDarkMode).actualWhite,
            fontSize: FontSize.default,
            margin: 'auto',
            display: 'flex'
        },
        textDisabled: {
            color: Color(props.isDarkMode).textDisabled,
            fontSize: FontSize.default,
            margin: 'auto'
        },
        contentContainer: {
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection: 'row',
        },
        loading: {
            marginRight: 5
        }
    });

    return (
    <View
    style={props.containerStyle}
    >
        <TouchableHighlight
        disabled={props.disabled || props.loading}
        onPress={() => press()}
        underlayColor={getUnderlay()}
        style={[{borderRadius: Radius.default, margin: 0, padding: 0}, props.containerStyle]}
        >
            <View
                style={[styles.contentContainer, style()]}
            >
                {props.loading ?
                <ActivityIndicator
                    size="small"
                    color={Color(props.isDarkMode).textDisabled}
                    style={styles.loading}
                />
                : null}
                <_Text
                style={textStyle()}
                onPress={() => press()}
                >
                    {props.value ? props.value : props.children}
                </_Text>
            </View>
        </TouchableHighlight>
    </View>
    );
};

export default _Button;