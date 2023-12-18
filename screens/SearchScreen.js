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
  // const token = useSelector((state) => state.user.value.token) ;
  const token = "kTe-BIKeY40kJaYz6JMm9sEcJFtpxVpD"; // Token avec des lastSearches pour tester
  // !!! Récupérer le vrai token => async storage ? redux ?

  const [query, setQuery] = useState("");
  const [data, setData] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [searches, setSearches] = useState([]);
  const [searchQuery, setSearchQuery] = useState([]);

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

    const fetchLastSearch = async () => {
      try {
        const response = await fetch(
          `http://${IP_ADDRESS}:3000/searches/last5Searches/${token}`
        );
        const result = await response.json();
        console.log("dans fetch lastsearch",result.search);
        setSearches(result.search);
  
        // console.log(data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchLastSearch();

  }, []);


  // Lancer la recherche en cliquant sur le bouton
  const handleSearch = () => {
    const fetchQuery = async () => {
      try {
        const response = await fetch(
          `http://${IP_ADDRESS}:3000/drugs/byName/${query}`
        );
        const result = await response.json();
        setSearchQuery(result.name);
        // console.log(data);
      } catch (error) {
        console.error(error);
      }
      console.log("Recherche lancée pour :", query);
    };
    fetchQuery();
    setQuery("");
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
    const selectedDrug = data.find((item) => item.name === suggestion)._id;
    console.log("selectedDrug :", selectedDrug);
    dispatch(addLastSearch(selectedDrug)); // Dispatch l'id pour pouvoir le récupérer sur la page infoDrugScreen
    navigation.navigate("InfoDrugScreen");
    setQuery("");
  };

  const onLastSearchClick = (data) => {
    dispatch(addLastSearch(data._id));
    navigation.navigate("InfoDrugScreen");
    setQuery("");
  };

  // Map pour afficher les dernières recherches si elles existent
  const lastSearches = data.drug_id === null ? (
    <View></View>
  ) : (
    searches.map((data, i) => (
      <View key={i} style={styles.lastSearchesContainer}>
        <TouchableOpacity onPress={() => onLastSearchClick(data)}>
          <Text style={styles.searchName}>{data.drug_id.name}</Text>
        </TouchableOpacity>
      </View>
    ))
  );

  return (
    // masque le clavier quand on clique en dehors de la zone input :
    <TouchableWithoutFeedback
      onPress={() => {
        Keyboard.dismiss();
        setSuggestions([]);
        setQuery(""); // Masquer les suggestions lorsqu'on clique en dehors
      }}
    >
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
            placeholder="Nom du médicament..."
            containerStyle={styles.autocompleteContainer}
          />
          <TouchableOpacity onPress={handleSearch} style={styles.searchButton}>
            <FontAwesome name="search" size={30} color="white" />
          </TouchableOpacity>
        </View>
        <Text style={styles.titleLastSearches}>Mes dernières recherches</Text>
        {lastSearches}
      </View>
    </TouchableWithoutFeedback>
  );
}
const styles = StyleSheet.create({
  title: {
    fontSize: 24,
    fontWeight: "bold",
  },
  titleLastSearches: {
    marginTop: 40,
    fontSize: 20,
  },
  container: {
    flex: 1,
    marginTop: 120,
    justifyContent: "top",
    alignItems: "center",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "top",
    marginTop: 20,
    paddingHorizontal: 16,
  },
  autocompleteContainer: {
    flex: 1,
    left: 0,
    right: 0,
    top: 0,
    zIndex: 1,
    marginBottom: 10,
    backgroundColor: "white",
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
    height: 44,
    width: 44,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#3498db",
    borderRadius: 5,
  },

  suggestionItem: {
    backgroundColor: "#fff", // Utilisez une couleur solide
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    opacity: 1,
  },
  buttonText: {
    color: "#fff",
  },
  lastSearchesContainer: {
    marginTop: 20,
  },
  searchName: {
    color: "blue",
    textDecorationLine: "underline",
  },
});
