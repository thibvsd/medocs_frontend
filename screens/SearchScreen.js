import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet } from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Autocomplete from 'react-native-autocomplete-input';

const IP_ADDRESS = '172.20.10.2'

// ECRAN DE RECHERCHE

export default function SearchScreen({ navigation }) {
  const { navigate } = navigation;

  const [query, setQuery] = useState('');
  const [data, setData] = useState([]);
  const [suggestions, setSuggestions] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`http://${IP_ADDRESS}:3000/drugs/allNames`);
        const result = await response.json();
        setData(result.names);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, []);

  const handleSearch = () => {
    // Ajouter la logique de recherche ici
    console.log('Recherche lancée pour :', query);
  };

  const handleOpenFilters = () => {
    // Ajouter la logique pour ouvrir la page de filtres ici
    console.log('Ouvrir la page de filtres');
  };

  const filterData = () => {
    // Filtrer les suggestions en fonction de la valeur de l'input
    const filteredData = data.filter(item => item.toLowerCase().includes(query.toLowerCase()));
    setSuggestions(filteredData);
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity onPress={() => onSuggestionPress(item)}>
      <Text style={styles.suggestionItem}>{item}</Text>
    </TouchableOpacity>
  );

  // Si je clique sur une suggestion, fonction handleSearch lancée
  const onSuggestionPress = suggestion => {
    setQuery(suggestion);
    handleSearch();
  };

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <Autocomplete
          data={suggestions}
          value={query}
          onChangeText={text => {
            setQuery(text);
            filterData();
          }}
          renderItem={renderItem}
          placeholder="Rechercher..."
          containerStyle={styles.autocompleteContainer}
        />
        <TouchableOpacity onPress={handleSearch} style={styles.searchButton}>
          <FontAwesome name="search" size={30} color="white" />
        </TouchableOpacity>
        <TouchableOpacity onPress={handleOpenFilters} style={styles.filtersButton}>
          <FontAwesome name="filter" size={30} color="white" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 120,
    justifyContent: 'top',
    alignItems: 'center',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 20,
    paddingHorizontal: 16,
    alignItems: 'flex-end', // Ajout de cette ligne
  },
  autocompleteContainer: {
    flex: 1,
    left: 0,
    right: 0,
    top: 0,
    zIndex: 1,
    marginBottom: 10,
  },
  searchInput: {
    flex: 1,
    height: 50,
    borderColor: 'gray',
    borderWidth: 1,
    paddingLeft: 10,
    color: '#333',
  },
  searchButton: {
    height: 50,
    width: 50,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#3498db',
    padding: 10,
    borderRadius: 5,
  },
  filtersButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 50,
    width: 50,
    marginLeft: 20,
    backgroundColor: '#2ecc71',
    padding: 10,
    borderRadius: 5,
  },
  suggestionItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  buttonText: {
    color: '#fff',
  },
});
