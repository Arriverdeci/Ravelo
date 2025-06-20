import React, { useCallback } from 'react';
import * as Splash from 'expo-splash-screen';
import { useFonts } from 'expo-font';
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import SplashScreen from '../Ravelo/SplashScreen';
import OnboardingScreen from './OnBoarding/OnBoardingScreen';
import HomePage from "./Home/HomePage"; 
import AddRestoran from "./Home/Restoran/Add";

Splash.preventAutoHideAsync();
const Stack = createNativeStackNavigator();

export default function App() {
  const [fontsLoaded] = useFonts({
    PoppinsBold: require('./assets/fonts/Poppins/Poppins-Bold.ttf'),
    PoppinsMedium: require('./assets/fonts/Poppins/Poppins-Medium.ttf'),
    PoppinsRegular: require('./assets/fonts/Poppins/Poppins-Regular.ttf'),
    PoppinsLight: require('./assets/fonts/Poppins/Poppins-Light.ttf'),
    PoppinsSemiBold: require('./assets/fonts/Poppins/Poppins-SemiBold.ttf'),
    PoppinsExtraBold: require('./assets/fonts/Poppins/Poppins-ExtraBold.ttf'),
    PoppinsExtraLight: require('./assets/fonts/Poppins/Poppins-ExtraLight.ttf'),
    PoppinsBlack: require('./assets/fonts/Poppins/Poppins-Black.ttf'),
    PoppinsThin: require('./assets/fonts/Poppins/Poppins-Thin.ttf'),
    PoppinsItalic: require('./assets/fonts/Poppins/Poppins-Italic.ttf'),
    PoppinsBoldItalic: require('./assets/fonts/Poppins/Poppins-BoldItalic.ttf'),
    PoppinsMediumItalic: require('./assets/fonts/Poppins/Poppins-MediumItalic.ttf'),
    PoppinsLightItalic: require('./assets/fonts/Poppins/Poppins-LightItalic.ttf'),
    PoppinsSemiBoldItalic: require('./assets/fonts/Poppins/Poppins-SemiBoldItalic.ttf'),
    PoppinsExtraBoldItalic: require('./assets/fonts/Poppins/Poppins-ExtraBoldItalic.ttf'),
    PoppinsExtraLightItalic: require('./assets/fonts/Poppins/Poppins-ExtraLightItalic.ttf'),
  });

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded) {
      await Splash.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) return null;

  return (
    <NavigationContainer onReady={onLayoutRootView}>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Splash" component={SplashScreen} />
        <Stack.Screen name="Onboarding" component={OnboardingScreen} />
        <Stack.Screen name="HomePage" component={HomePage} />
        <Stack.Screen name="AddRestoran" component={AddRestoran} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
