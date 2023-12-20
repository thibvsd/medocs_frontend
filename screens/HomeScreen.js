import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Keyboard,
  Modal,
  FlatList,
  ScrollView,
  StyleSheet,
  Image,
} from "react-native";
import Autocomplete from "react-native-autocomplete-input";
import { useDispatch, useSelector } from "react-redux";
import { addLastSearch } from "../reducers/drugs";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import { Linking } from "react-native";
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
  const [selectedSource, setSelectedSource] = useState(null);
  const [loadSource, setLoadSource] = useState([]);
  const [loadFamille, setLoadFamille] = useState([]);
  const [selectedFilter, setSelectedFilter] = useState(null);
  const [filterModals, setFilterModals] = useState({
    boutonFiltre: false,
    source: false,
    famille: false,
    motCle: false,
  });
  const [sourceValue, setSourceValue] = useState(null);
  const [familleValue, setFamilleValue] = useState(null);

  const pickerRef = useRef();

  function open() {
    pickerRef.current.focus();
  }

  function close() {
    pickerRef.current.blur();
  }

  const fetchSources = async () => {
    try {
      const response = await fetch(
        `http://${IP_ADDRESS}:3000/articles/sources`
      );
      const resultSources = await response.json();
      setLoadSource(resultSources.sources);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchFamilles = async () => {
    try {
      console.log("ici");
      const response = await fetch(`http://${IP_ADDRESS}:3000/articles/codes`);
      const resultLabels = await response.json();
      setLoadFamille(resultLabels.codes);
      console.log("dans le label", resultLabels.codes);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    // AbortController pour arrêter la requête si query est modifié
    const fetchDataController = new AbortController();

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
        if (error.name === "AbortError") {
          console.log("La requête fetchData a été annulée.");
        } else {
          console.error(error);
        }
      }
    };

    // Fetch pour récupérer les 3 derniers articles
    const fetchArticles = async () => {
      try {
        const response = await fetch(
          `http://${IP_ADDRESS}:3000/articles/latestNews`
        );
        const result = await response.json();
        setArticles(result.latestNews);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
    fetchArticles();
    fetchSources();
    fetchFamilles();
    return () => fetchDataController.abort();
  }, []);

  // Filtre les suggestions en fonction de la valeur de l'input
  const filterData = (text) => {
    if (text.length >= 3) {
      const filteredData = data
        .filter((item) => item.name.toLowerCase().includes(text.toLowerCase()))
        .slice(0, 10);
      setSuggestions(filteredData.map((item) => item.name));
    } else {
      setSuggestions([]);
    }
  };

  const onLogin = () => {
    navigation.navigate("TabNavigator", {
      screen: "Search",
      params: {
        screen: "InfoDrugScreen",
      },
    });
  };

  const onSuggestionPress = (suggestion) => {
    // Cherche le name et extrait son _id :
    const selectedDrug = data.find((item) => item.name === suggestion)._id;
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
          navigation.navigate("InfoDrugScreen"); // redirige vers l'info du médicament
          setQuery("");
          setSuggestions([]);
        }
      });
  };

  // Click sur la loupe, lance la recherche
  const handleSearch = () => {
    navigation.navigate("TabNavigator", {
      screen: "Search",
      params: {
        screen: "SearchScreen",
        params: {
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

  const openFilterModal = (filter) => {
    setSelectedFilter(filter);
    setFilterModals((prev) => ({ ...prev, [filter]: true }));
  };

  const handleSourceChange = (value) => {
    setSelectedSource(value);
  };

  const handleDropdownSource = (item) => {
    setSourceValue(item.value);

    // Envoi de la requête à la route souhaitée avec la valeur sélectionnée
    fetch(`http://${IP_ADDRESS}:3000/articles/bySource/${item.value}`)
      .then((response) => response.json())
      .then((data) => {
        setArticles(data.sourceArticles);
      })
      .catch((error) => {
        console.error("Erreur lors de la requête :", error);
      });
  };

  const handleDropdownFamille = (item) => {
    setSourceValue(item.value);

    // Envoi de la requête à la route souhaitée avec la valeur sélectionnée
    fetch(`http://${IP_ADDRESS}:3000/articles/bySource/${item.value}`)
      .then((response) => response.json())
      .then((data) => {
        setArticles(data.sourceArticles);
      })
      .catch((error) => {
        console.error("Erreur lors de la requête :", error);
      });
  };

  const tabSource = loadSource.map((source) => ({
    label: source,
    value: source,
  }));

  const tabFamille = loadFamille.map((source) => ({
    label: source.label,
    value: source.label,
  }));

  // Affichage des articles récupérés via le fetch
  // const feed = articles.map((data, i) => {
  //   const options = { day: "2-digit", month: "2-digit", year: "numeric" };
  //   const formattedDate = new Date(data.date).toLocaleDateString(
  //     "fr-FR",
  //     options
  //   );
  //   return (
  //     <View key={i} style={styles.articleContainer}>
  //       <View style={styles.articleTextContainer}>
  //         <Text style={styles.articleTitle}>{data.title}</Text>
  //         <Text style={styles.articleDate}>{formattedDate}</Text>

  //         <Text style={styles.articleContent}>{data.content}</Text>
  //       </View>
  //       <TouchableOpacity onPress={() => openUrl(data.url)}>
  //         <FontAwesome name="external-link" size={25} color="#3FB4B1" />
  //       </TouchableOpacity>
  //       <Image
  //         source={{ uri: data.illustration }}
  //         style={styles.articleImage}
  //       />
  //     </View>
  //   );
  // });

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
          <TouchableOpacity onPress={() => openUrl(data.url)}>
            <FontAwesome name="external-link" size={25} color="#3FB4B1" />
          </TouchableOpacity>
          <Image
            source={{ uri: data.illustration }}
            style={styles.articleImage}
          />
        </View>
      );
    });
    return filterdArticles
  };
  
  // Utilisation de generateFeed chaque fois que articles est modifié
  const feed = generateFeed(articles);

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
            value={query}
            onChangeText={(text) => {
              setQuery(text);
              filterData(text);
            }}
            flatListProps={{
              //définit comment chaque élément de la liste générée par Autocomplete sera affiché
              keyExtractor: (_, idx) => idx.toString(),
              renderItem: ({ item }) => (
                <TouchableOpacity onPress={() => onSuggestionPress(item)}>
                  <Text style={styles.suggestionItem}>{item}</Text>
                </TouchableOpacity>
              ),
            }}
            placeholder="Rechercher un médicament..."
            containerStyle={styles.autocompleteContainer}
          />
          <TouchableOpacity onPress={handleSearch} style={styles.searchButton}>
            <FontAwesome name="search" size={30} color="white" />
          </TouchableOpacity>
        </View>
        <Text style={styles.title}>Feed</Text>
        <View style={styles.filterButtonContainer}>
          <View style={styles.filterButtons}>
            <TouchableOpacity
              style={styles.filterButtonLeft}
              onPress={() => openFilterModal("boutonFiltre")}
            >
              <FontAwesome name="filter" size={25} color="#3FB4B1" />
            </TouchableOpacity>
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

            <Dropdown
              style={styles.dropdown}
              placeholderStyle={styles.placeholderStyle}
              selectedTextStyle={styles.selectedTextStyle}
              inputSearchStyle={styles.inputSearchStyle}
              iconStyle={styles.iconStyle}
              data={tabFamille}
              search
              maxHeight={300}
              labelField="label"
              valueField="value"
              placeholder="famille"
              searchPlaceholder="Search..."
              value={familleValue}
              onChange={handleDropdownFamille}
            />

            <TouchableOpacity
              style={styles.filterButton}
              onPress={() => openFilterModal("motCle")}
            >
              <Text style={styles.filterButtonText}>
                Mot-clé{" "}
                <FontAwesome
                  name="caret-down"
                  size={20}
                  color="white"
                  style={styles.filterButtonCaret}
                />
              </Text>
            </TouchableOpacity>
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
    margin: 16,
    height: 50,
    borderBottomColor: "gray",
    borderBottomWidth: 0.5,
  },
  selectedTextStyle: {
    fontSize: 16,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
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
    backgroundColor: "white",
  },
  searchInput: {
    flex: 1,
    height: 40,
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
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    paddingHorizontal: 16,
    marginTop: 10,
  },
  filterButtons: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  filterButtonLeft: {
    marginLeft: 10,
    marginRight: 10,
  },
  filterButton: {
    marginRight: 5,
    color: "white",
    backgroundColor: "#3FB4B1",
    borderRadius: 30,
    paddingVertical: 10,
    paddingHorizontal: 18,
  },
  filterButtonText: {
    fontSize: 16,
    color: "white",
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
  searchButton:{
  height: 40,
  width: 40,
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "center",
  backgroundColor: "#3FB4B1",
  borderRadius: 5,}
});
