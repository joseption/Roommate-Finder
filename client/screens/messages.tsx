import { useState } from 'react';
import { _Text, FlatList } from 'react-native';
import MessageTab from '../components/messages/message-tab';
import MessagePanel from '../components/messages/message-panel';
import _Button from '../components/control/button';
import _TextInput from '../components/control/text-input';

const MessagesScreen = (props: any, {navigation}:any) => {
  const [showPanel, updateShowPanel] = useState(false);
  const [currentChat, setCurrentChat] = useState({});

  const data = [...Array(20).keys()].map((item) => {
    return {
      name: `SD${item}`,
      lastMessage: `Last Message ${item}`,
      messages: [
        {
          sender: 'a',
          text: `hello ${item}`
        },
        {
          sender: 'a',
          text: 'world is very fun an full of many things to do. One of those things is being able to work on SD2. Oh so much fun!'
        },
        {
          sender: 'b',
          text: `hey ${item}`
        },
        {
          sender: 'b',
          text: 'there is a lot to do, and what best time I could spend than to spend time working on my SD2 project!'
        },
      ]
    }
  });

  return (
    <>
      <FlatList
        data={data}
        renderItem={({item}) => 
          <MessageTab
            showPanel={showPanel}
            updateShowPanel={updateShowPanel}
            chat={item}
            setCurrentChat={setCurrentChat}
          />
        }
      />
      <MessagePanel showPanel={showPanel} updateShowPanel={updateShowPanel} chat={currentChat}/>
    </>
  );
};

export default MessagesScreen;