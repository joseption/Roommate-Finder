import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Picker } from 'react-native';

const Dropdown = (props: any) => {

  const [selectedValue, setSelectedValue] = useState('<1 mile');

  return (
    <View style={styles.dropdownContainer}>
      <Picker
        selectedValue={selectedValue}
        style={{ height: 50, width: '100%' }}
        onValueChange={(itemValue, itemIndex) => setSelectedValue(itemValue)}
      >
        <Picker.Item label="<1 mile" value="<1 mile" />
        <Picker.Item label="1-10 miles" value="1-10 miles" />
        <Picker.Item label="10 miles+" value="10 miles+" />
      </Picker>
    </View>
  );
};

const styles = StyleSheet.create({
  dropdownContainer: {
    width: '80%',
    height: 40,
    borderRadius: 5,
    backgroundColor: '#ffffff',
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
    paddingLeft: 10,
    paddingRight: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  dropdownText: {
    fontSize: 16,
    color: '#000000',
  }
});

export default Dropdown;
