import React, { useState, useEffect } from "react";
import { Image, StyleSheet, Text, View, TouchableOpacity } from "react-native";
import Autocomplete from "react-native-autocomplete-input";
import { IP_ADDRESS } from "../config.js";

export default function TreatmentsScreen({ navigation }) {
  const token = "kTe-BIKeY40kJaYz6JMm9sEcJFtpxVpD";
  const [suggestions, setSuggestions] = useState([]);
  const [selectedDrugs, setSelectedDrugs] = useState([]);
  const [data, setData] = useState([]);
  const [doseInput, setDoseInput] = useState("");
  const [med_reason, setMed_reason] = useState("");

  useEffect(() => {
    // Fetch les noms des médicaments (pour l'autocomplétion)
    const fetchData = async () => {
      try {
        const response = await fetch(
          `http://${IP_ADDRESS}:3000/drugs/allNames`
        );
        const result = await response.json();
        setData(result.namesAndId);
        console.log(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();

  }, []);

  // Sauvegarde les dosages et la raison médicale
  const onSave = () => {

    fetch(`http://${IP_ADDRESS}:3000/treatments/saveTreatment/${token}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        med_reason,
        doseInput
      }),
    })
  };

  const addDrugPress = async (drug) => {
    const isSelected = data.find((selectedDrug) => selectedDrug === drug);
    if (!isSelected) {
      try {
        const response = await fetch(`http://${IP_ADDRESS}:3000/addDrugTreatment/${token}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({_id: drug._id}),
        });
  
        if (response.ok) {
          const updatedDrug = await response.json();
          setSelectedDrugs([...selectedDrugs, updatedDrug.drugTreatment]);
        } else {
          // Gérer les erreurs ou les cas non réussis
          console.error("Erreur lors de l'ajout du médicament");
        }
      } catch (error) {
        // Gérer les erreurs réseau
        console.error("Erreur réseau :", error);
      }
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
          <View>
            {selectedDrugs.map((drug, index) => (
              <View
                key={index}
                style={{ flexDirection: "row", alignItems: "center" }}
              >
                <Text>{drug.name}</Text>
                <Text>Doses:</Text>
                <TextInput
                  value={drug.dose}
                  onChangeText={(text) => handleDoseChange(text, drug.name)}
                  placeholder="Dose..."
                />
                <TouchableOpacity onPress={() => removeDrug(drug.name)}>
                  {/* Icône de poubelle */}
                </TouchableOpacity>
              </View>
            ))}
          </View>
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

  }
});
