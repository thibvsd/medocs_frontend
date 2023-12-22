import React, { useState, useEffect } from "react";
import { Animated, Image, StyleSheet, Text } from "react-native";
import { useNavigation } from "@react-navigation/native";

const SplashScreenOB = () => {
  const [fadeAnim] = useState(new Animated.Value(1));
  const navigation = useNavigation();

  useEffect(() => {
    const chargeScreen = setTimeout(() => {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 1000,
        useNativeDriver: true,
      }).start(() => {
        navigation.replace("OnboardingScreen");
      });
    }, 2000);

    return () => clearTimeout(chargeScreen);
  }, []);

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      <Image style={styles.logo} source={require("../assets/Logo2.png")} />
      <Text>Chargement</Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  logo: {
    width: 200,
    height: 200,
  },
});

export default SplashScreenOB;
