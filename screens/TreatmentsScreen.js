import React, { useState, useEffect } from "react";
import {
  Image,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TouchableWithoutFeedback,
  ScrollView,
  TextInput,
} from "react-native";
import Autocomplete from "react-native-autocomplete-input";
import { IP_ADDRESS } from "../config.js";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import { removePhoto } from "../reducers/user";
import { useSelector, useDispatch } from "react-redux";

export default function TreatmentsScreen({ navigation }) {
  const dispatch = useDispatch();
  const token = useSelector((state) => state.user.value.token);
  const [suggestions, setSuggestions] = useState([]);
  const [data, setData] = useState([]);
  const [query, setQuery] = useState("");
  const [doseInput, setDoseInput] = useState("");
  const [med_reason, setMed_reason] = useState("");
  const [drugAdd, setDrugAdd] = useState([]);
  const [validation, setValidation] = useState("");

  const userPhotos = useSelector((state) => state.user.value.photos);

  // console.log("USER photo ", userPhotos);

  console.log('query state', query);

  useEffect(() => {
    // AbortController pour arrêter la requête si query est modifié
    const fetchDataController = new AbortController();
    const queryToFilter = query;
    // Fonction pour fetch les noms des médicaments (pour l'autocomplétion)
    const fetchData = async () => {
      try {
        const response = await fetch(
          `http://${IP_ADDRESS}:3000/drugs/query3characters/${queryToFilter}`,
          { signal: fetchDataController.signal }
        );
        const result = await response.json();
        setData(result.namesAndId);
        return result.namesAndId;
      } catch (error) {
        if (error.name === "AbortError") {
          console.log("La requête fetchData a été annulée.");
        } else {
          console.error(error);
        }
      }
    };
    fetchData().then((responseData) => {
      if(!responseData) return;
      const filteredData = responseData
        .filter((item) =>
          item.name.toLowerCase().includes(queryToFilter.toLowerCase())
        )
        .slice(0, 10); // Limite à 10 suggestions
      setSuggestions(filteredData.map((item) => item.name)); // map pour n'avoir que les names sans clé
    });

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
    setValidation("Données enregistrées avec succès !");
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
        const result = await response.json();
        if (result.result) {
          loadDrugs(); // Recharge les médicaments
        }
      } catch (error) {
        // Gérer les erreurs réseau
        console.error("Erreur réseau :", error);
      }
    }
    setSuggestions([]);
    setQuery("");
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
      const nameAndId = data.treatment.drugs.map((drug) => {
        const match = drug.drug_id.name.match(/^([^,]+),/);
        const cleanedName = match ? match[1].trim() : drug.drug_id.name;
        const drugId = drug.drug_id._id;

        // Créer un objet avec les propriétés name et id
        return { name: cleanedName, _id: drugId };
      });
      setDrugAdd(nameAndId);
    } catch (error) {
      // Gérer les erreurs réseau
      console.error("Erreur réseau :", error);
    }
    setQuery("");
    setSuggestions([]);
  };

  const onDeleteDrugPress = async (drug) => {
    console.log("ondelete drug", drug);
    try {
      const response = await fetch(
        `http://${IP_ADDRESS}:3000/treatments/deleteDrugTreatment/${token}`,
        {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ _id: drug }),
        }
      );
      const result = await response.json();
      if (result.result) {
        setDrugAdd(drugAdd.filter((d) => d._id !== drug));
        // loadDrugs(); // Recharge les médicaments
      }
    } catch (error) {
      // Gérer les erreurs réseau
      console.error("Erreur réseau :", error);
    }
  };

  const onAddPrescriptionPress = async () => {
    navigation.navigate("Camera");
  };

  const drugTreatment = drugAdd.map((drug, index) => (
    <View key={index} style={styles.drugContainer}>
      <TouchableOpacity onPress={() => onDeleteDrugPress(drug._id)}>
        <FontAwesome
          name="trash"
          size={20}
          color="#3FB4B1"
          style={styles.deleteButton}
        />
      </TouchableOpacity>
      <Text style={styles.drugList}>{drug.name}</Text>
      <View style={styles.doseContainer}>
        <Text style={styles.doseText}>Dose :</Text>
        <TextInput style={styles.doseInput} placeholder="0" />
      </View>
    </View>
  ));

  const photos = userPhotos ? (
    userPhotos.map((data, i) => (
      <View key={i} style={styles.photoContainer}>
        <TouchableOpacity onPress={() => dispatch(removePhoto(data))}>
          <FontAwesome
            name="times"
            size={20}
            color="#000000"
            style={styles.deleteIcon}
          />
        </TouchableOpacity>
        <Image source={{ uri: data }} style={styles.photo} />
      </View>
    ))
  ) : (
    <View />
  );

  return (
    <TouchableWithoutFeedback>
      <ScrollView>
        <View style={styles.mainContainer}>
          <Text style={styles.subtitle}>Ajouter un médicament</Text>
          <View style={styles.searchContainer}>
            <Autocomplete
              data={suggestions}
              onChangeText={(text) => {
                if (text.length > 2) {
                  setQuery(text);
                }
                if(!text.length) setSuggestions([]);
              }}
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
          </View>

          <View style={styles.drugContainer}>{drugTreatment}</View>
          <View style={styles.reasonContainer}>
            <Text style={styles.subtitle}>Raison médicale</Text>
            <TextInput
              style={styles.reasonInput}
              value={med_reason}
              onChangeText={(text) => setMed_reason(text)}
              placeholder="Saisissez la raison médicale..."
            />
            <View></View>
          </View>
          <View>
            <Text style={styles.subtitle}>Mes ordonnances</Text>
            <View style={styles.ordonnanceContainer}>
            <View style={styles.ordonnanceText}>
              <Text>Ajouter une ordonnance </Text>
              <TouchableOpacity onPress={onAddPrescriptionPress}>
                <FontAwesome
                  name="camera"
                  size={30}
                  color="#3FB4B1"
                  style={styles.filterButtonCamera}
                />
              </TouchableOpacity></View>
              <View style={styles.ordonnancePhotoContainer}>{photos}</View>
              
            </View>
          </View>
          <Text style={styles.validationText}>{validation}</Text>
          <TouchableOpacity onPress={onSave} style={styles.saveButton}>
            <Text style={styles.saveButtonText}>Save</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    textAlign: "center",
    margin: 10,
    fontWeight: "bold",
  },
  mainContainer: {
    marginTop: 30,
    justifyContent: "flex-start",
    alignItems: "center",
  },
  drugContainer: {
    width: "80%",
    marginBottom: 10,
  },
  medoc: {
    marginTop: 10,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  filterButtonCamera: {
    marginLeft: 10,
    marginRight: 10,
  },
  drugList: {
    marginVertical: 5,
    fontSize: 16,
  },
  doseText: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 10,
    fontSize: 16,
  },
  doseInput: {
    height: 30,
    width: 200,
    borderColor: "gray",
    borderWidth: 1,
    marginVertical: 10,
    paddingLeft: 10,
    backgroundColor: "white",
  },
  reasonContainer: {
    width: "90%",
    marginBottom: 10,
  },
  autocompleteContainer: {
    flex: 1,
    left: 0,
    right: 0,
    top: 0,
    zIndex: 1,
    marginBottom: 10,
  },
  suggestionItem: {
    backgroundColor: "#fff", // Utilisez une couleur solide
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    opacity: 1,
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
  reasonInput: {
    height: 80,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 10,
    paddingLeft: 10,
    backgroundColor: "white",
    textAlignVertical: "top",
  },
  ordonnanceContainer: {
alignItems: "center", },

  saveButton: {
    marginTop: 20,
    width: 100,
    height: 50,
    backgroundColor: "#3FB4B1",
    borderRadius: 30,
    paddingVertical: 10,
    paddingHorizontal: 18,
    alignSelf: "center",
    justifyContent: "center",
  },
  saveButtonText: {
    fontSize: 16,
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
    justifyContent: "center",
  },
  ordonnanceText: {
    flexDirection: "row",
    margin :10,
    alignItems: "center",
  },
  ordonnancePhotoContainer: {
    flexWrap: 'wrap',
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom:10,
  },
  photo: {
    margin: 10,
    width: 150,
    height: 150,
  },
  validationText: {
    color:"green",
    textAlign: "center",

  }
});