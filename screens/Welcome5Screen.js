import {
    Image,
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
  } from 'react-native';
  
  export default function Welcome5Screen({ navigation }) {
  
    return (
      <View>
        <Text style={styles.title}>Welcome 5</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Login')} style={styles.button} activeOpacity={0.8}>
          <Text style={styles.textButton}>next</Text>
        </TouchableOpacity>
      </View>
    )
  }
  
  const styles = StyleSheet.create({
      
  });
  