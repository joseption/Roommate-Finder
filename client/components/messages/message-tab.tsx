import { Dispatch, SetStateAction } from 'react';
import { View, Text, StyleSheet, Image, TouchableHighlight } from 'react-native';

interface Props {
  name: string,
  lastMessage: string,
  showPanel: boolean,
  updateShowPanel: Dispatch<SetStateAction<boolean>>,
}

const MessageTab = ({name, lastMessage, showPanel, updateShowPanel}: Props) => {
  return (
    <TouchableHighlight
      style={styles.touchable}
      underlayColor="gainsboro"
      onPress={() => updateShowPanel(!showPanel)}
    >
      <View style={styles.content}>
        <Image style={styles.image} source={{ uri: 'https://reactnative.dev/img/tiny_logo.png' }} />
        <View style={styles.text}>
            <Text numberOfLines={1} style={styles.name}>{name}</Text>
            <Text numberOfLines={2}>{lastMessage}</Text>
        </View>
      </View>
    </TouchableHighlight>
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