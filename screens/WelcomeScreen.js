import {
    Image,
    StyleSheet,
    Text,
    View,
    Button,
    TouchableOpacity,
  } from 'react-native';

import React from 'react';
export const Step1Screen = ({ navigation }) => (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome 1</Text>
      <TouchableOpacity onPress={() => navigation.navigate('Step2')} style={styles.button} activeOpacity={0.8}>
        <Text style={styles.textButton}>next</Text>
      </TouchableOpacity>
    </View>
  );
  
export const Step2Screen = ({ navigation }) => (
    <View>
      <Text>Step 2</Text>
      <Button title="Next" onPress={() => navigation.navigate('Step3')} />
    </View>
  );

export const Step3Screen = ({ navigation }) => (
    <View>
      <Text>Step 3</Text>
      <Button title="Next" onPress={() => navigation.navigate('Step4')} />
    </View>
  );
  
export const Step4Screen = ({ navigation }) => (
    <View>
      <Text>Step 4</Text>
      <Button title="Next" onPress={() => navigation.navigate('Step5')} />
    </View>
);
  
export const Step5Screen = ({ navigation }) => (
    <View style={styles.container}>
        <Text style={styles.title}>Welcome 5</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Login')} style={styles.button} activeOpacity={0.8}>
            <Text style={styles.textButton}>next</Text>
        </TouchableOpacity>
    </View>
);

const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },
});