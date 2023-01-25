import { useNavigation } from '@react-navigation/native';
import { useEffect } from 'react';
import { View } from 'react-native';
import _Button from '../components/control/button';
import _Text from '../components/control/text';
import _TextInput from '../components/control/text-input';
import { navProp, NavTo } from '../helper';

const SearchScreen = (props: any) => {
    /*
    Daniyal: This screen should be used to add all the components
    that you will need to it for search. I have created a components
    folder named "search" where you can create the filter component (filter.tsx)
    and profile cards (profile-card.tsx) that you will need to generate within
    profiles (profiles.tsx) component. So, this page will really just have
    profiles.tsx and filter.tsx on it and whatever else you need to add here.
    If you need to create other components please add them to the search folder
    that I already generated for you.
    */
    const navigation = useNavigation<navProp>();
    useEffect(() => {
        // Set the page whether it is for matches or explore
        let rt = route();
        if (rt && rt.name == NavTo.Search) {
            if (rt.params && rt.params['view'] && (rt.params['view'] as string).toLowerCase() == "matches") {
                if (!props.isMatches)
                    props.setIsMatches(true);
            }
            else {
                if (props.isMatches)
                    props.setIsMatches(false); 
            }
        }
        // End
    }, [props.isMatches, navigation]);

    const route = () => {
        if (navigation) {
            let state = navigation.getState();
            if (state && state.routes) {
                return state.routes[state.index];
            }
        }
        return null;
    }

    return (
    <View>
        {props.isMatches ?
            <_Text>Looking at matches only!</_Text>
            :
            <_Text>Looking at everyone!</_Text>
        }
    </View>
    );
};

export default SearchScreen;