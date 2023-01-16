import { View, _Text } from 'react-native';
import MessageTab from '../components/messages/message-tab';
import _Button from '../components/control/button';
import _TextInput from '../components/control/text-input';

const MessagesScreen = (props: any, {navigation}:any) => {
  /*
  Freddy: Add all content for the single page view here,
  If you need to make reusable components, create a folder
  in the components folder named "messages" and add your component files there
  */
  return (
    <View>
      <MessageTab />
    </View>
  );
};

export default MessagesScreen;