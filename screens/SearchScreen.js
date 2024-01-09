import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Keyboard,
  ScrollView,
  StyleSheet,
  ActivityIndicator
} from "react-native";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import Autocomplete from "react-native-autocomplete-input";
import { useDispatch, useSelector } from "react-redux";
import { addLastSearch } from "../reducers/drugs";
import { IP_ADDRESS } from "../config.js";

// ECRAN DE RECHERCHE
export default function SearchScreen({ route, navigation }) {
  const dispatch = useDispatch();
  const [query, setQuery] = useState("");
  const [data, setData] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [searches, setSearches] = useState([]);
  const [queryResults, setQueryResults] = useState([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const token = useSelector((state) => state.user.value.token);
  const [isLoading, setIsLoading] = useState(false);

   //mis à jour à chaque changement du route.params.query
  useEffect(() => {
    if (route.params && route.params.query) {
      setShowSearchResults(true);
      const fetchQuery = async () => {
        try {
          const response = await fetch(
            `http://${IP_ADDRESS}:3000/drugs/byName/${route.params.query}`
          );
          const result = await response.json();
          setQueryResults(result); // enregistre les résultats de la recherche
          setQuery("");
        } catch (error) {
          console.error(error);
        }
      };
      //Appel de fetchQuery pour afficher les résultats pour le mot recherche = route.params.query
      fetchQuery();
      //after query
      setQuery("");
      setSuggestions([]);
    }
  }, [route.params]);

useEffect(() => {
  // AbortController pour arrêter la requête si query est modifié
  const fetchDataController = new AbortController();
  //query => valeur du text sélectionné dans l'autocomplete
  const queryToFilter = query;
  if (queryToFilter) {
    //function fetchdata appelée à chaque nouvelle valeur de l'état query
    fetchData().then((responseData) => {
      if (!responseData) return;
      //trie de responseData : Filter an item in array if it includes query drug name (contains)
      const filteredData = responseData
        .filter((item) =>
          item.name.toLowerCase().includes(queryToFilter.toLowerCase())
        );
      //set suggestions avec le nouveau tableau de 10 résultats incluant le texte saisi dans l'autocomplete
      setSuggestions(filteredData.map((item) => item.name)); // map pour n'avoir que les names sans _id
    });
  }
  // Fonction pour fetch les noms des médicaments (pour l'autocomplétion)
  async function fetchData() {
    try {
      ///drugs/query3characters/${queryToFilter} => limité à 10 résultats
      const response = await fetch(
        `http://${IP_ADDRESS}:3000/drugs/query3characters/${queryToFilter}`,
        { signal: fetchDataController.signal }
      );
      if (response.ok) {
        const result = await response.json();
        //namesAndId contient l'_id et le name du medicament
        setData(result.namesAndId);
        return result.namesAndId;
      }
      throw new Error(`Error: ${response.statusText}`);
      // in prod: return an error state to display for the user
    } catch (error) {
      if (error.name === "AbortError") {
        console.log("La requête fetchData a été annulée.");
      } else {
        console.error(error);
      }
    }
  }

    // Fonction pour fetch les dernières fiches consultées
    const fetchLastSearch = async () => {
      // vérifier la présence de token et bloquer si pas de token (et informer le user)
      if (!token) {
        return;
      }
      try {
        const response = await fetch(
          `http://${IP_ADDRESS}:3000/searches/last5Searches/${token}`
        );
        const result = await response.json();
        setSearches(result.search);
      } catch (error) {
        if (error.name === "AbortError") {
          console.log("La requête fetchLastSearch a été annulée.");
        } else {
          console.error(error);
        }
      }
    };

    //fetchData();
    fetchLastSearch();

  return () => fetchDataController.abort(); //return => permet de stopper la requete a la destruction du composant
}, [query]);


  // Lancer la recherche en cliquant sur le bouton loupe
  const handleSearch = async () => {
    console.log('query', query);
    setIsLoading(true);
    try {
      const response = await fetch(
        `http://${IP_ADDRESS}:3000/drugs/byName/${query}`
      );
      const result = await response.json();
      setQueryResults(result); // enregistre les résultats de la recherche
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
    setQuery("");
    setSuggestions([]);
    setShowSearchResults(true);
  };

  const onSuggestionPress = (suggestion) => {
    // Cherche le name et extrait son _id :
    const selectedDrug = data.find((item) => item.name === suggestion)._id;
    if (token) {
      // enregistre la recherche dans la DB
      fetch(`http://${IP_ADDRESS}:3000/searches/addLastSearch/${token}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          _id: selectedDrug,
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.result) {
            dispatch(addLastSearch(selectedDrug)); // Dispatch l'id pour pouvoir le récupérer sur la page infoDrugScreen
            navigation.navigate("InfoDrugScreen");
            setQuery("");
            setSuggestions([]);
          }
        });
    } else {
      dispatch(addLastSearch(selectedDrug)); // Dispatch l'id pour pouvoir le récupérer sur la page infoDrugScreen
      navigation.navigate("InfoDrugScreen");
      setQuery("");
      setSuggestions([]);
    }
  };

  // Quand click sur un résultat de recherche, redirige vers l'info du médicament
  const onSearchResultClick = (suggestion) => {
    if (token) {
      fetch(`http://${IP_ADDRESS}:3000/searches/addLastSearch/${token}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          _id: suggestion._id,
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.result) {
            dispatch(addLastSearch(suggestion._id));
            navigation.navigate("InfoDrugScreen");
            setQuery("");
            setQueryResults([]);
            setShowSearchResults(false);
            setSuggestions([]);
          }
        });
    } else {
      
      dispatch(addLastSearch(suggestion._id));
      navigation.navigate("InfoDrugScreen");
      setQuery("");
      setQueryResults([]);
      setShowSearchResults(false);
      setSuggestions([]);
    }
  };

  // Quand click sur une des dernières recherches, redirige vers la page info du médicament
  const onLastSearchClick = (data) => {
    dispatch(addLastSearch(data._id));
    navigation.navigate("InfoDrugScreen");
    setQuery("");
    setQueryResults([]);
    setShowSearchResults(false);
    setSuggestions([]);
  };

  // Map pour afficher les dernières recherches si elles existent
  const lastSearches =
    data.drug_id === null || !token ? (
      <View></View>
    ) : (
      searches.map((data, i) => (
        <View key={i} style={styles.searchesContainer}>
          <TouchableOpacity onPress={() => onLastSearchClick(data.drug_id)}>
            <Text style={styles.searchName}>{data.drug_id.name}</Text>
          </TouchableOpacity>
        </View>
      ))
    );

  // Map pour afficher les résultats de la recherche
  const newSearch = queryResults.map((data, i) => (
    <View key={i} style={styles.searchesContainer}>
      <TouchableOpacity onPress={() => onSearchResultClick(data)}>
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
        <View style={styles.searchContainer}>
          <Autocomplete
            data={suggestions}
            onChangeText={(text) => {
              if (text.length > 2) {
                setQuery(text);
              }
              if (!text.length) setSuggestions([]);
            }}
            defaultValue={query}
            // Affiche les suggestions :
            flatListProps={{
              keyExtractor: (_, idx) => idx.toString(),
              renderItem: ({ item }) => (
                <TouchableOpacity onPress={() => onSuggestionPress(item)}>
                  <Text style={styles.suggestionItem}>{item}</Text>
                </TouchableOpacity>
              ),
              keyboardShouldPersistTaps: 'always'          
            }}
            placeholder="Rechercher un médicament..."
            containerStyle={styles.autocompleteContainer}
          />
          <TouchableOpacity
            onPress={handleSearch}
            style={styles.searchButton1}
            disabled={isLoading} // Désactive le bouton pendant le chargement
          >
            {isLoading ? (
              <ActivityIndicator size="small" color="white" />
            ) : (
              <FontAwesome name="search" size={20} color="white" />
            )}
          </TouchableOpacity>
        </View>
        {showSearchResults ? (
          // Afficher les résultats de la recherche si on en a lancé une
          <View>
            <Text style={styles.titleSearches}>
              Résultats de la recherche :
            </Text>
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
            {token ? (
              <>
                <Text style={styles.titleSearches}>
                  Dernières fiches consultées
                </Text>
                <View>{lastSearches}</View>
              </>
            ) : (
              <View></View>
            )}
          </View>
        )}
      </View>
    </TouchableWithoutFeedback>
  );
}
const styles = StyleSheet.create({
  container: {
    flexDirection: "row", // This makes the child elements arrange horizontally
    justifyContent: "space-between", // This provides equal space between the buttons
    padding: 10,
  },
  contentTab: {
    flex: 1,
    flexDirection: "row", // This makes the child elements arrange horizontally
    justifyContent: "space-between", // This provides equal space between the buttons
  },
  articleBox: {
    backgroundColor: "#fff",
    marginBottom: 10,
    padding: 10,
    borderRadius: 5,
    borderColor: "#ddd",
    borderWidth: 1,
  },
  scrollViewArticles: {
    flex: 1,
    backgroundColor: "#ffffff",
    marginBottom: 20,
    padding: 10,
    margin: 10,
    borderRadius: 5,
  },

  articleTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
  },
  articleDate: {
    fontSize: 14,
    color: "#888",
    marginBottom: 5,
  },
  articleContent: {
    fontSize: 16,
  },
  button: {
    backgroundColor: "#3498db",
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: "#ffffff",
    fontSize: 16,
    textAlign: "center",
  },

  ///
  title: {
    fontSize: 24,
    fontWeight: "bold",
  },
  container: {
    flex: 1,
    marginTop: 70,
    justifyContent: "top",
    alignItems: "center",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 10,
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
    height: 40,
    width: 40,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#3FB4B1",
    borderRadius: 5,
  },

  suggestionItem: {
    backgroundColor: "#fff", 
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    opacity: 1,
  },
  titleSearches: {
    marginTop: 20,
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
  },
  buttonText: {
    color: "#fff",
  },
  searchesContainer: {
    textAlign: "center",
    marginTop: 20,
    marginLeft: 20,
    marginRight: 20,
  },
  searchName: {
    textAlign: "center",
    color: "#2E9693",
    textDecorationLine: "underline",
  },
  scrollView: {
    flexGrow: 1,
    width: "100%",
  },
  searchButton1: {
    height: 42,
    width: 42,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#3FB4B1",
    borderRadius: 10,
    marginLeft: 5,
  },
});
