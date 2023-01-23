import { Pressable, View,} from 'react-native';
import { Style } from '../../style';
import _Button from '../control/button';
import _Text from '../control/text';
import _TextInput from '../control/text-input';

const ListingCard = (props: any, {navigation}:any) => {

   const viewListing = () => {
    props.setListingID('myID');
    props.setIsListing(true);
   }

    return (
    <View>
        <_Text>
        {props.item.name}
        </_Text>
        <_Text>
        {props.item.city}
        </_Text> 
        <_Text>
        {props.item.housing_type}
        </_Text> 
        <_Text>
        {props.item.description}
        </_Text> 
        <_Text>
        {props.item.price}
        </_Text>  
        <_Text>
        {props.item.petsAllowed ? "Yes":"No"}
        </_Text>  
        <_Button onPress = {() => viewListing()}>view listing</_Button>   
    </View>
    );
};

export default ListingCard;