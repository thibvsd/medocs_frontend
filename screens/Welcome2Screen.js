import {
    Image,
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
  } from 'react-native';
  
  export default function Welcome2Screen({ navigation }) {
  
    return (
      <View>
        <Text style={styles.title}>Welcome 2</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Welcome3')} style={styles.button} activeOpacity={0.8}>
          <Text style={styles.textButton}>next</Text>
        </TouchableOpacity>
      </View>
    )
  }
  
  const styles = StyleSheet.create({
      
  });
  