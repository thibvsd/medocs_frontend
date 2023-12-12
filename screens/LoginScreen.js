import {
  Image,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
} from "react-native";

export default function LoginScreen({ navigation }) {
  const [isSignIn, setIsSignIn] = useState(true);

  const toggleForm = () => {
    setIsSignIn(!isSignIn);
  };

  const handleRegister = () => {
    fetch("http://localhost:3000/users/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: signUpUsername,
        email: signUpEmail,
        password: signUpPassword,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.result) {
          dispatch(login({ username: signUpUsername, token: data.token }));
          setSignUpUsername("");
          setSignUpPassword("");
          setIsModalVisible(false);
        }
      });
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
          setIsModalVisible(false);
        }
      });
  };

  const SignIn = (
    <View>
      <Text>Sign In Form</Text>
      <TextInput type="text" placeholder="User name"></TextInput>
      <TextInput type="email" placeholder="User email"></TextInput>
      <TextInput type="password" placeholder="Password"></TextInput>
      <TextInput type="password" placeholder="Confirm password"></TextInput>
      <TouchableOpacity onPress={toggleForm}>
        <Text>Pas de compte ? Inscrit toi !</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={toggleForm}>
        <Text>Connection</Text>
      </TouchableOpacity>
    </View>
  );

  const SignUp = (
    <View>
      <Text>Sign Up Form</Text>
      <TextInput type="text" placeholder="User name or email"></TextInput>
      <TextInput type="password" placeholder="Password"></TextInput>
      <TouchableOpacity onPress={toggleForm}>
        <Text>Déja un compte ? Et ba connecte toi !</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={toggleForm}>
        <Text>Inscription</Text>
      </TouchableOpacity>
    </View>
  );

  return <View>{isSignIn ? SignIn : SignUp}</View>;
}

const styles = StyleSheet.create({});
