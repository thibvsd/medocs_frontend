import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import React, { useEffect, useState } from "react";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import HomeScreen from './screens/HomeScreen';
import Welcome1Screen from './screens/Welcome1Screen';
import Welcome2Screen from './screens/Welcome2Screen';
import Welcome3Screen from './screens/Welcome3Screen';
import Welcome4Screen from './screens/Welcome4Screen';
import Welcome5Screen from './screens/Welcome5Screen';
import UserScreen from './screens/UserScreen';
import test from './screens/test';

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
    return (
      <Tab.Navigator screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName = '';
  
          if (route.name === 'User') {
            iconName = 'location-arrow';
          } else if (route.name === 'test') {
            iconName = 'map-pin';
          }
  
          return <FontAwesome name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#ec6e5b',
        tabBarInactiveTintColor: '#335561',
        headerShown: false,
      })}>
        <Tab.Screen name="User" component={UserScreen} />
        <Tab.Screen name="test" component={test} />
      </Tab.Navigator>
    );
  };

  return (
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
          <Stack.Screen name="Home" component={HomeScreen} />
        )}
        <Stack.Screen name="TabNavigator" component={TabNavigator} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
