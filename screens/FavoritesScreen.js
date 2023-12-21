import { useState, useEffect } from 'react';
import { Image, StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import { IP_ADDRESS } from "../config.js";


export default function FavoritesScreen({ navigation }) {
    const user = useSelector((state) => state.user.value);

    const [favoDrug, setFavoDrug] = useState([]);

useEffect(() => {
    fetch(`http://${IP_ADDRESS}:3000/favorites/loadFavorite/${user.token}`)
    .then((response) => response.json())
    .then((data) => {
        setFavoDrug(data.idAndName)
    });},[]);

    // A modifier
    const handleDelete = (drug) => {
        fetch(`http://${IP_ADDRESS}:3000/favorites/deleteFavorite/${user.token}/${drug}`)
        .then((response) => response.json())
        .then((data) => {
            setFavoDrug(data.idAndName)
        });
    }

    const favoDrugs = favoDrug.map((data, i) => {
        return (
          <View key={i} style={styles.card}>
            <TouchableOpacity>
              <Text style={styles.name}>{data.name}</Text>
            </TouchableOpacity>
            <FontAwesome style={styles.icon} name='trash-o' onPress={() => handleDelete(data._id)} size={25} color='#ec6e5b' />
          </View>
        );
      });

  return (
    <View>
      {favoDrugs}
    </View>
  );
}

const styles = StyleSheet.create({    
  container: {
  flex: 1,
  padding: 20,
  backgroundColor: '#fff',
},
title: {
  fontSize: 24,
  fontWeight: 'bold',
  marginBottom: 20,
  textAlign:"center",
  marginTop:20,
},
card: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'flex-start',
  backgroundColor: '#f0f0f0',
  width: "80%",
  padding: 10,
  marginVertical: 10,
  borderRadius: 5,
  elevation: 3,
},
icon:{
margin : 10,
},
name: {
  fontSize: 18,
  color: '#333',
},});
