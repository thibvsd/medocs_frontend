import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Keyboard,
  FlatList,
  ScrollView,
  StyleSheet,
  Image, // N'oubliez pas d'importer Image
} from "react-native";
import Autocomplete from "react-native-autocomplete-input";
import { useDispatch } from "react-redux";
import { addLastSearch } from "../reducers/drugs";
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { Linking } from "react-native";
import { IP_ADDRESS } from "../config.js";

export default function HomeScreen({ navigation }) {
  const dispatch = useDispatch();
  const { navigate } = navigation;

  const [query, setQuery] = useState("");
  const [data, setData] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [articles, setArticles] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `http://${IP_ADDRESS}:3000/drugs/allNames`
        );
        const result = await response.json();
        setData(result.namesAndId);
      } catch (error) {
        console.error(error);
      }
    };

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
  }, []);

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

  const onSuggestionPress = (suggestion) => {
    const selectedDrug = data.find((item) => item.name === suggestion)._id;
    console.log("selectedDrug :", selectedDrug);
    dispatch(addLastSearch(selectedDrug));
    // navigation.navigate('infoDrugScreen');
  };

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


  // Affichage des articles récupérés via le fetch
  const feed = articles.map((data, i) => {
    return (
      <View key={i} style={styles.articleContainer}>
            <Image
              source={{ uri: data.illustration }}
              style={styles.articleImage}
            />
            <View style={styles.articleTextContainer}>
              <Text style={styles.articleTitle}>{data.title}</Text>
              <Text style={styles.articleContent}>{data.content}</Text>
            </View>
            <TouchableOpacity
          onPress={() => openUrl(data.url)}
        >
          <FontAwesome name='external-link' size={25} color='#ec6e5b' />
        </TouchableOpacity>
      </View>
    );
  });

  return (
    <TouchableWithoutFeedback
      onPress={() => {
        Keyboard.dismiss();
        setSuggestions([]);
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
            placeholder="Rechercher..."
            containerStyle={styles.autocompleteContainer}
          />
        </View>
        <Text style={styles.title}>Feed</Text>
        <ScrollView contentContainerStyle={styles.scrollView}>
          {feed}
        </ScrollView>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 24,
    fontWeight: "bold",
    position: "relative",
    zIndex: 0,
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

  suggestionItem: {
    backgroundColor: "white",
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  articlesContainer: {

    borderColor: "black",
  },
  articleContainer: {
    marginVertical: 10,
  },
  articleImage: {
    width: 50,
    height: 50,
    marginRight: 10,
  },
  articleTextContainer: {
    flex: 1,
    
  },
  articleTitle: {
    fontSize: 16,
    fontWeight: "bold",
  },
  articleContent: {
    fontSize: 14,
  },
  openUrlButton: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: "blue",
    padding: 10,
    borderRadius: 5,
  },
  openUrlButtonText: {
    color: "white",
  },
});
