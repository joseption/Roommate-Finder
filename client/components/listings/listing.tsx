import { View  } from 'react-native';
import _Button from '../control/button';
import _Text from '../control/text';
import _TextInput from '../control/text-input';

const ListingView = (props: any, {navigation}:any) => {

   // data pertaining to the listing
    return (
    <View>
        <_Text>
        {props.listingData}
        </_Text>  
        <_Button onPress = {() => props.setIsListing(false)}>go back to results</_Button>
    </View>
    );
};

export default ListingView;