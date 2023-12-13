import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import React, { useEffect, useState } from "react";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import HomeScreen from "./screens/HomeScreen";
import Welcome1Screen from "./screens/Welcome1Screen";
import Welcome2Screen from "./screens/Welcome2Screen";
import Welcome3Screen from "./screens/Welcome3Screen";
import Welcome4Screen from "./screens/Welcome4Screen";
import Welcome5Screen from "./screens/Welcome5Screen";
import LoginScreen from "./screens/LoginScreen";
import ProfileScreen from "./screens/ProfileScreen";
import SearchScreen from "./screens/SearchScreen";
import FavoritesScreen from "./screens/FavoritesScreen";
import TreatmentsScreen from "./screens/TreatmentsScreen";
import SettingsScreen from "./screens/SettingsScreen";
import FAQScreen from "./screens/FAQScreen.js";

import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import user from './reducers/user';
const store = configureStore({
  reducer: { user },
});


const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

export default function App() {
  const [isFirstLaunch, setIsFirstLaunch] = useState(null);

  useEffect(() => {
    async function checkIfFirstLaunch() {
      try {
        const hasLaunched = await AsyncStorage.getItem("appLaunched");
        if (hasLaunched === null) {
          setIsFirstLaunch(true);
          await AsyncStorage.setItem("appLaunched", "true");
        } else {
          setIsFirstLaunch(false);
        }
      } catch (error) {
        console.error("Error checking app launch status:", error);
      }
    }
    checkIfFirstLaunch();
  }, []);

  if (isFirstLaunch === null) {
    return null;
  }

  const TabNavigator = () => {
    const [token, setToken] = useState(null);

    useEffect(() => {
      async function checkToken() {
        try {
          const userToken = await AsyncStorage.getItem("userToken");
          if (userToken) {
            setToken(userToken);
          }
        } catch (error) {
          console.error("Erreur lors de la vérification du token:", error);
        }
      }
      checkToken();
    }, []);

    return (
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ color, size }) => {
            let iconName = "";

            if (route.name === "Home") {
              iconName = "home";
            } else if (route.name === "Search") {
              iconName = "search";
            } else if (route.name === "Profile") {
              iconName = "user";
            }

            return <FontAwesome name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: "#ec6e5b",
          tabBarInactiveTintColor: "#335561",
          headerShown: false,
        })}
      >
        <Tab.Screen name="Home" component={HomeScreen} />
        <Tab.Screen name="Search" component={SearchScreen} />
        <Tab.Screen
          name="Profile"
          component={token ? ProfileScreen : LoginScreen}
        />
      </Tab.Navigator>
    );
  };

  const ProfileScreenStack = () => {
    return (
      <Stack.Navigator>
        <Stack.Screen name="Profile" component={ProfileScreen} />
        <Stack.Screen name="Favoris" component={FavoritesScreen} />
        <Stack.Screen name="Traitements" component={TreatmentsScreen} />
        <Stack.Screen name="Parametres" component={SettingsScreen} />
        <Stack.Screen name="FAQ" component={FAQScreen} />
        <Stack.Screen name="Se déconnecter" component={HomeScreen} />
      </Stack.Navigator>
    );
  };

  return (
    <Provider store={store}>
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {isFirstLaunch ? (
          <>
            <Stack.Screen name="Welcome1" component={Welcome1Screen} />
            <Stack.Screen name="Welcome2" component={Welcome2Screen} />
            <Stack.Screen name="Welcome3" component={Welcome3Screen} />
            <Stack.Screen name="Welcome4" component={Welcome4Screen} />
            <Stack.Screen name="Welcome5" component={Welcome5Screen} />
          </>
        ) : (
          <>
            <Stack.Screen name="TabNavigator" component={TabNavigator} />
            <Stack.Screen name="Login" component={LoginScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
    </Provider>
  );
}
