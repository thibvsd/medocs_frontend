import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import FontAwesome from "react-native-vector-icons/FontAwesome";
import { useDispatch, useSelector } from 'react-redux';
import {logout} from '../reducers/user';

const ProfileScreen = ({ navigation }) => {

  const dispatch = useDispatch();
  const username = useSelector((state) => state.user.value.username);

  const handleLogout = () => {
    // Dispatch the logout action to reset the state
    dispatch(logout());
  };

  return (
    <View style={styles.container}>
              <FontAwesome
                  name="user"
                  size={100}
                  color='#3FB4B1'
                  style={styles.userImage}
                />
      <Text style={styles.username}>{username}</Text>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('Favoris')}
      >
                <FontAwesome
                  name="star"
                  size={20}
                  color="white"
                  style={styles.filterButtonCaret}
                />
        <Text style={styles.buttonText}>Mes favoris</Text>
        <FontAwesome
                  name="caret-right"
                  size={20}
                  color="white"
                  style={styles.filterButtonCaret}
                />
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('Traitements')}
      >
        <Text style={styles.buttonText}>Traitements en cours</Text>
        <FontAwesome
                  name="caret-right"
                  size={20}
                  color="white"
                  style={styles.filterButtonCaret}
                />
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('Parametres')}
      >
                                <FontAwesome
                  name="cog"
                  size={20}
                  color="white"
                  style={styles.filterButtonCaret}
                />
        <Text style={styles.buttonText}>Paramètres de mon profil</Text>
        <FontAwesome
                  name="caret-right"
                  size={20}
                  color="white"
                  style={styles.filterButtonCaret}
                />
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('FAQ')}
      >
                                        <FontAwesome
                  name="question"
                  size={20}
                  color="white"
                  style={styles.filterButtonCaret}
                />
        <Text style={styles.buttonText}>FAQ</Text>
        <FontAwesome
                  name="caret-right"
                  size={20}
                  color="white"
                  style={styles.filterButtonCaret}
                />
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.logout}
        onPress={handleLogout}
      >
        <Text style={styles.logoutText}>Log out</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop:20,
  },
  userImage: {
  paddingBottom:50,  
  },
  username: {
    fontSize: 18,
    marginBottom: 20,
    color:'#3FB4B1',
  },
  button: {
    backgroundColor: '#3FB4B1',
    width:"100%",
    height:60,
    padding: 10,
    borderRadius: 5,
    marginVertical: 3,
    textAlign:"center",
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent:'space-between',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    textAlign: 'left',
    fontWeight: 'bold',
  },
  filterButtonCaret: {
    marginRight: 10,
  },
  pills:{
    width:15,
    height:15,
  },
  logout:{
    marginTop:20,
textAlign:"center",
  },
  logoutText:{
    color:'#3FB4B1',
fontWeight:"bold",
fontSize:16,
  },
});

export default ProfileScreen;
