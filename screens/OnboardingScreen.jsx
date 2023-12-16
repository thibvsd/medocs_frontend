import React from 'react';
import { View, Text,  Image, StyleSheet, TouchableOpacity } from 'react-native';
import Onboarding from 'react-native-onboarding-swiper';
import { useNavigation } from '@react-navigation/native';
import { Button, Icon } from 'react-native-elements';

import { Border, FontFamily, FontSize, Color } from "../assets/GlobalStyles";

const OnboardingScreen = () => {
  const navigation = useNavigation();
  const onSkip = () => {
    // Navigate to the "Profile" screen when the "Skip" button is clicked
    navigation.navigate('TabNavigator','Home'); //go to login with no tabnavigator
  };
  const Done = ({...props}) => (
    <TouchableOpacity
    {...props}
    >
    <Text style={{fontSize:16, marginHorizontal:20}}>Done</Text>
    <Button
            title={'Done eff to home'}
            containerViewStyle={{ marginTop: 20 }}
            backgroundColor={'white'}
            borderRadius={5}
            textStyle={{ color: '#003c8f' }}
            onPress={onHome}
          />
    </TouchableOpacity>
  )

  const Dots = ({selected}) => {
    let backgroundColor;
    backgroundColor = selected ? 'green' : 'black'
    return (
    <View
    style={{
        width:24,
        height:6,
        marginHorizontal:3,
        backgroundColor
    }}
    />
    )
  }
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
    <View>
      {/* Your Onboarding content here */}
      <Onboarding
      DotComponent={Dots}
      pages={[
        {
          backgroundColor: '#ffffff',
          title: (
            <View style={styles.logo}>
              <Image
                style={styles.vectorIcon}
                contentFit="cover"
                source={require("../assets/logo.png")}
              />
              <Text style={styles.medidoc}>Medidoc</Text>
            </View>
          ),
          subtitle: (
          <>
            <View style={styles.contentFlexBox}>
              <Text style={styles.headline}>{`Prêt ? `}</Text>
              <TouchableOpacity onPress={onHome}>
                <Text style={styles.connectezVousPour}>
                  Connectez vous pour profiter dès à présent des fonctionnalités de l’application
                </Text>
              </TouchableOpacity>
            </View>
            <View style={styles.frameFlexBox}>
              <View style={styles.buttonLayout}>
                <View style={[styles.loginButtonChild, styles.buttonChildPosition]} />
                <Text style={styles.connexion}>
                  <Button
                    backgroundColor={'none'}
                    textStyle={{ color: '#ffffff' }}
                    title={'Connexion'}
                    containerViewStyle={{ marginTop: 20 }}
                    borderRadius={5}
                    onPress={onLogin}
                  />
                  </Text>
              </View>
              <View style={[styles.signupButton, styles.buttonLayout]}>
                <View
                  style={[styles.signupButtonChild, styles.buttonChildPosition]}
                />
                <Text style={[styles.inscription, styles.inscriptionTypo]}>
                  <Button
                  title={'Inscription'}
                  containerViewStyle={{ marginTop: 20 }}
                  borderRadius={5}
                  onPress={onLogin}
                  backgroundColor={'none'}
                  textStyle={{ color: '#ffffff' }}
                  />
                </Text>
              </View>
            </View>
            <View style={[styles.frame, styles.frameFlexBox]}>
              <Text style={styles.ou}>ou</Text>
              <View style={styles.buttonLayout}>                
                <Text style={[styles.continuerEnTant, styles.inscriptionTypo]}>
                  Continuer en tant qu’invité
                </Text>
              </View>
            </View>
          </>
          ),
          },
        {
          title: 'Send Messages',
          subtitle: (
            <>
            <Button
              title={'Login'}
              containerViewStyle={{ marginTop: 20 }}
              backgroundColor={'white'}
              borderRadius={5}
              textStyle={{ color: '#003c8f' }}
              onPress={onLogin}
            /><Button
            title={'Guest'}
            containerViewStyle={{ marginTop: 20 }}
            backgroundColor={'white'}
            borderRadius={5}
            textStyle={{ color: '#003c8f' }}
            onPress={onHome}
          /></>
          ),
          backgroundColor: '#ffffff',
          image: (
            <Icon
              name="paper-plane-o"
              type="font-awesome"
              size={100}
              color="white"
            />
          ),
        },
        {
          title: 'Get Notified',
          backgroundColor: '#ffffff',
          subtitle: 'We will send you notification as soon as something happened',
          image: (
            <Icon name="bell-o" type="font-awesome" size={100} color="white" />
          ),
        },
        {
          title: "That's Enough",
          backgroundColor: '#ffffff',
          subtitle: (
            <>
            <Button
              title={'Login'}
              containerViewStyle={{ marginTop: 20 }}
              backgroundColor={'white'}
              borderRadius={5}
              textStyle={{ color: '#003c8f' }}
              onPress={onLogin}
            /><Button
            title={'Guest'}
            containerViewStyle={{ marginTop: 20 }}
            backgroundColor={'white'}
            borderRadius={5}
            textStyle={{ color: '#003c8f' }}
            onPress={onHome}
          /></>
          ),
          image: (
            <Icon name="rocket" type="font-awesome" size={100} color="white" />
          ),
        },
        {
          backgroundColor: '#ffffff',
          title: (
            <View style={styles.logo}>
              <Image
                style={styles.vectorIcon}
                contentFit="cover"
                source={require("../assets/logo.png")}
              />
              <Text style={styles.medidoc}>Medidoc</Text>
            </View>
          ),
          subtitle: (
          <>
            <View style={styles.contentFlexBox}>
              <Text style={styles.headline}>{`Prêt ? `}</Text>
              <Text style={styles.connectezVousPour}>
                Connectez vous pour profiter dès à présent des fonctionnalités de
                l’application
              </Text>
            </View>
            <View style={styles.frameFlexBox}>
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
            <View style={[styles.frame, styles.frameFlexBox]}>
              <Text style={styles.ou}>ou</Text>
              <View style={styles.buttonLayout}>
                <Text style={[styles.continuerEnTant, styles.inscriptionTypo]}>
                  Continuer en tant qu’invité
                </Text>
              </View>
            </View>
          </>
          ),
        }        
      ]}
        onSkip={onSkip}
        onDone={onDone}
        // Add other Onboarding props as needed
      />
    </View>
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