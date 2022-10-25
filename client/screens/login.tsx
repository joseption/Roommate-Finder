import React from 'react';
import { Button, StyleSheet, Text, View } from 'react-native';

export type Props = {
  name: string;
  baseEnthusiasmLevel?: number;
};

const Login = ({navigation}) => {
  return (
    <View style={styles.container}>
        <View>
            <Button
            title="Home"
            onPress={() => navigation.navigate('Home')}
            />
        </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  greeting: {
    fontSize: 20,
    fontWeight: 'bold',
    margin: 16
  }
});

export default Login;