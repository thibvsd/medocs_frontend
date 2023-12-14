import { useState } from "react";
import { Image, StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import FontAwesome from "react-native-vector-icons/FontAwesome";

const IP_ADDRESS = "172.20.10.2";

export default function ProfileSettingScreen() {
    const [dataUsernameSetting, setDataUsernameSetting] = useState("");
    const [dataUserEmailSetting, setDataUserEmailSetting] = useState("");
    const [dataUserAgeSetting, setDataUserAgeSetting] = useState("");
    const [dataUserWeightSetting, setDataUserWeightSetting] = useState("");
    const [usernameSetting, setUsernameSetting] = useState("");
    const [userEmailSetting, setUserEmailSetting] = useState("");
    const [userAgeSetting, setUserAgeSetting] = useState("");
    const [userWeightSetting, setUserWeightSetting] = useState("");
    
    const user = useSelector((state) => state.user.value);

    // Récupère les données utilisateurs par son token depuis la route
    fetch(`http://${IP_ADDRESS}:3000/users/details/${user.token}`)
    .then((response) => response.json())
    .then((data) => {
        setDataUsernameSetting(data.username);
        setDataUserEmailSetting(data.email);
        setDataUserAgeSetting(data.age);
        setDataUserWeightSetting(data.weight); 
    });

    // Envoie les données modifié ou non dans la route
    const saveSettings = () => {
        fetch(`http://${IP_ADDRESS}:3000/users/settings/${user.token}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            username: usernameSetting,
            email: userEmailSetting,
            age: userAgeSetting,
            weight: userWeightSetting,
          }),
        })
        .then((response) => response.json())
        .catch((error) => {
          // Gérez les erreurs en cas d'échec de la requête
          console.error('Error:', error);
        });
      };

  return (
    <View>
      <Text style={styles.title}>Settings</Text>
      <TextInput
        style={styles.input}
        placeholder="Nom d'utilisateur"
        value={signUpUsername}
        onChangeText={(text) => setUsernameSetting(text)}
      >{dataUsernameSetting}</TextInput>
      <TextInput
        style={styles.input}
        placeholder="Email"
        keyboardType="email-address"
        value={signUpUserEmail}
        onChangeText={(text) => setUserEmailSetting(text)}
      >{dataUserEmailSetting}</TextInput>
      <TextInput
        style={styles.input}
        placeholder="Âge"
        keyboardType="numeric"
        value={signUpUserAge}
        onChangeText={(text) => setUserAgeSetting(text)}
      >{dataUserAgeSetting}</TextInput>
      <TextInput
        style={styles.input}
        placeholder="Poids"
        keyboardType="numeric"
        value={signUpUserWeight}
        onChangeText={(text) => setUserWeightSetting(text)}
      >{dataUserWeightSetting}</TextInput>
      <TouchableOpacity style={styles.link} onPress={saveSettings}>
        <Text>save</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({});
