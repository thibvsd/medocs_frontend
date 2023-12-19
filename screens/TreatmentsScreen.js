import React, { useState, useEffect } from "react";
import { Image, StyleSheet, Text, View, TouchableOpacity, TextInput } from "react-native";
import Autocomplete from "react-native-autocomplete-input";
import { IP_ADDRESS } from "../config.js";

export default function TreatmentsScreen({ navigation }) {
  const token = "mYZ2UayAiPjfhaQRy0FXQH-1oktu1Xi9";
  const [suggestions, setSuggestions] = useState([]);
  const [data, setData] = useState([]);
  const [query, setQuery] = useState("");
  const [doseInput, setDoseInput] = useState("");
  const [med_reason, setMed_reason] = useState("");
  const [drugAdd, setDrugAdd] = useState([]);

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
    fetchData();

    return () => fetchDataController.abort();
  }, [query]);

  // Sauvegarde les dosages et la raison médicale
  const onSave = () => {
    fetch(`http://${IP_ADDRESS}:3000/treatments/saveTreatment/${token}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        med_reason,
        doseInput,
      }),
    });
  };

  const addDrugPress = async (drug) => {
    const isSelected = data.find((selectedDrug) => selectedDrug.name === drug);
    if (isSelected._id) {
      try {
        const response = await fetch(
          `http://${IP_ADDRESS}:3000/treatments/addDrugTreatment/${token}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ _id: isSelected }),
          }
        );
        const resJson = response.json();
        if (resJson.result) {
          loadDrugs(); // Recharge les médicaments
        }
      } catch (error) {
        // Gérer les erreurs réseau
        console.error("Erreur réseau :", error);
      }
    }
  };

  useEffect(() => {
    loadDrugs();
  }, []);
  
    const loadDrugs = async () => {
      try {
        const response = await fetch(
          `http://${IP_ADDRESS}:3000/treatments/${token}`
        );
        const data = await response.json();
        // Récupère les noms des médicaments et les met à jour dans setDrugAdd
        const drugNames = data.treatment.drugs.map((drug) => {
          const match = drug.drug_id.name.match(/^([^,]+),/);
          const cleanedName = match ? match[1] : drug.drug_id.name;
          return cleanedName.trim();
        });
        console.log(drugNames);
        setDrugAdd(drugNames);
      } catch (error) {
        // Gérer les erreurs réseau
        console.error("Erreur réseau :", error);
      }
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

  const drugTreatment = drugAdd.map((drug, index) => {
    console.log("dans le jsx: " + drug);
    return (
      <View key={index} style={{ flexDirection: "row", alignItems: "center" }}>
        <Text>{drug}</Text>
        <Text>Doses:</Text>
        <TextInput
          // value={drug.dose}
          // onChangeText={(text) => handleDoseChange(text, drug.name)}
          placeholder="0"
        />
        <TouchableOpacity onPress={() => removeDrug(drug.name)}>
          {/* Icône de poubelle */}
        </TouchableOpacity>
      </View>
    );
  });

  return (
    <View style={styles.mainContainer}>
      <Text style={styles.title}>Treatments in progress</Text>
      <View>
        <Text style={styles.title}>Drugs</Text>
        <View style={styles.drugsBox}>
          <Autocomplete
            data={suggestions}
            // value={query}
            onChangeText={(text) => {
              setQuery(text);
              filterData(text);
            }}
            // Affiche les suggestions :
            flatListProps={{
              keyExtractor: (_, idx) => idx.toString(),
              renderItem: ({ item }) => (
                <TouchableOpacity onPress={() => addDrugPress(item)}>
                  <Text style={styles.suggestionItem}>{item}</Text>
                </TouchableOpacity>
              ),
            }}
            placeholder="Nom du médicament..."
            containerStyle={styles.autocompleteContainer}
          />
          <View>{drugTreatment}</View>
        </View>
      </View>
      <View>
        <Text style={styles.title}>Raison médicale</Text>
        <View></View>
      </View>
      <View>
        <Text style={styles.title}>Mes ordonnances</Text>
        <View></View>
      </View>
      <TouchableOpacity onPress={onSave}>
        <Text>Save</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    marginTop: 120,
    justifyContent: "top",
    alignItems: "center",
  },
  drugsBox: {
    height: '30%',
    width: '90%',
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
});
