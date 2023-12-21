import React, { useEffect, useState } from "react";
import { StyleSheet } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { useFonts } from "expo-font";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { persistStore, persistReducer } from "redux-persist";
import { PersistGate } from "redux-persist/integration/react";
import { Provider, useSelector, useDispatch } from "react-redux";
import { combineReducers, configureStore } from "@reduxjs/toolkit";
import user from "./reducers/user";
import drugs from "./reducers/drugs";

// Import your screens
import HomeScreen from "./screens/HomeScreen";
import LoginScreen from "./screens/LoginScreen";
import ProfileScreen from "./screens/ProfileScreen";
import SearchScreen from "./screens/SearchScreen";
import FavoritesScreen from "./screens/FavoritesScreen";
import TreatmentsScreen from "./screens/TreatmentsScreen";
import SettingsScreen from "./screens/SettingsScreen";
import FAQScreen from "./screens/FAQScreen.js";
import OnboardingScreen from "./screens/OnboardingScreen";
import InfoDrugScreen from "./screens/InfoDrugScreen";
import CameraScreen from "./screens/CameraScreen";
import SplashScreen from "./screens/SplashScreen.js";
import Lgn from "./screens/Lgn.js";

AsyncStorage.clear();
const reducers = combineReducers({ user, drugs });

// Configure Redux persist
const persistConfig = {
  key: "medidoc",
  storage: AsyncStorage,
};

// Create Redux store
const store = configureStore({
  reducer: persistReducer(persistConfig, reducers),
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }),
});

// Create persistor
const persistor = persistStore(store);

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

export default function App() {
  const [token, setToken] = useState(null);
  const [isFirstLaunch, setIsFirstLaunch] = useState(null);

  const [fontsLoaded] = useFonts({
    "Inter-Regular": require("./assets/fonts/Inter-Regular.ttf"),
    "Inter-Medium": require("./assets/fonts/Inter-Medium.ttf"),
    "Inter-SemiBold": require("./assets/fonts/Inter-SemiBold.ttf"),
    "Inter-Bold": require("./assets/fonts/Inter-Bold.ttf"),
    "Montserrat-Bold": require("./assets/fonts/Montserrat-Bold.ttf"),
  });

  useEffect(() => {
    async function checkTokenAndLaunchStatus() {
      try {
        const userToken = await AsyncStorage.getItem("token");
        setToken(userToken);

        const hasLaunched = await AsyncStorage.getItem("appLaunched");
        setIsFirstLaunch(hasLaunched === null);
      } catch (error) {
        console.error("Error checking token and launch status:", error);
      }
    }

    checkTokenAndLaunchStatus();
  }, []);

  if (isFirstLaunch === null || !fontsLoaded) {
    return null;
  }

  const TabNavigator = () => {
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
          tabBarActiveTintColor: "#3FB4B1",
          tabBarInactiveTintColor: "#335561",
          headerShown: false,
        })}
      >
        <Tab.Screen name="Home" component={HomeScreenStack} />
        <Tab.Screen name="Search" component={SearchScreenStack} />
        <Tab.Screen name="Profile" component={ProfileScreenStack} />
      </Tab.Navigator>
    );
  };

  const TreatmentsScreenStack = () => {
    return (
      <Stack.Navigator>
        <Stack.Screen
          name="Traitements"
          component={TreatmentsScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Camera"
          component={CameraScreen}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    );
  };

  const ProfileScreenStack = () => {
    const isToken = useSelector((state) => state.user.value.token);
    const dispatch = useDispatch();

    return (
      <Stack.Navigator>
        {!isToken ? (
          <Stack.Screen
            name="Login"
            component={LoginScreen}
            options={{ headerShown: false }}
          />
        ) : (
          <>
            <Stack.Screen
              name="ProfileScreen"
              component={ProfileScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="Favoris"
              component={FavoritesScreen}
              options={{
                title: "Mes favoris",
                headerStyle: {
                  backgroundColor: "#199a8e",
                  shadowColor: "#199a8e",
                },
                headerTitleAlign: "center",
                headerTintColor: "#fff",
                headerTitleStyle: {
                  fontWeight: "bold",
                },
              }}
            />
            <Stack.Screen
              name="Traitements"
              component={TreatmentsScreen}
              options={{
                title: "Traitements en cours",
                headerStyle: {
                  backgroundColor: "#199a8e",
                  shadowColor: "#199a8e",
                },
                headerTitleAlign: "center",
                headerTintColor: "#fff",
                headerTitleStyle: {
                  fontWeight: "bold",
                },
              }}
            />
            <Stack.Screen
              name="Parametres"
              component={SettingsScreen}
              options={{
                title: "Paramètres de mon compte",
                headerStyle: {
                  backgroundColor: "#199a8e",
                  shadowColor: "#199a8e",
                },
                headerTitleAlign: "center",
                headerTintColor: "#fff",
                headerTitleStyle: {
                  fontWeight: "bold",
                },
              }}
            />
            <Stack.Screen name="Se déconnecter" component={HomeScreen} />
          </>
        )}
      </Stack.Navigator>
    );
  };

  const SearchScreenStack = () => {
    return (
      <Stack.Navigator>
        <Stack.Screen
          name="SearchScreen"
          component={SearchScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="InfoDrugScreen"
          component={InfoDrugScreen}
          options={{
            title: "Fiche médicament",
            headerStyle: {
              backgroundColor: "#199a8e",
              shadowColor: "#199a8e",
            },
            headerTitleAlign: "center",
            headerTintColor: "#fff",
            headerTitleStyle: {
              fontWeight: "bold",
            },
          }}
        />
      </Stack.Navigator>
    );
  };

  const HomeScreenStack = () => {
    return (
      <Stack.Navigator>
        <Stack.Screen
          name="SearchScreen"
          component={HomeScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="InfoDrugScreen"
          component={InfoDrugScreen}
          options={{
            headerShown: false,
            title: "Infos médicament",
            headerStyle: {
              backgroundColor: "#199a8e",
              shadowColor: "#199a8e",
            },
            headerTitleAlign: "center",
            headerTintColor: "#fff",
            headerTitleStyle: {
              fontWeight: "bold",
            },
          }}
        />
      </Stack.Navigator>
    );
  };

  return (
    <Provider store={store}>
      <PersistGate persistor={persistor}>
        <NavigationContainer>
          {isFirstLaunch ? (
            <Stack.Navigator screenOptions={{ headerShown: false }}>
              <Stack.Screen name="SplashScreen" component={SplashScreen} />
              <Stack.Screen name="TabNavigator" component={TabNavigator} />
              <Stack.Screen
                name="OnboardingScreen"
                component={OnboardingScreen}
              />
              <Stack.Screen name="Lgn" component={Lgn} />
            </Stack.Navigator>
          ) : (
            <Stack.Navigator screenOptions={{ headerShown: false }}>
              <Stack.Screen name="TabNavigator" component={TabNavigator} />
              <Stack.Screen
                name="LoginScreen"
                component={LoginScreen}
                options={{ headerShown: false }}
              />
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
    alignItems: "center",
    justifyContent: "center",
  },
});
