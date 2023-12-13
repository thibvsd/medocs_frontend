import {
    Image,
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
  } from 'react-native';
  
  export default function Welcome4Screen({ navigation }) {
  
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Welcome 4</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Welcome5')} style={styles.button} activeOpacity={0.8}>
          <Text style={styles.textButton}>next</Text>
        </TouchableOpacity>
      </View>
    )
  }
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },
  });
  