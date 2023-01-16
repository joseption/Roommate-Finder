import { useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableHighlight } from 'react-native';
import MessagePanel from './message-panel';

const MessageTab = () => {
  const [showPanel, updateShowPanel] = useState(false);

  return (
    <>
      {[...Array(20).keys()].map((val) => <TouchableHighlight
        style={styles.touchable}
        underlayColor="gainsboro"
        onPress={() => updateShowPanel(!showPanel)}
        key={val}
      >
        <View style={styles.content}>
          <Image style={styles.image} source={{ uri: 'https://reactnative.dev/img/tiny_logo.png' }} />
          <View style={styles.text}>
              <Text numberOfLines={1} style={styles.name}>{'Name ' + val}</Text>
              <Text numberOfLines={2}>Hello World</Text>
          </View>
        </View>
      </TouchableHighlight>)}
      <MessagePanel showPanel={showPanel} updateShowPanel={updateShowPanel} />
    </>
  );
};

const styles = StyleSheet.create({
  touchable: {
    flex: 1,
    flexDirection: 'row',
    marginHorizontal: 5,
    paddingHorizontal: 10,
    paddingVertical: 5,
    height: 70,
    borderRadius: 10,
    alignItems: 'center',
  },
  content: {
    flexDirection: 'row',
    flex: 1,
  },
  image: {
    height: 60,
    width: 60,
    borderRadius: 30,
    marginRight: 10,
  },
  text: {
    flex: 1,
    marginRight: 45,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
  }
});

export default MessageTab;