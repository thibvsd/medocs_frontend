import {
  Image,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  Alert,
} from "react-native";

export default function LoginScreen({ navigation }) {
  const [isSignIn, setIsSignIn] = useState(true);
  const [signUpUsername, setSignUpUsername] = useState("");
  const [signUpUserEmail, setSignUpUserEmail] = useState("");
  const [signUpUserAge, setSignUpUserAge] = useState("");
  const [signUpUserWeight, setSignUpUserWeight] = useState("");
  const [signUpPassword, setSignUpPassword] = useState("");
  const [signInUsername, setSignInUsername] = useState("");
  const [signInPassword, setSignInPassword] = useState("");

  const toggleForm = () => {
    setIsSignIn(!isSignIn);
  };

  const handleRegister = () => {
    const password = document.querySelector("#pwd").value;
    const confirmPassword = document.querySelector("#confpwd").value;

    if (password === confirmPassword) {
      fetch("http://localhost:3000/users/signup", {
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
        .then((response) => response.json())
        .then((data) => {
          if (data.result) {
            dispatch(login({ username: signUpUsername, token: data.token }));
            setSignUpUsername("");
            setSignUpPassword("");
            setSignUpUserEmail("");
            setSignUpUserAge("");
            setSignUpUserWeight("");
          }
        });
    } else {
      Alert.alert("Attention", "Les mots de passe ne correspondent pas.");
    }
  };

  const handleConnection = () => {
    fetch("http://localhost:3000/users/signin", {
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
        }
      });
  };

  const SignUp = (
    <View style={styles.container}>
      <Text>Sign In Form</Text>
      <TextInput
        style={styles.input}
        type="text"
        placeholder="User name"
        onChange={(e) => setSignUpUsername(e.target.value)}
      ></TextInput>
      <TextInput
        style={styles.input}
        type="email"
        placeholder="User email"
        onChange={(e) => setSignUpUserEmail(e.target.value)}
      ></TextInput>
      <TextInput
        style={styles.input}
        type="text"
        placeholder="age"
        onChange={(e) => setSignUpUserAge(e.target.value)}
      ></TextInput>
      <TextInput
        style={styles.input}
        type="text"
        placeholder="weight"
        onChange={(e) => setSignUpUserWeight(e.target.value)}
      ></TextInput>
      <TextInput
        style={styles.input}
        id="pwd"
        type="password"
        placeholder="Password"
        onChange={(e) => setSignUpPassword(e.target.value)}
      ></TextInput>
      <TextInput
        style={styles.input}
        id="confpwd"
        type="password"
        placeholder="Confirm password"
      ></TextInput>
      <TouchableOpacity onPress={toggleForm}>
        <Text>Déja un compte ? Et ba connecte toi !</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={handleRegister}>
        <Text>Inscription</Text>
      </TouchableOpacity>
    </View>
  );

  const SignIn = (
    <View style={styles.container}>
      <Text>Sign Up Form</Text>
      <TextInput
        style={styles.input}
        type="text"
        placeholder="User name or email"
        onChange={(e) => setSignUpUsername(e.target.value)}
      ></TextInput>
      <TextInput
        style={styles.input}
        type="password"
        placeholder="Password"
        onChange={(e) => setSignUpPassword(e.target.value)}
      ></TextInput>
      <TouchableOpacity onPress={toggleForm}>
        <Text>Pas de compte ? Inscrit toi !</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={handleConnection}>
        <Text>Connection</Text>
      </TouchableOpacity>
    </View>
  );

  return <View>{isSignIn ? SignIn : SignUp}</View>;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  input: {
    width: "80%",
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
  },
});
