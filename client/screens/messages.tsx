import { useState } from 'react';
import { _Text, FlatList } from 'react-native';
import MessageTab from '../components/messages/message-tab';
import MessagePanel from '../components/messages/message-panel';
import _Button from '../components/control/button';
import _TextInput from '../components/control/text-input';

const MessagesScreen = (props: any, {navigation}:any) => {
  const [showPanel, updateShowPanel] = useState(false);

  const data = [...Array(20).keys()].map((item) => {
    return {name: `SD${item}`, lastMessage: `Last Message ${item}`}
  });

  return (
    <>
      <FlatList
        data={data}
        renderItem={({item}) => 
          <MessageTab
            showPanel={showPanel}
            updateShowPanel={updateShowPanel}
            name={item.name}
            lastMessage={item.lastMessage}
          />
        }
      />
      <MessagePanel showPanel={showPanel} updateShowPanel={updateShowPanel} />
    </>
  );
};

export default MessagesScreen;