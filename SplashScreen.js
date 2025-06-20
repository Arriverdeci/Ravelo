import React, { useEffect } from "react";
import { View, Text, StyleSheet, Image } from "react-native";

const SplashScreen = ({ navigation }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.replace("Onboarding");
    }, 2000); 

    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <View style={styles.container}>
      <Image
        source={require("./assets/logo_ravelo.png")} 
        style={styles.logo}
        resizeMode="contain"
      />
      <Text style={styles.tagline}>
        Discover Flavors Around You,{'\n'} One Bite at a Time
      </Text>
    </View>
  );
};

export default SplashScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#911F1B",
    justifyContent: "center",
    alignItems: "center",
  },
  logo: {
    width: 300,
    height: 300,
  },
  tagline: {
    position: "absolute",
    bottom: 40,
    fontSize: 14,
    color: "#FFFFFF",
    textAlign: "center",
    fontFamily: "PoppinsMedium",
  },
});
