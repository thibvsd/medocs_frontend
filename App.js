import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import React, { useEffect, useState } from "react";

import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View, Button, Image, TouchableOpacity } from "react-native";

import FontAwesome from "react-native-vector-icons/FontAwesome";

import HomeScreen from "./screens/HomeScreen";
import LoginScreen from "./screens/LoginScreen";
import ProfileScreen from "./screens/ProfileScreen";
import SearchScreen from "./screens/SearchScreen";
import FavoritesScreen from "./screens/FavoritesScreen";
import TreatmentsScreen from "./screens/TreatmentsScreen";
import SettingsScreen from "./screens/SettingsScreen";
import FAQScreen from "./screens/FAQScreen.js";
import { Step1Screen, Step2Screen, Step3Screen, Step4Screen, Step5Screen } from './screens/WelcomeScreen';

import { persistStore, persistReducer } from 'redux-persist';
import { PersistGate } from 'redux-persist/integration/react';

import AsyncStorage from "@react-native-async-storage/async-storage";

// redux imports
import { Provider, useSelector } from 'react-redux';
import { combineReducers, configureStore } from '@reduxjs/toolkit';
import user from './reducers/user';

const reducers = combineReducers({ user });
const persistConfig = {
  key: 'medidoc',
  storage: AsyncStorage,
};

const store = configureStore({
  reducer: persistReducer(persistConfig, reducers),
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({ serializableCheck: false }),
});

const persistor = persistStore(store);

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
    
    const isToken = useSelector((state) => state.user.value.token);
    console.log('isToken ==> ', isToken);

    const [token, setToken] = useState(null);
    useEffect(() => {
      async function checkToken() {
        try {
          const userToken = await AsyncStorage.getItem("token");
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
          component={isToken ? ProfileScreen : LoginScreen}
        />
      </Tab.Navigator>
    );
  };

  const ProfileScreenStack = () => {
    return (
      <Stack.Navigator>
        <Stack.Screen name="ProfileScreen" component={ProfileScreen} />
        <Stack.Screen name="Favoris" component={FavoritesScreen} />
        <Stack.Screen name="Traitements" component={TreatmentsScreen} />
        <Stack.Screen name="Parametres" component={SettingsScreen} />
        <Stack.Screen name="FAQ" component={FAQScreen} />
        <Stack.Screen name="Se déconnecter" component={HomeScreen} />
      </Stack.Navigator>
    );
  };

  const StepNavigator = () => {
    return (
        <Stack.Navigator initialRouteName="Step1" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="TabNavigator" component={TabNavigator} />
          <Stack.Screen name="Step1" component={Step1Screen} />
          <Stack.Screen name="Step2" component={Step2Screen} />
          <Stack.Screen name="Step3" component={Step3Screen} />
          <Stack.Screen name="Step4" component={Step4Screen} />
          <Stack.Screen name="Step5" component={Step5Screen} />
          <Stack.Screen name="Login" component={LoginScreen} />
        </Stack.Navigator>
    );
  };

  return (
    <Provider store={store}>
      <PersistGate persistor={persistor}>  
        <NavigationContainer>
            {isFirstLaunch ? (
              <StepNavigator/>
            ) : (
              
          <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="TabNavigator" component={TabNavigator} />
            <Stack.Screen name="Login" component={LoginScreen} />
          </Stack.Navigator>
            )}
        </NavigationContainer>
      </PersistGate>
    </Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
