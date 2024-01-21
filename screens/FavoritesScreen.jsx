import { useState, useEffect } from "react";
import { ActivityIndicator, StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import { IP_ADDRESS } from "../config.js";
import { addLastSearch } from "../reducers/drugs";

export default function FavoritesScreen({ navigation }) {
  const user = useSelector((state) => state.user.value);
  const dispatch = useDispatch();
  const [token, setToken] = useState(null);
  const [favoDrug, setFavoDrug] = useState([]);
  const [loading, setLoading] = useState(true); // État de chargement


  useEffect(() => {
    fetch(`http://${IP_ADDRESS}:3000/favorites/loadFavorite/${user.token}`)
      .then((response) => response.json())
      .then((data) => {
        setFavoDrug(data.idAndName);
        setLoading(false); // Met fin au chargement
      })
      .catch((error) => {
        console.error("Fetch error:", error);
        setLoading(false); // En cas d'erreur, met fin au chargement
      });
  }, []);

  const handleDelete = (drug) => {
    fetch(
      `http://${IP_ADDRESS}:3000/favorites/deleteFavorite/${user.token}/${drug}`,
      {
        method: "DELETE",
      }
    )
      .then((response) => response.json())
      .then((data) => {
        if (data.result) {
          setFavoDrug(data.favorites);
        }
      })
      .catch((error) => {
        console.error("Fetch error:", error);
      });
  };

  const onDrugPress = (data) => () => {
  dispatch(addLastSearch(data));
  navigation.navigate("InfoDrugScreen");
}

  const favoDrugs =
    favoDrug && favoDrug.length > 0 || !token ? (
      favoDrug.map((data, i) => {
        return (
          <View key={i} style={styles.card}>
            <TouchableOpacity style={styles.favoriteElement} onPress={onDrugPress(data._id)}>
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
        <Text>Aucun médicament favori</Text>
      </View>
    );

  return (
    <View style={styles.container}>
      {loading ? ( // Utilisation de l'ActivityIndicator pendant le chargement
        <ActivityIndicator size="large" color="#3FB4B1" />
      ) : (
        favoDrugs
      )}
    </View>
  );
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
    alignItems: "center",
    backgroundColor: "#f0f0f0",
    width: "100%",
    padding: 10,
    marginVertical: 10,
    borderRadius: 5,
    elevation: 3,
  },
  favoriteElement:{
    width : "85%",
    marginLeft:10,
  },
  icon: {
    margin: 10,
  },
  name: {
    fontSize: 18,
    color: "#333",
  },
});
