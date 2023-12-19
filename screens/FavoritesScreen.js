import { useState } from 'react';
import { Image, StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import FontAwesome from "react-native-vector-icons/FontAwesome";

const IP_ADDRESS = '172.20.10.2'

export default function FavoritesScreen({ navigation }) {
    const user = useSelector((state) => state.user.value);

    const [favoDrug, setFavoDrug] = useState([]);

    fetch(`http://${IP_ADDRESS}:3000/favorites/addFavorites/${user.token}`)
    .then((response) => response.json())
    .then((data) => {
        setFavoDrug(data.favorites)
    });

    const favoDrugs = favoDrug.map((data, i) => {
        return (
          <View key={i} style={styles.card}>
            <View>
              <Text style={styles.name}>{data.name}</Text>
            </View>
            <FontAwesome name='trash-o' onPress={() => handleDelete(data.name)} size={25} color='#ec6e5b' />
          </View>
        );
      });

  return (
    <View>
      {favoDrugs}
    </View>
  );
}

const styles = StyleSheet.create({});
