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
import Autocomplete from "react-native-autocomplete-input";
import { useDispatch } from "react-redux";
import { addLastSearch } from "../reducers/drugs";
import { IP_ADDRESS } from "../config.js";
  
  export default function HomeScreen({ navigation }) {
    const dispatch = useDispatch();
  const { navigate } = navigation;

  const [query, setQuery] = useState("");
  const [data, setData] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [articles, setArticles] = useState([]);


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
  

      // Fetch des articles 
      const fetchArticles = async () => {
        try {
          const response = await fetch(`http://${IP_ADDRESS}:3000/latestNews`);
          const result = await response.json();
          setArticles(result);
        } catch (error) {
          console.error(error);
        }
      };
  
      fetchArticles();
    }, []);

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

  const renderArticleItem = ({ item }) => (
    <TouchableOpacity onPress={() => {}}>
      <View style={styles.articleContainer}>
        <Image source={{ uri: item.imageUrl }} style={styles.articleImage} />
        <View style={styles.articleTextContainer}>
          <Text style={styles.articleTitle}>{item.title}</Text>
          <Text style={styles.articleContent}>{item.content}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

    return (
// masque le clavier quand on clique en dehors de la zone input :
<TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
<View style={styles.container}>
  <Text style={styles.title}>Feed</Text>
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
  </View>
  <View style={styles.articlesContainer}>
  <FlatList
          data={articles}
          keyExtractor={(item, index) => index.toString()}
          renderItem={renderArticleItem}
        />
        </View>

</View>
</TouchableWithoutFeedback>
    )
  }
  
  const styles = StyleSheet.create({});
  