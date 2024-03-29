import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Keyboard,
  ScrollView,
  StyleSheet,
  Image,
  Linking
} from "react-native";
import Autocomplete from "react-native-autocomplete-input";
import { useDispatch, useSelector } from "react-redux";
import { addLastSearch } from "../reducers/drugs";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import { IP_ADDRESS } from "../config.js";
import { Dropdown } from "react-native-element-dropdown";

export default function HomeScreen({ navigation }) {
  const dispatch = useDispatch();
  const { navigate } = navigation;

  const token = useSelector((state) => state.user.value.token);
  const [query, setQuery] = useState("");
  const [data, setData] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [articles, setArticles] = useState([]);
  const [loadSource, setLoadSource] = useState([]);
  const [sourceValue, setSourceValue] = useState(null);
  const [keyword, setKeyword] = useState("");

  const [selectedFilter, setSelectedFilter] = useState(null);
  const [filterModals, setFilterModals] = useState({
    boutonFiltre: false,
    source: false,
    famille: false,
    motCle: false,
  });
  
  //fetch pour alimenter le select input "sources des articles"
  const fetchSources = async () => {
    try {
      const response = await fetch(
        `https://medidoc-backend.vercel.app/articles/sources`
      );
      const resultSources = await response.json();
      setLoadSource(resultSources.sources);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    // AbortController pour arrêter la requête si query est modifié

    /*Création d'un contrôleur à l’aide du constructeur AbortController(),
    puis référence à son objet AbortSignal à l’aide de la propriété AbortController.signal.
    A l'initialisation, du fetch de la fonction fetchData 
    nous transmettons AbortSignal en tant qu'option dans l'objet options de la demande = {signal}
    Cela associe le signal et le contrôleur à la demande de récupération et nous permet de l'abandonner en appelant AbortController.abort()
    à la destruction du composant => dans le return*/

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
          `https://medidoc-backend.vercel.app/drugs/query3characters/${queryToFilter}`,
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
    return () => fetchDataController.abort(); //return => permet de stopper la requete a la destruction du composant
  }, [query]);

  useEffect(() => {
    // Fetch pour récupérer les 3 derniers articles
    const fetchArticles = async () => {
      try {
        const response = await fetch(
          `https://medidoc-backend.vercel.app/articles/latestNews`
        );
        const result = await response.json();
        setArticles(result.latestNews);
      } catch (error) {
        console.error(error);
      }
    };
    fetchArticles();
    fetchSources();
  }, []);

  const onSuggestionPress = (suggestion) => {
    // Cherche le name et extrait son _id :
    const selectedDrug = data.find((item) => item.name === suggestion)._id;
    if (token) {
      // enregistre la recherche dans la DB
      fetch(`https://medidoc-backend.vercel.app/searches/addLastSearch/${token}`, {
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
            navigation.navigate("InfoDrugScreen"); // redirige vers l'info du médicament
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

  // Click sur la loupe, lance la recherche et envoi vers la page des résultats de recherche = searchscreen params = query
  const handleSearch = () => {
    navigation.navigate("TabNavigator", {
      screen: "Search",
      params: {
        screen: "SearchScreen",
        params: {
          queryinput:"",
          query: query,
        },
      },
    });
    setQuery("");
    setSuggestions([]);
    Keyboard.dismiss();
  };

  // Ouvre l'url
  const openUrl = (url) => {
    Linking.openURL(url)
      .then((supported) => {
        if (!supported) {
          console.error("Opening URL is not supported");
        } else {
          console.log("URL opened:", url);
        }
      })
      .catch((err) => console.error("Error opening URL:", err));
  };

  const handleDropdownSource = (item) => {
    const selectedSource = item.value;
    setSourceValue(selectedSource);
    handleCombinedFilter();
  };

  const handleSearchKeyword = () => {
    handleCombinedFilter();
  };

  const handleCombinedFilter = async () => {
    try {
      if (!sourceValue && !keyword) {
        return;
      }
      const formattedSource = encodeURIComponent(sourceValue || "undefined");
      const formattedKeyword = encodeURIComponent(keyword || "undefined");

      const response = await fetch(
        `https://medidoc-backend.vercel.app/articles/bySourceAndKeyword/${formattedSource}/${formattedKeyword}`
      );
      const data = await response.json();

      setArticles(data.combinedArticles); // Mettre à jour les articles filtrés dans l'état
    } catch (error) {
      console.error(error);
    }
  };

  const tabSource = loadSource.map((source) => ({
    label: source,
    value: source,
  }));

  const generateFeed = (articles) => {
    const filterdArticles = articles.map((data, i) => {
      const options = { day: "2-digit", month: "2-digit", year: "numeric" };
      const formattedDate = new Date(data.date).toLocaleDateString(
        "fr-FR",
        options
      );
      return (
        <View key={i} style={styles.articleContainer}>
          <View style={styles.articleTextContainer}>
            <Text style={styles.articleTitle}>{data.title}</Text>
            <Text style={styles.articleDate}>{formattedDate}</Text>
            <Text style={styles.articleContent}>{data.content}</Text>
          </View>
          <TouchableOpacity onPress={() => openUrl(data.url)} 
            accessibilityLabel="acces article" 
            title={data.title}
            accessibilityRole="button">
            <FontAwesome name="external-link" size={25} color="#3FB4B1" />
          </TouchableOpacity>
          <Image
            source={{ uri: data.illustration }}
            style={styles.articleImage}
          />
        </View>
      );
    });
    return filterdArticles;
  };

  // Utilisation de generateFeed chaque fois que articles est modifié
  const feed = generateFeed(articles);
  // Gestion du clavier avec le composant TouchableWithoutFeedback => appeler une fn qui ferme le 
  //clavier chaque fois que vous appuyez sur l'écran
  return (
    <TouchableWithoutFeedback
      onPress={() => {
        Keyboard.dismiss();
        setSuggestions([]);
        setQuery("");
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
            flatListProps={{
              //définit comment chaque élément de la liste générée par Autocomplete sera affiché
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
          <TouchableOpacity onPress={handleSearch} style={styles.searchButton1}>
            <FontAwesome name="search" size={20} color="white" />
          </TouchableOpacity>
        </View>

        <View style={styles.filterButtonContainer}>
          <View style={styles.filterButtons}>
            <Dropdown
              style={styles.dropdown}
              placeholderStyle={styles.placeholderStyle}
              selectedTextStyle={styles.selectedTextStyle}
              inputSearchStyle={styles.inputSearchStyle}
              iconStyle={styles.iconStyle}
              data={tabSource}
              search
              maxHeight={300}
              labelField="label"
              valueField="value"
              placeholder="Source"
              searchPlaceholder="Search..."
              value={sourceValue}
              onChange={handleDropdownSource}
            />

            <View style={styles.searchKeyWordContainer}>
              <TextInput
                style={styles.keywordInput}
                placeholder="mot-clé..."
                onChangeText={(text) => setKeyword(text)}
                value={keyword}
              />
              <TouchableOpacity
                style={styles.searchButton}
                onPress={handleSearchKeyword}
              >
                <Text style={styles.okText}>OK</Text>
              </TouchableOpacity>
            </View>
          </View>
          {selectedFilter &&
            filterModals[selectedFilter] &&
            renderFilterMenu(selectedFilter)}
        </View>
        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
        >
          <TouchableOpacity>{feed}</TouchableOpacity>
        </ScrollView>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  dropdown: {
    marginLeft: 16,
    paddingRight:10,
    height: 40,
    width: 120,
    backgroundColor:"#BFE9DB",
    borderRadius:10,
  },
  selectedTextStyle: {
    fontSize: 16,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
    padding: 10,
    borderRadius: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    position: "relative",
    zIndex: 0,
    marginTop: 20,
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
    position: "relative",
    zIndex: 1,
  },
  placeholderStyle: {
    color: "grey",
    textAlign: "center",
  },
  searchKeyWordContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 18,
    alignItems: "flex-end",
    position: "relative",
    zIndex: 1,
  },
  keywordInput: {
    height: 40,
    width: 150,
    borderColor: "gray",
    backgroundColor: "white",
    marginLeft: 20,
    paddingLeft:10,
    borderRadius: 5,

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
    height: 20,
    borderColor: "gray",
    borderWidth: 1,
    paddingLeft: 10,
    color: "#333",
    
  },

  suggestionItem: {
    backgroundColor: "white",
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  filterButtonContainer: {
    display: "flex",
    flexDirection: "row",
    // alignItems: "space-between",
    justifyContent: "space-around",
    paddingHorizontal: 10,
    position: "relative",
    width: "100%",
  },
  filterButtons: {
    margin: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
  },
  iconStyle:{
color:"white",
  },
  okText: {
    color: "white",
    fontWeight: "bold",
  },
  filterButton: {
    marginRight: 5,
    color: "white",
    backgroundColor: "#E1F6F4",
    borderRadius: 10,
    paddingVertical: 5,
    paddingHorizontal: 18,
  },
  searchButtonText: {
    color: "white",
    fontSize: 16,
  },
  articleContainer: {
    marginTop: 20,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    marginVertical: 10,
    marginLeft: 20,
    width: "90%",
  },
  scrollView: {
    flexGrow: 1,
    width: "100%",
  },
  articleImage: {
    width: 80,
    height: 80,
    marginRight: 20,
    marginLeft: 10,
  },
  articleTextContainer: {
    flex: 1,
    marginRight: 10,
  },
  articleTitle: {
    fontSize: 16,
    fontWeight: "bold",
  },
  articleDate: {
    fontStyle: "italic",
    color: "grey",
  },
  articleContent: {
    fontSize: 14,
  },

  openUrlButton: {
    bottom: 0,
    right: 0,
    backgroundColor: "blue",
    borderRadius: 5,
  },
  openUrlButtonText: {
    color: "white",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.8)",
  },
  modalText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "white",
    marginBottom: 20,
  },
  closeModalText: {
    fontSize: 16,
    color: "white",
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
  filterdefault: {
    width: 32,
    height: 24,
  },
});
