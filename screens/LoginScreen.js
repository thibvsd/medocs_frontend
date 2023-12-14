import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Alert,
  StyleSheet,
} from "react-native";
import { useDispatch } from 'react-redux';
import {login} from '../reducers/user';

const IP_ADDRESS = '172.20.10.2'

// ECRAN DE SIGNUP / SIGNIN

export default function LoginScreen({ navigation }) {
  const dispatch = useDispatch();
  const [isSignIn, setIsSignIn] = useState(true);
  const [signUpUsername, setSignUpUsername] = useState("");
  const [signUpUserEmail, setSignUpUserEmail] = useState("");
  const [signUpUserAge, setSignUpUserAge] = useState("");
  const [signUpUserWeight, setSignUpUserWeight] = useState("");
  const [signUpPassword, setSignUpPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState(""); // Ajout du nouvel état
  const [signInUsername, setSignInUsername] = useState("");
  const [signInPassword, setSignInPassword] = useState("");

  const toggleForm = () => {
    setIsSignIn(!isSignIn);
  };

  const handleRegister = () => {
    if (signUpPassword !== confirmPassword) {
      Alert.alert("Attention", "Les mots de passe ne correspondent pas.");
      return;
    }
console.log(signUpUsername);
fetch(`http://${IP_ADDRESS}:3000/users/signup`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    username: signUpUsername,
    email: signUpUserEmail,
    age: signUpUserAge,
    weight: signUpUserWeight,
    password: signUpPassword,
  }),
})
  .then((response) => {
    console.log(response);
    if (!response.ok) {
      console.log('ici')
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    return response.json();
  })
  .then((data) => {
    // Traitement normal des données
    if (data.result) {
      dispatch(login({ username: signUpUsername, token: data.token }));
      console.log(data);
      setSignUpUsername("");
      setSignUpPassword("");
      setSignUpUserEmail("");
      setSignUpUserAge("");
      setSignUpUserWeight("");
      setConfirmPassword("");
      navigation.navigate('Profile');
    }
  })
  .catch((error) => {
    // Gestion des erreurs
    console.error("Fetch error:", error);
    Alert.alert("Erreur", "Une erreur s'est produite lors de la communication avec le serveur.");
  });}

  const handleConnection = () => {
    fetch(`http://${IP_ADDRESS}:3000/users/signin`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: signInUsername,
        password: signInPassword,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.result) {
          dispatch(login({ username: signInUsername, token: data.token }));
          setSignInUsername("");
          setSignInPassword("");
          navigation.navigate('ProfileScreenStack');
        }
      });
  };

  const SignUp = (
    <View style={styles.container}>
      <Text style={styles.title}>Inscription</Text>
      <TextInput
        style={styles.input}
        placeholder="Nom d'utilisateur"
        value={signUpUsername}
        onChangeText={(text) => setSignUpUsername(text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Email"
        keyboardType="email-address"
        value={signUpUserEmail}
        onChangeText={(text) => setSignUpUserEmail(text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Âge"
        keyboardType="numeric"
        value={signUpUserAge}
        onChangeText={(text) => setSignUpUserAge(text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Poids"
        keyboardType="numeric"
        value={signUpUserWeight}
        onChangeText={(text) => setSignUpUserWeight(text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Mot de passe"
        secureTextEntry
        value={signUpPassword}
        onChangeText={(text) => setSignUpPassword(text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Confirmez le mot de passe"
        secureTextEntry
        value={confirmPassword} // Utilisation de confirmPassword au lieu de signUpPassword
        onChangeText={(text) => setConfirmPassword(text)}
      />
      <TouchableOpacity style={styles.link} onPress={toggleForm}>
        <Text>Vous avez déjà un compte ? Connectez-vous ici !</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={handleRegister}>
        <Text style={styles.buttonText}>S'inscrire</Text>
      </TouchableOpacity>
    </View>
  );

  const SignIn = (
    <View style={styles.container}>
      <Text style={styles.title}>Connexion</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={signInUsername}
        onChangeText={(text) => setSignInUsername(text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Mot de passe"
        secureTextEntry
        value={signInPassword}
        onChangeText={(text) => setSignInPassword(text)}
      />
      <TouchableOpacity style={styles.link} onPress={toggleForm}>
        <Text>Vous n'avez pas de compte ? Inscrivez-vous ici !</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={handleConnection}>
        <Text style={styles.buttonText}>Se connecter</Text>
      </TouchableOpacity>
    </View>
  );

  return <View style={styles.container}>{isSignIn ? SignIn : SignUp}</View>;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
  input: {
    width: "100%",
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  button: {
    backgroundColor: "#ec6e5b",
    padding: 10,
    borderRadius: 5,
    width: "100%",
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontSize: 16,
  },
  link: {
    marginBottom: 20,
  },
});
