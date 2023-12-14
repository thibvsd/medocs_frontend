import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useDispatch } from 'react-redux';
import {logout} from '../reducers/user';

const ProfileScreen = ({ navigation }) => {

  const dispatch = useDispatch();

  const handleLogout = () => {
    // Dispatch the logout action to reset the state
    dispatch(logout());
  };

  return (
    <View style={styles.container}>
      <Text style={styles.username}>username</Text>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('Favoris')}
      >
        <Text style={styles.buttonText}>Mes favoris</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('Traitements')}
      >
        <Text style={styles.buttonText}>Traitements en cours</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('Parametres')}
      >
        <Text style={styles.buttonText}>Paramètres de mon profil</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('FAQ')}
      >
        <Text style={styles.buttonText}>FAQ</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={handleLogout}
      >
        <Text style={styles.buttonText}>Log out</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  username: {
    fontSize: 18,
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#ec6e5b',
    padding: 10,
    borderRadius: 5,
    marginVertical: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
  },
});

export default ProfileScreen;
