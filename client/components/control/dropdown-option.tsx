import { StyleSheet, TouchableHighlight } from 'react-native';
import { Color, FontSize } from '../../style';
import Text from './text';
import _Text from './text';

const _DropdownOption = (props: any) => {
    /*
    Props: JA TODO 
    */

    const styles = StyleSheet.create({
        style: {
            width: '100%',
            paddingLeft: 10,
            paddingRight: 10,
            paddingTop: 10,
            paddingBottom: 10,
            fontSize: FontSize.default,
            color: Color(props.isDarkMode).text
        },
        hide: {
            display: 'none'
        }
    });
      

    return (
    <TouchableHighlight
    underlayColor={Color(props.isDarkMode).default}
    onPress={() => props.onPress(props.item)}
    style={props.item.display === 'none' ? styles.hide : null}
    >
        <Text
        style={[styles.style, {backgroundColor: props.item.background}]}
        >
            {props.item.value}
        </Text>
    </TouchableHighlight>
    );
};

export default _DropdownOption;