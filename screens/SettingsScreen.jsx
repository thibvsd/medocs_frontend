import { useState, useEffect } from "react";
import {
  StyleSheet,
  Keyboard,
  TouchableWithoutFeedback,
  Text,
  View,
  TouchableOpacity,
  TextInput,
} from "react-native";
import { useSelector } from "react-redux";
import { IP_ADDRESS } from "../config.js";

export default function ProfileSettingScreen() {
  const [dataUsernameSetting, setDataUsernameSetting] = useState("");
  const [dataUserEmailSetting, setDataUserEmailSetting] = useState("");
  const [dataUserAgeSetting, setDataUserAgeSetting] = useState("");
  const [dataUserWeightSetting, setDataUserWeightSetting] = useState("");
  
  const [usernameSetting, setUsernameSetting] = useState("");
  const [userEmailSetting, setUserEmailSetting] = useState("");
  const [userAgeSetting, setUserAgeSetting] = useState("");
  const [userWeightSetting, setUserWeightSetting] = useState("");
  const [validation, setValidation] = useState("");

  const user = useSelector((state) => state.user.value);
  useEffect(() => {
    // Récupère les données utilisateurs par son token depuis la route
    fetch(`http://${IP_ADDRESS}:3000/users/details/${user.token}`)
      .then((response) => response.json())
      .then((data) => {
        setDataUsernameSetting(data.data.username);
        setDataUserEmailSetting(data.data.email);
        setDataUserAgeSetting(data.data.age);
        setDataUserWeightSetting(data.data.weight);
      });
  }, []);

  // Envoie les données modifié ou non dans la route
  const saveSettings = () => {
    fetch(`http://${IP_ADDRESS}:3000/users/settings/${user.token}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: usernameSetting,
        email: userEmailSetting,
        age: userAgeSetting,
        weight: userWeightSetting,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        setValidation(data.message);
      })
      .catch((error) => {
        // Gérez les erreurs en cas d'échec de la requête
        console.error("Error:", error);
      });
  };
  console.log(validation);

  return (
    <TouchableWithoutFeedback
      onPress={() => {
        Keyboard.dismiss();
      }}
    >
      <View>
        <Text style={styles.title}></Text>
        <Text style={styles.inputTitle}>Nom d'utilisateur</Text>
        <TextInput
          style={styles.input}
          placeholder={dataUsernameSetting}
          onChangeText={(text) => setUsernameSetting(text)}
        >
          {dataUsernameSetting}
        </TextInput>
        <Text style={styles.inputTitle}>Email</Text>
        <TextInput
          style={styles.input}
          placeholder="Email"
          keyboardType="email-address"
          onChangeText={(text) => setUserEmailSetting(text)}
        >
          {dataUserEmailSetting}
        </TextInput>
        <Text style={styles.inputTitle}>Âge</Text>
        <TextInput
          style={styles.input}
          placeholder="Âge"
          keyboardType="numeric"
          onChangeText={(text) => setUserAgeSetting(text)}
        >
          {dataUserAgeSetting}
        </TextInput>
        <Text style={styles.inputTitle}>Poids</Text>
        <TextInput
          style={styles.input}
          placeholder="Poids"
          keyboardType="numeric"
          onChangeText={(text) => setUserWeightSetting(text)}
        >
          {dataUserWeightSetting}
        </TextInput>
        <TouchableOpacity style={styles.saveButton} onPress={saveSettings}>
          <Text style={styles.saveButtonText}>Enregistrer</Text>
        </TouchableOpacity>
        <Text style={styles.validationText}>{validation}</Text>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    marginBottom: 40,
  },
  inputTitle: {
    marginLeft: 25,
    fontSize:16,
    fontWeight: "bold",

  },
  label: {
    marginLeft: 20,
    fontSize: 18,
    marginBottom: 5,
  },
  input: {
    marginVertical: 10,
    marginHorizontal:20,
    height: 40,
    borderColor: "#CBCECD",
    borderWidth: 1,
    marginBottom: 30,
    paddingHorizontal: 10,
    borderRadius:10,
  },
  saveButton: {
    backgroundColor: "#3FB4B1",
    width: "50%",
    height: 50,
    margin: 40,
    padding: 10,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    alignSelf: 'center',
  },
  saveButtonText: {
    color: "white",
    fontWeight: "bold",
  },
  validationText: {
    color:"green",
    textAlign: "center",

  }
});
