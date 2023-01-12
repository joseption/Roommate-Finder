import React, { useEffect, useState } from 'react';
import { Image, Platform, Pressable, StyleSheet, View } from 'react-native';
import _Text from '../../components/control/text';
import { Color, FontSize } from '../../style';
import { useNavigation } from '@react-navigation/native';
import { navProp } from '../../helper';


const _Image = (props: any) => {
    /* Props
    onPress: Trigger your function
    style: Give the image custom styling
    pressStyle: Give the outer image container a custom style
    navigate: Navigate to a location in the stack using NavTo
    source: The requires(uri) that contains the image path
    ratio: A scaler number to change the size of the image while maintaining the aspect ratio (must leave blank to use other scale types)
    width: Set the image width to given number and scale the height to maintain the aspect ratio (if both entered, given wXh will be used)
    height: Set the image height to given number and scale the width to maintain the aspect ratio (if both entered, given wXh will be used)
    */
    const navigation = useNavigation<navProp>();
    const [style,setStyle] = useState([props.style]);
    useEffect(() => {
        if (Platform.OS === "web") {
            Image.getSize(props.source, (w, h) => {
                getStyle(w, h);
            });
        }
        else {
            var img = Image.resolveAssetSource(props.source);
            getStyle(img.width, img.height);
        }
    }, [props.source]);

    const press = () => {
        if (props.navigate) {
            navigation.navigate(props.navigate);
        }
        else if (props.onPress) {
            props.onPress();
        }
    }

    const getStyle = (width: any, height: any) => {
        var _style = [];
        // Set original (default) dimensions
        var dim = {
            height: height,
            width: width
        }
        // Set the dimensions based on original image with a given ratio.
        // Ex: If original image is 200x100 and ratio of .5 is given, new dimensions are 100x50
        // ratio={.5}
        if (props.ratio) {
            dim = {
                height: height * props.ratio,
                width: width * props.ratio
            }
        }
        // Set height based on calculated ratio from given width. Ex:
        // width={99}
        else if (props.width && !props.height) {
            var ratio = props.width / width;
            dim = {
                height: height * ratio,
                width: props.width
            }
        }
        // Set width based on calculated ratio from given height. Ex:
        // height={99}
        else if (props.height && !props.width) {
            var ratio = props.height / height;
            dim = {
                height: props.height,
                width: width * ratio,
            }
        }
        // Set given width and height. Ex:
        // width={99}
        // height={99}
        else if (props.height && props.width) {
            dim = {
                height: props.height,
                width: props.width,
            }
        }
        if (props.style) {
            _style.push(props.style);
        }
        _style.push(dim);

        setStyle(_style);
    }

    return (
    <View
    style={styles.imageContainer}
    >
        {props.onPress ?
        <Pressable
        style={props.pressStyle}
        onPress={() => press()}
        >
            <Image
            source={props.source}
            style={style}
            />
        </Pressable>
        :
        <Image
        source={props.source}
        style={style}
        />
        }
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
    },
    imageContainer: {
        justifyContent: 'center',
    }
});

export default _Image;