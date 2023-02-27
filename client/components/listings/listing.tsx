import { ScrollView, StyleSheet, View  } from 'react-native';
import { Color, FontSize, Radius, Style } from '../../style';
import _Button from '../control/button';
import _Image from '../control/image';
import _Text from '../control/text';

const ListingView = (props: any) => {

  const onClose = () => {
    props.setCurrentListing(null)
  };

  const styles = StyleSheet.create({
    container: {
      height: '100%'
    },
    content: {
      padding: 10,
      height: '100%'
    },
    btnContainer: {
      padding: 10,
    },
    header: {
      fontSize: FontSize.large,
      fontWeight: 'bold',
      marginTop: 10,
      color: Color(props.isDarkMode).text
    },
    subheader: {
      fontSize: FontSize.default,
      color: Color(props.isDarkMode).textTertiary,
      fontStyle: 'italic'
    },
    description: {
      fontSize: FontSize.default,
      color: Color(props.isDarkMode).text,
      marginTop: 10,
    },
    price: {
      fontSize: FontSize.default,
      color: Color(props.isDarkMode).text,
    },
    petsAllowed: {
      fontSize: FontSize.default,
      color: Color(props.isDarkMode).text,
    },
    viewListingButton: {
      backgroundColor: Color(props.isDarkMode).black,
      padding: 10,
      borderRadius: 5,
      marginTop: 20,
      alignSelf: 'flex-end',
    },
    viewListingButtonText: {
      color: Color(props.isDarkMode).white,
      fontSize: 18,
      fontWeight: 'bold',
      textAlign: 'center',
    },
    image: {
      width: '100%',
      height: 200,
      borderRadius: Radius.default
    },
  });

  return (
    <View style={styles.container}>
      <ScrollView style={styles.content}>
        <_Image source={{ uri: props.currentListing.images[0] }} style={styles.image} />
        <_Text isDarkMode={props.isDarkMode} style={styles.header}>{props.currentListing.name}</_Text>
        <_Text isDarkMode={props.isDarkMode} style={styles.subheader}>{props.currentListing.city}</_Text>
        <_Text isDarkMode={props.isDarkMode} style={styles.description}>{props.currentListing.description}</_Text>
        <_Text isDarkMode={props.isDarkMode} style={styles.price}>{props.currentListing.price}</_Text>
        <_Text isDarkMode={props.isDarkMode} style={styles.petsAllowed}>
          Pets Allowed: {props.currentListing.petsAllowed ? 'Yes' : 'No'}
        </_Text>
      </ScrollView>
      <View style={styles.btnContainer}>
        <_Button onPress={() => onClose()} style={Style(props.isDarkMode).buttonDefault}>Go Back</_Button>
      </View>
    </View>
  );
};

export default ListingView;
