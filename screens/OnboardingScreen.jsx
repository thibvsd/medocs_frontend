import React from 'react';
import Onboarding from 'react-native-onboarding-swiper';
import { useNavigation } from '@react-navigation/native';
import {
  View,
  Text,
  Button,
  Image,
  StyleSheet,
  TouchableOpacity,
} from "react-native";

import { Border, FontFamily, FontSize, Color } from "../assets/GlobalStyles";

const Dots = ({ selected }) => {
  let backgroundColor;

  backgroundColor = selected ? "rgba(0, 0, 0, 0.8)" : "rgba(0, 0, 0, 0.3)";

  return (
    <View
      style={{
        width: 6,
        height: 6,
        marginHorizontal: 3,
        backgroundColor,
      }}
    />
  );
};

const Next = ({ ...props }) => (
  <Button title="Next" color="#000000" {...props} />
);

const Done = ({ ...props }) => (
  <TouchableOpacity style={{ marginHorizontal: 8 }} {...props}>
    <Text style={{ fontSize: 16 }}>Done</Text>
  </TouchableOpacity>
);


const OnboardingScreen = () => {


const navigation = useNavigation();

const onDone = () => {
  navigation.replace('TabNavigator','Home'); 
};
const onLogin = () => {
  navigation.navigate('Guest');
  //navigation.navigate('TabNavigator','Profile');
}
const onHome = () => {
  navigation.replace('TabNavigator','Home'); 
};



  return (
    <Onboarding     
      DoneButtonComponent={Done}
      DotComponent={Dots}
      onSkip={() => navigation.navigate("NuevaOrden")}       
      onDone={() => navigation.navigate("NuevaOrden")}
      pages={[
        {
          backgroundColor: "#a6e4d0",
          image: <Image source={require("../assets/logo.png")} />,
          title: <>
          <View style={styles.contentFlexBox}>
          <Text style={styles.headline}>{`Prêt ? `}</Text>
            <TouchableOpacity onPress={onHome}>
              <Text style={styles.connectezVousPour}>
                Connectez vous pour profiter dès à présent des fonctionnalités de l’application
              </Text>
            </TouchableOpacity>
          </View></>,
          subtitle: <>
          <View style={styles.frameFlexBox}>
            <View style={styles.buttonLayout}>
              <View style={[styles.loginButtonChild, styles.buttonChildPosition]} />
              <TouchableOpacity onPress={onLogin}>
                <Text style={styles.connexion}>
                Connexion
                </Text>
              </TouchableOpacity>
            </View>
            <View style={[styles.signupButton, styles.buttonLayout]}>
              <View
                style={[styles.signupButtonChild, styles.buttonChildPosition]}
              />
              <TouchableOpacity onPress={onLogin}>
              <Text style={[styles.inscription, styles.inscriptionTypo]}>
                Inscription
              </Text>
              </TouchableOpacity>
            </View>
          </View>
          <View style={[styles.frame, styles.frameFlexBox]}>
            <Text style={styles.ou}>ou</Text>
            <View style={styles.buttonLayout}> 
              <TouchableOpacity onPress={onHome}>             
                <Text style={[styles.continuerEnTant, styles.inscriptionTypo]}>
                  Continuer en tant qu’invité
                </Text>
              </TouchableOpacity>  
            </View>
          </View>
        </>
        },
        {
          backgroundColor: "#fdeb93",
          image: <Image source={require("../assets/logo.png")} />,
          title: "Ecran 2",
          subtitle: "...",
        },
        {
          backgroundColor: "#e9bcbe",
          image: <Image source={require("../assets/logo.png")} />,
          title: "Ecran 3",
          subtitle: "...",
        },
      ]}
    />
  );
};

const styles = StyleSheet.create({
  contentFlexBox: {
    justifyContent: "center",
    alignItems: "center",
  },
  buttonChildPosition: {
    borderRadius: 13,
    bottom: "0%",
    right: "0%",
    height: "100%",
    left: "0%",
    top: "0%",
    position: "absolute",
    width: "100%",
  },
  buttonLayout: {
    height: 56,
    width: 263,
  },
  inscriptionTypo: {
    fontWeight: "500",
    lineHeight: 24,
    textAlign: "center",
    position: "absolute",
  },
  frameFlexBox: {
    marginTop: 43,
    justifyContent: "center",
    alignItems: "center",
  },
  vectorIcon: {
    height: "60.67%",
    width: "56.91%",
    right: "21.37%",
    bottom: "39.33%",
    left: "21.71%",
    maxWidth: "100%",
    maxHeight: "100%",
    top: "0%",
    position: "absolute",
    overflow: "hidden",
  },
  medidoc: {
    top: "71.34%",
    fontSize: 39,
    textAlign: "left",
    color: Color.colorDarkcyan,
    fontWeight: "700",
    left: "0%",
    position: "absolute",
  },
  logo: {
    width: 175,
    height: 164,
  },
  headline: {
    fontSize: 22,
    lineHeight: 30,
    color: "#101623",
    display: "flex",
    marginTop: 53,
    width: 311,
    textAlign: "center",
    fontWeight: "700",
    justifyContent: "center",
    alignItems: "center",
  },
  connectezVousPour: {
    color: "#707784",
    letterSpacing: 1,
    lineHeight: 24,
    marginTop: 53,
    width: 311,
    textAlign: "center",
  },
  loginButtonChild: {
    backgroundColor: Color.colorDarkcyan,
  },
  connexion: {
    left: "33.76%",
    fontWeight: "600",
    color: Color.colorWhite,
    top: "28.57%",
    lineHeight: 24,
    textAlign: "center",
    position: "absolute",
  },
  signupButtonChild: {
    borderStyle: "solid",
    borderColor: Color.colorDarkcyan,
    borderWidth: 1,
  },
  inscription: {
    left: "34.52%",
    top: "28.57%",
    color: Color.colorDarkcyan,
  },
  signupButton: {
    marginTop: 16,
  },
  ou: {
    color: "#717784",
    height: 23,
    width: 263,
    lineHeight: 24,
    letterSpacing: 1,
    textAlign: "center",
  },
  continuerEnTant: {
    top: "50%",
    left: "11.33%",
    color: "#707477",
  },
  frame: {
    overflow: "hidden",
  },
  onboarding3: {
    backgroundColor: Color.colorWhite,
    flex: 1,
    height: 812,
    paddingHorizontal: 32,
    paddingVertical: 70,
    overflow: "hidden",
    width: "100%",
    alignItems: "center",
  },
});

export default OnboardingScreen;