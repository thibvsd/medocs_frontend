import { useState, useEffect } from "react";
import { Image, StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import { IP_ADDRESS } from "../config.js";

export default function FavoritesScreen({ navigation }) {
  const user = useSelector((state) => state.user.value);
  const [token, setToken] = useState(null);
  const [favoDrug, setFavoDrug] = useState([]);

  useEffect(() => {
    fetch(`http://${IP_ADDRESS}:3000/favorites/loadFavorite/${user.token}`)
      .then((response) => response.json())
      .then((data) => {
        console.log("favo recu ", data.idAndName);
        setFavoDrug(data.idAndName);
      });
  }, []);

  // A modifier
  const handleDelete = (drug) => {
    // console.log("dans le delete ", drug);
    // console.log("le token ", user.token);
    fetch(
      `http://${IP_ADDRESS}:3000/favorites/deleteFavorite/${user.token}/${drug}`,
      {
        method: "DELETE",
      }
    )
      .then((response) => response.json())
      .then((data) => {
        if (data.result) {
          // console.log("dans le then ", data.favorites);
          setFavoDrug(data.favorites);
        } else {
          console.log("data.result",data.result);
        }
      })
      .catch((error) => {
        console.error("Fetch error:", error);
      });
  };
  const favoDrugs =
    favoDrug.length > 0 || !token ? (
      favoDrug.map((data, i) => {
        console.log("data in map", data);
        return (
          <View key={i} style={styles.card}>
            <TouchableOpacity style={styles.favoriteElement}>
              <Text style={styles.name}>{data.name}</Text>
            </TouchableOpacity>
            <FontAwesome
              style={styles.icon}
              name="trash-o"
              onPress={() => handleDelete(data._id)}
              size={25}
              color="#3FB4B1"
            />
          </View>
        );
      })
    ) : (
      <View>
        {/* Votre contenu pour la vue vide, par exemple un message */}
        <Text>Aucun médicament favori</Text>
      </View>
    );

  return <View>{favoDrugs}</View>;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    marginTop: 20,
  },
  card: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    backgroundColor: "#f0f0f0",
    width: "100%",
    padding: 10,
    marginVertical: 10,
    borderRadius: 5,
    elevation: 3,
  },
  favoriteElement:{
width : "85%"
  },
  icon: {
    margin: 10,
  },
  name: {
    fontSize: 18,
    color: "#333",
  },
});
