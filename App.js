import React, { useCallback, useEffect } from 'react';
import * as Splash from 'expo-splash-screen';
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform } from 'react-native';
import { useFonts } from 'expo-font';
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import SplashScreen from './pages/SplashScreen';
import NSignUp from './pages/NSignUp';
import NSignIn from './pages/NSignIn';
import OnboardingScreen from './pages/OnBoarding/OnBoardingScreen';
import MenuTab from './pages/MenuTabNavigation/MenuTab';
import PickLocation from './pages/LocationMaps/PickLocation';
import Started from './pages/OnBoarding/Started';
import SignUp from './pages/OnBoarding/SignUp';
import SignIn from './pages/OnBoarding/SignIn';
import DetailProfile from './pages/Profile/DetailProfile';
import EditProfile from './pages/Profile/EditProfile';
import ForgotPassword from './pages/OnBoarding/ForgotPassword';
import OTPVerification from './pages/OnBoarding/OTPVerification';
import ResetPassword from './pages/OnBoarding/ResetPassword';
import SuccessPage from './pages/OnBoarding/SuccessPage';
import NotificationProvider from './pages/context/NotificationContext';
import NotificationScreen from './pages/Home/NotificationScreen';
import { AuthProvider } from './pages/context/AuthContext';

Splash.preventAutoHideAsync();
const Stack = createNativeStackNavigator();

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export default function App() {
  const [fontsLoaded, fontError] = useFonts({
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

  useEffect(() => {
    if (fontError) {
      console.error('Font loading error:', fontError);
    }
  }, [fontError]);

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded || fontError) {
      await Splash.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  useEffect(() => {
    registerForPushNotificationsAsync();
  }, []);

  if (!fontsLoaded && !fontError) return null;

  return (
  <AuthProvider>
    <NotificationProvider>
        <NavigationContainer onReady={onLayoutRootView}>
          <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Splash" component={SplashScreen} />
            <Stack.Screen name="Onboarding" component={OnboardingScreen} />
            <Stack.Screen name="Started" component={Started} />
            <Stack.Screen name="SignUp" component={SignUp} />
            <Stack.Screen name="NSignUp" component={NSignUp} />
            <Stack.Screen name="SignIn" component={SignIn} />
            <Stack.Screen name="NSignIn" component={NSignIn} />
            <Stack.Screen name="ForgotPassword" component={ForgotPassword} />
            <Stack.Screen name="OTPVerification" component={OTPVerification} />
            <Stack.Screen name="ResetPassword" component={ResetPassword} />
            <Stack.Screen name="SuccessPage" component={SuccessPage} />
            <Stack.Screen name="MainTabs" component={MenuTab} />
            <Stack.Screen name="EditProfile" component={EditProfile} />
            <Stack.Screen name="DetailProfile" component={DetailProfile} />
            <Stack.Screen name="PickLocation" component={PickLocation} />
            <Stack.Screen name="Notification" component={NotificationScreen} />
          </Stack.Navigator>
        </NavigationContainer>
    </NotificationProvider>
  </AuthProvider>
  );
}

async function registerForPushNotificationsAsync() {
  if (Device.isDevice) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== 'granted') {
      alert('Permission not granted for notifications!');
      return;
    }

    const tokenData = await Notifications.getExpoPushTokenAsync();
    const expoPushToken = tokenData.data;
    console.log('📱 Expo Push Token:', expoPushToken);
  } else {
    alert('Harus pakai perangkat fisik untuk notifikasi.');
  }

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }
}
