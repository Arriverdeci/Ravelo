import React from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";

const NSignUp = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Image
        source={require("../assets/logo_ravelo.png")}
        style={styles.logo}
        resizeMode="contain"
      />

      <Text style={styles.successText}>SIGNED UP SUCCESSFULLY!</Text>

      <TouchableOpacity
        style={styles.signInButton}
        onPress={() => navigation.navigate("SignIn")}
      >
        <Text style={styles.signInButtonText}>SIGN IN</Text>
      </TouchableOpacity>
    </View>
  );
};

export default NSignUp;

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
  successText: {
    fontSize: 36,
    fontFamily: "PoppinsBold",
    color: "#FFFFFF",
    textAlign: "center",
    marginBottom: 30,
  },
  signInButton: {
    backgroundColor: "#FFFFFF",
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderRadius: 50,
    width: "80%",
    alignItems: "center",
  },
  signInButtonText: {
    color: "#911F1B",
    fontSize: 16,
    fontFamily: "PoppinsSemiBold",
  },
});
