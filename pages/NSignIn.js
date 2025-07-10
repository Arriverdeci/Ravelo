import React, { useEffect } from "react";
import { View, Text, StyleSheet, Image } from "react-native";

const NSignIn = ({ navigation }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.replace("MainTabs");
    }, 2000);

    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <View style={styles.container}>
      <Image
        source={require("../assets/logo_ravelo.png")}
        style={styles.logo}
        resizeMode="contain"
      />
      <Text style={styles.welcomeText}>WELCOME BACK!</Text>
      <Text style={styles.tagline}>
        Discover Record Around You,{"\n"}One Side and Time
      </Text>
    </View>
  );
};

export default NSignIn;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#911F1B",
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  logo: {
    width: 300,
    height: 300,
    marginBottom: 40,
  },
  welcomeText: {
    fontSize: 36,
    color: "#FFFFFF",
    textAlign: "center",
    fontFamily: "PoppinsBold",
    marginBottom: 20,
  },
  tagline: {
    fontSize: 14,
    color: "#FFFFFF",
    textAlign: "center",
    fontFamily: "PoppinsMedium",
    lineHeight: 20,
  },
});
