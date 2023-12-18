import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Keyboard,
  ScrollView,
  FlatList,
  StyleSheet,
} from "react-native";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import Autocomplete from "react-native-autocomplete-input";
import { useDispatch, useSelector } from "react-redux";
import { addLastSearch } from "../reducers/drugs";
import { IP_ADDRESS } from "../config.js";
import AsyncStorage from '@react-native-async-storage/async-storage';  // Importer AsyncStorage

// ECRAN DE RECHERCHE

export default function SearchScreen({ navigation }) {
  const dispatch = useDispatch();
  // const token = useSelector((state) => state.user.value.token) ;
  const token = "kTe-BIKeY40kJaYz6JMm9sEcJFtpxVpD"; // Token avec des lastSearches pour tester
//  const token = "XkXnvWcBQXW4ortC2mvsTyeX7_XU5xLb"; // Token sans  lastSearches pour tester
// !!! MODIFIER RECUPERATION TOKEN (aussi dans fetch LastSearch)

  // const [token, setToken] = useState('');
  const [query, setQuery] = useState("");
  const [data, setData] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [searches, setSearches] = useState([]);
  const [queryResults, setQueryResults] = useState([]);
  const [showSearchResults, setShowSearchResults] = useState(false);


  useEffect(() => {

    // AbortController pour arrêter la requête si query est modifié
    const fetchDataController = new AbortController();
    const fetchLastSearchController = new AbortController();

    // Fonction pour fetch les noms des médicaments (pour l'autocomplétion)
    const fetchData = async () => {
      try {
        if (query.length >= 3) {
          const response = await fetch(
            `http://${IP_ADDRESS}:3000/drugs/query3characters/${query}`,
            { signal: fetchDataController.signal }
          );
          const result = await response.json();
          setData(result.namesAndId);
        }
      } catch (error) {
        if (error.name === 'AbortError') {
          console.log('La requête fetchData a été annulée.');
        } else {
          console.error(error);
        }
      }
    };

    // Fonction pour fetch les dernières recherches
    const fetchLastSearch = async () => {
      try {
    //         // Attendre la résolution de la Promise AsyncStorage qui récupère le token
    // const storedToken = await AsyncStorage.getItem('token');
    // // Utiliser la valeur du token
    // setToken(storedToken);

        const response = await fetch(
          `http://${IP_ADDRESS}:3000/searches/last5Searches/${token}`,
          { signal: fetchLastSearchController.signal }
        );
        const result = await response.json();
        setSearches(result.search);
        console.log('Token:', token);
      } catch (error) {
        if (error.name === 'AbortError') {
          console.log('La requête fetchLastSearch a été annulée.');
        } else {
          console.error(error);
        }
      }
    };

    fetchData();
    fetchLastSearch();

    // Annuler la requête fetchData à chaque modification de query
    return () => fetchDataController.abort();
  }, [query]); // le useEffect se relance si query change


  // Lancer la recherche en cliquant sur le bouton
  const handleSearch = () => {
    const fetchQuery = async () => {
      try {
        const response = await fetch(
          `http://${IP_ADDRESS}:3000/drugs/byName/${query}`
        );
        const result = await response.json();
        console.log(result);
        setQueryResults(result); // enregistre les résultats de la recherche
        setShowSearchResults(true); // Afficher les résultats de la recherche
      } catch (error) {
        console.error(error);
      }
    };
    fetchQuery();
    setQuery("");
    setSuggestions([]);
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


// Quand click sur un résultat de recherche ou une lastSearch, rediriger vers l'info du médicament
  const onSearchClick = (data) => {
    dispatch(addLastSearch(data._id));
    navigation.navigate("InfoDrugScreen");
    setQuery("");
    setQueryResults([]);
    setShowSearchResults(false); 
  };

  // Map pour afficher les dernières recherches si elles existent
  const lastSearches = data.drug_id === null ? (
    <View></View>
  ) : (
    searches.map((data, i) => (
      <View key={i} style={styles.searchesContainer}>
        <TouchableOpacity onPress={() => onSearchClick(data)}>
          <Text style={styles.searchName}>{data.drug_id.name}</Text>
        </TouchableOpacity>
      </View>
    ))
  );

  // Map pour afficher les résultats de la recherche
  const newSearch = queryResults.map((data, i) => (

      <View key={i} style={styles.searchesContainer}>
        <TouchableOpacity onPress={() => onSearchClick(data)}>
          <Text style={styles.searchName}>{data.name}</Text>
        </TouchableOpacity>
      </View>
  ));

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
        {showSearchResults ? (
          // Afficher les résultats de la recherche si on en a lancé une
         <View>
          <Text style={styles.titleSearches}>Résultats de la recherche :</Text>
          <ScrollView
    style={styles.scrollView}
    showsVerticalScrollIndicator={false}
  >
          {newSearch}
          </ScrollView>
          </View>
        ) : (
          // Afficher Mes dernières recherches (par défaut)
          <View>
            <Text style={styles.titleSearches}>Mes dernières recherches</Text>
            {lastSearches}
          </View>
        )}
      </View>
    </TouchableWithoutFeedback>
  );
}
const styles = StyleSheet.create({
  title: {
    fontSize: 24,
    fontWeight: "bold",
  },
  titleSearches: {
    marginTop: 40,
    fontSize: 20,
    textAlign:'center',
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
    alignItems: "flex-end",
    position: "relative",
    zIndex: 1,
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
  searchesContainer: {
    marginTop: 20,
  },
  searchName: {
    color: "blue",
    textDecorationLine: "underline",
  },
  scrollView: {
    flexGrow: 1,
    width: "100%",
  },
});
