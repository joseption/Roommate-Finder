import { useNavigation } from '@react-navigation/native';
import { View  } from 'react-native';
import _Button from '../control/button';
import _Text from '../control/text';

const ListingView = (props: any) => {
  const navigation = useNavigation();

  return (
    <View>
      <_Text>{props.listingData}</_Text>
      <_Button onPress={() => props.setIsListing(false)}>
        go back to results
      </_Button>
      <_Button onPress={() => navigation.navigate(ListingCard)}>
        go back to ListingCard
       </_Button>
    </View>
  );
};

export default ListingView;
