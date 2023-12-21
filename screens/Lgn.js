import * as React from "react";
import { StyleSheet, View, Text, Image } from "react-native";
import { Border, FontFamily, FontSize, Color } from "../assets/GlobalStyles";

const Lgn = () => {
  return (
    <View style={styles.onboardingFinal}>
      <View style={[styles.buttons, styles.frame1Position]}>
        <View style={styles.buttonLayout}>
          <View style={[styles.loginButtonChild, styles.buttonChildPosition]} />
          <Text style={styles.connexion}>Connexion</Text>
        </View>
        <View style={[styles.signupButton, styles.buttonLayout]}>
          <View
            style={[styles.signupButtonChild, styles.buttonChildPosition]}
          />
          <Text style={[styles.inscription, styles.inscriptionTypo]}>
            Inscription
          </Text>
        </View>
      </View>
      <View style={[styles.content, styles.contentFlexBox]}>
        <View style={styles.frame}>
          <View style={styles.logo}>
            <Image
              style={styles.vectorIcon}
              contentFit="cover"
              source={require("../assets/vector2.png")}
            />
            <Text style={styles.medidoc}>Medidoc</Text>
          </View>
          <Text
            style={[styles.headline, styles.contentFlexBox]}
          >{`Prêt ? `}</Text>
        </View>
        <Text style={[styles.connectezVousPour, styles.ouTypo]}>
          Connectez vous pour profiter dès à présent des fonctionnalités de
          l’application
        </Text>
      </View>
      <View style={[styles.frame1, styles.frame1Position]}>
        <Text style={[styles.ou, styles.ouTypo]}>ou</Text>
        <View style={[styles.signupButton1, styles.buttonLayout]}>
          <Text style={[styles.continuerEnTant, styles.inscriptionTypo]}>
            Continuer en tant qu’invité
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  frame1Position: {
    left: "50%",
    top: "50%",
    position: "absolute",
  },
  buttonChildPosition: {
    borderRadius: Border.br_13xl,
    left: "0%",
    bottom: "0%",
    right: "0%",
    top: "0%",
    height: "100%",
    position: "absolute",
    width: "100%",
  },
  buttonLayout: {
    height: 56,
    width: 263,
  },
  inscriptionTypo: {
    fontFamily: FontFamily.interMedium,
    fontWeight: "500",
    textAlign: "center",
    lineHeight: 24,
    fontSize: FontSize.size_base,
  },
  contentFlexBox: {
    justifyContent: "center",
    alignItems: "center",
  },
  ouTypo: {
    fontFamily: FontFamily.interRegular,
    letterSpacing: 1,
    textAlign: "center",
    lineHeight: 24,
    fontSize: FontSize.size_base,
  },
  loginButtonChild: {
    backgroundColor: Color.colorDarkcyan,
  },
  connexion: {
    left: "33.76%",
    fontWeight: "600",
    fontFamily: FontFamily.interSemiBold,
    color: Color.colorWhite,
    textAlign: "center",
    lineHeight: 24,
    fontSize: FontSize.size_base,
    top: "28.57%",
    position: "absolute",
  },
  signupButtonChild: {
    borderColor: Color.colorDarkcyan,
    borderWidth: 1,
    borderStyle: "solid",
    borderRadius: Border.br_13xl,
    left: "0%",
    bottom: "0%",
    right: "0%",
    top: "0%",
    height: "100%",
  },
  inscription: {
    left: "34.52%",
    color: Color.colorDarkcyan,
    top: "28.57%",
    fontFamily: FontFamily.interMedium,
    fontWeight: "500",
    position: "absolute",
  },
  signupButton: {
    marginTop: 16,
  },
  buttons: {
    marginTop: 125,
    marginLeft: -131.5,
    height: 128,
    alignItems: "center",
    width: 263,
  },
  vectorIcon: {
    width: 100,
    height: 100,
  },
  medidoc: {
    fontSize: 39,
    fontFamily: FontFamily.montserratBold,
    textAlign: "left",
    marginTop: 17,
    fontWeight: "700",
    color: Color.colorDarkcyan,
  },
  logo: {
    width: 175,
    height: 164,
    alignItems: "center",
  },
  headline: {
    fontSize: FontSize.size_3xl,
    lineHeight: 30,
    fontFamily: FontFamily.interBold,
    color: Color.colorGray_100,
    display: "flex",
    marginTop: 49,
    fontWeight: "700",
    width: 311,
    textAlign: "center",
  },
  frame: {
    height: 244,
    width: 311,
    alignItems: "center",
    overflow: "hidden",
  },
  connectezVousPour: {
    color: "#707784",
    marginTop: 57,
    width: 311,
  },
  content: {
    marginTop: -336.5,
    marginLeft: -155.5,
    left: "50%",
    top: "50%",
    position: "absolute",
  },
  ou: {
    color: "#717784",
    height: 23,
    width: 263,
  },
  continuerEnTant: {
    color: "#707477",
  },
  signupButton1: {
    paddingHorizontal: 0,
    paddingVertical: 4,
    marginTop: -5,
    justifyContent: "flex-end",
    alignItems: "center",
  },
  frame1: {
    marginTop: 281,
    marginLeft: -132.5,
    width: 264,
    height: 74,
    paddingRight: 1,
    justifyContent: "flex-end",
    overflow: "hidden",
  },
  onboardingFinal: {
    backgroundColor: Color.colorWhite,
    borderColor: Color.colorBlack,
    borderWidth: 2,
    flex: 1,
    height: 812,
    overflow: "hidden",
    width: "100%",
    borderStyle: "solid",
  },
});

export default Lgn;
