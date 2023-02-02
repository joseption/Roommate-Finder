import { Pressable, View, StyleSheet, Image, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import _Text from '../control/text';

const ListingCard = (props: any) => {

  return (
    <View style={styles.container}>
      <Image source={{ uri: props.item.images[0] }} style={styles.image} />
      <_Text style={styles.header}>{props.item.name}</_Text>
      <_Text style={styles.subheader}>{props.item.city}</_Text>
      <_Text style={styles.description}>{props.item.description}</_Text>
      <_Text style={styles.price}>{props.item.price}</_Text>
      <_Text style={styles.petsAllowed}>
        Pets Allowed: {props.item.petsAllowed ? 'Yes' : 'No'}
      </_Text>
      <Pressable
    style={styles.viewListingButton}
    >
  <_Text style={styles.viewListingButtonText}>View Listing</_Text>
</Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
    container: {
      padding: 20,
      backgroundColor: '#fff',
      borderRadius: 10,
      marginBottom: 20,
      shadowColor: '#000',
      shadowOpacity: 0.2,
      shadowRadius: 5,
      shadowOffset: { width: 0, height: 2 },
      elevation: 2,
    },
    image: {
      width: '100%',
      height: 200,
      borderTopLeftRadius: 10,
      borderTopRightRadius: 10,
    },
    header: {
      fontSize: 22,
      fontWeight: 'bold',
      marginTop: 10,
    },
    subheader: {
      fontSize: 16,
      color: 'gray',
      marginTop: 5,
    },
    description: {
      fontSize: 16,
      marginTop: 10,
    },
    price: {
      fontSize: 18,
      fontWeight: 'bold',
      marginTop: 10,
    },
    petsAllowed: {
      fontSize: 16,
      marginTop: 10,
    },
    viewListingButton: {
      backgroundColor: '#000',
      padding: 10,
      borderRadius: 5,
      marginTop: 20,
      alignSelf: 'flex-end',
    },
    viewListingButtonText: {
      color: '#fff',
      fontSize: 18,
      fontWeight: 'bold',
      textAlign: 'center',
    },
  });

export default ListingCard;
