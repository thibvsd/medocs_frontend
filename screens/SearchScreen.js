import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Keyboard,
  FlatList,
  StyleSheet,
} from "react-native";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import Autocomplete from "react-native-autocomplete-input";
import { useDispatch, useSelector } from "react-redux";
import { addLastSearch } from "../reducers/drugs";
import { IP_ADDRESS } from "../config.js";

// ECRAN DE RECHERCHE

export default function SearchScreen({ navigation }) {
  const dispatch = useDispatch();
  const { navigate } = navigation;

  const [query, setQuery] = useState("");
  const [data, setData] = useState([]);
  const [suggestions, setSuggestions] = useState([]);


  useEffect(() => {
    // Fetch les noms des médicaments (pour l'autocomplétion)
    const fetchData = async () => {
      try {
        const response = await fetch(
          `http://${IP_ADDRESS}:3000/drugs/allNames`
        );
        const result = await response.json();
        setData(result.namesAndId);
        // console.log(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, []);

  // Lancer la recherche en cliquant sur le bouton
  const handleSearch = () => {
    dispatch(addLastSearch(query));
    // Ajouter la logique de recherche ici
    console.log("Recherche lancée pour :", query);
  };

  // Filtrer les suggestions en fonction de la valeur de l'input
  const filterData = (text) => {
    if (text.length >= 3) {
      const filteredData = data
        .filter((item) => item.name.toLowerCase().includes(text.toLowerCase()))
        .slice(0, 10); // Limite à 10 suggestions
      setSuggestions(filteredData.map((item) => item.name)); // map pour n'avoir que les names sans clé
    } else {
      setSuggestions([]);
    }
  };

  const onSuggestionPress = (suggestion) => {
    // Cherche le name et extrait son _id :
    const selectedDrug = data.find(
      (item) => item.name === suggestion
    )._id;
    console.log("selectedDrug :", selectedDrug);
    dispatch(addLastSearch(selectedDrug)); // Dispatch the selected drug id
    // navigation.navigate('infoDrugScreen');
  };


  return (
    // masque le clavier quand on clique en dehors de la zone input :
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <View style={styles.container}>
        <Text style={styles.title}>Recherche</Text>
        <View style={styles.searchContainer}>
          <Autocomplete
            data={suggestions}
            value={query}
            onChangeText={(text) => {
              setQuery(text);
              filterData(text);
            }}
            // Affiche les suggestions :
            flatListProps={{
              keyExtractor: (_, idx) => idx.toString(),
              renderItem: ({ item }) => (
                <TouchableOpacity onPress={() => onSuggestionPress(item)}>
                  <Text style={styles.suggestionItem}>{item}</Text>
                </TouchableOpacity>
              ),
            }}
            placeholder="Rechercher..."
            containerStyle={styles.autocompleteContainer}
          />
          <TouchableOpacity onPress={handleSearch} style={styles.searchButton}>
            <FontAwesome name="search" size={30} color="white" />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
}
const styles = StyleSheet.create({
  title: {
    fontSize: 24,
    fontWeight: "bold",
  },
  container: {
    flex: 1,
    marginTop: 120,
    justifyContent: "top",
    alignItems: "center",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 20,
    paddingHorizontal: 16,
    alignItems: "flex-end", // Ajout de cette ligne
  },
  autocompleteContainer: {
    flex: 1,
    left: 0,
    right: 0,
    top: 0,
    zIndex: 1,
    marginBottom: 10,
    backgroundColor:"white",
  },
  searchInput: {
    flex: 1,
    height: 50,
    borderColor: "gray",
    borderWidth: 1,
    paddingLeft: 10,
    color: "#333",
  },
  searchButton: {
    height: 50,
    width: 50,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#3498db",
    padding: 10,
    borderRadius: 5,
  },

  suggestionItem: {
    backgroundColor:"white",
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  buttonText: {
    color: "#fff",
  },
});
