import React from 'react';
import Onboarding from 'react-native-onboarding-swiper';
import { useNavigation } from '@react-navigation/native';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
} from "react-native";

import {Color } from "../assets/GlobalStyles";

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
        borderRadius: 10,
      }}
    />
  );
};

const Next = ({ ...props }) => (
  <TouchableOpacity style={{ marginHorizontal: 15 }} {...props}>
    <Text style={{ fontSize: 16 }}>Suivant</Text>
  </TouchableOpacity>
);

const Done = ({ ...props }) => (
  <TouchableOpacity style={{ marginHorizontal: 15 }} {...props}>
    <Text style={{ fontSize: 16 }}>Continuer</Text>
  </TouchableOpacity>
);

const Skip = ({ ...props }) => (
  <TouchableOpacity style={{ marginHorizontal: 15 }} {...props}>
    <Text style={{ fontSize: 16 }}>Passer</Text>
  </TouchableOpacity>
);


const OnboardingScreen = () => {


const navigation = useNavigation();


  return (
    <Onboarding     
      DoneButtonComponent={Done}
      NextButtonComponent={Next}
      SkipButtonComponent={Skip}
      DotComponent={Dots}
      bottomBarHighlight = {true}
      controlStatusBar={false}     
      onDone={() => navigation.navigate("Lgn")}
      onSkip={() => navigation.navigate("Lgn")}
      pages={[
        {
          backgroundColor: "#9dd0f2",
          image: <Image style= {styles.picto} source={require("../assets/biotech.png")} />,
          title: " Avoir accès aux dernières actualités sur les médicaments",
          subtitle: "",
        }, 
        {
          backgroundColor: "#e9bcbe",
          image: <Image style= {styles.picto} source={require("../assets/policy.png")} />,
          title: "Se renseigner sur un traitement en particulier",
          subtitle: "",
        },
        {
          backgroundColor: "#acb5e5",
          image: <Image style= {styles.picto} source={require("../assets/insights.png")} />,
          title: "Suivre ses traitements en cours",
          subtitle: "",
        },
        
      ]}
    />
  );
};

const styles = StyleSheet.create({
 pictospecial : {
   position: "absolute",
   bottom: 10,
   width: 150,
   height: 150,
   top: -200
   
 },
 
  picto : {
    top: -50,
    width: 250,
    height: 250,
  },
  buttonChildPosition: {
    borderRadius: 25,
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
    // lineHeight: 24,
    textAlign: "center",
    // position: "absolute",
    color: "#A1A8B0",
  },
  
  headline: {
    fontSize: 38,
    fontFamily: "Montserrat-Bold",
    letterSpacing: 0,
    color: "#199A8E",
    display: "flex",
    // marginTop: 53,
    width: 311,
    textAlign: "center",
    top: -110,
    
    justifyContent: "center",
    alignItems: "center",
  },
  connectezVousPour: {
    color: "#707784",
    letterSpacing: 1,
    lineHeight: 24,
    top: -70,
    width: 311,
    textAlign: "center",
  },
  loginButtonChild: {
    backgroundColor: Color.colorDarkcyan,
  },
  connexion: {
    fontWeight: "600",
    color: Color.colorWhite,
    top: "90%",
   
    textAlign: "center",
    
    
    
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
    top: "40%",
    
  },
  continuerEnTant: {
    top: "330%",
    color: "#A1A8B0",
    position: "relative",
    
  },

  frameFlexBox: {
    flexDirection: "column",
  }
 
});

export default OnboardingScreen;