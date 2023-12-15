import React from 'react';
import { View, Text, Button, Image } from 'react-native';
import Onboarding from 'react-native-onboarding-swiper';
import { useNavigation } from '@react-navigation/native';

const OnboardingScreen = () => {
  const navigation = useNavigation();

  const onSkip = () => {
    // Navigate to the "Profile" screen when the "Skip" button is clicked
    navigation.replace('TabNavigator'); //go to login with no tabnavigator
  };

  const onDone = () => navigation.navigate("TabNavigator"); // onDone={() => navigation.replace("Home")}
  return (
    <View>
      {/* Your Onboarding content here */}
      <Onboarding
        pages={[
          {
              backgroundColor: '#a6e4d0',
              image: <Image source={require('../assets/splash.png')} />,
              title: 'Welcome',
              subtitle: 'Welcome to the first slide of the Onboarding Swiper.',
          },
          {
              backgroundColor: '#fdeb93',
              image: <Image source={require('../assets/splash.png')} />,
              title: 'Explore',
              subtitle: 'This is the second slide of the Onboarding Swiper.',
          },
          {
              backgroundColor: '#e9bcbe',
              image: <Image source={require('../assets/splash.png')} />,
              title: 'All Done',
              subtitle: 'This is the Third slide of the Onboarding Swiper.',
          },
        ]}
        onSkip={onSkip}
        onDone={onDone}
        // Add other Onboarding props as needed
      />
    </View>
  );
};

export default OnboardingScreen;