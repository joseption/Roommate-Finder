import React, { useState } from "react";
import { TextInput, View, StyleSheet } from "react-native";
import _Button from "../control/button";

const MessageInput = () => {
  const [newMessage, setNewMessage] = useState('');
  
  return (
    <View style={styles.container}>
      <TextInput
        value={newMessage}
        onChangeText={setNewMessage}
        style={styles.input}
        multiline
      />
      <_Button>Send</_Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: 'whitesmoke',
    padding: 5,
    paddingHorizontal: 10,
    marginTop: 10,
    alignItems: 'center',
  },
  input: {
    appearance: 'none',
    flex: 1,
    backgroundColor: 'white',
    padding: 5,
    marginHorizontal: 10,

    borderRadius: 50,
    borderColor: 'lightgray',
    borderWidth: StyleSheet.hairlineWidth,
  },
});

export default MessageInput;