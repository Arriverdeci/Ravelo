import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  SafeAreaView,
} from "react-native";

const SuccessPage = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.container}>
      <Image
        source={require("../../assets/logo_ravelo.png")}
        style={styles.logo}
        resizeMode="contain"
      />

      <Text style={styles.subtitle}>
        Discover Flavors Around You,{"\n"}One Bite at a Time
      </Text>

      <Text style={styles.successMessage}>
        PASSWORD CHANGED{"\n"}SUCCESSFULLY!
      </Text>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate("SignIn")}
      >
        <Text style={styles.buttonText}>SIGN IN</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default SuccessPage;

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
    marginBottom: 24,
  },
  subtitle: {
    fontSize: 16,
    color: "#FFFFFF",
    textAlign: "center",
    fontFamily: "PoppinsRegular",
    marginBottom: 24,
    lineHeight: 22,
  },
  successMessage: {
    fontSize: 26,
    fontFamily: "PoppinsBold",
    color: "#FFFFFF",
    textAlign: "center",
    marginBottom: 40,
    lineHeight: 44,
  },
  button: {
    backgroundColor: "#FFFFFF",
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderRadius: 50,
    width: "80%",
    alignItems: "center",
  },
  buttonText: {
    color: "#911F1B",
    fontSize: 16,
    fontFamily: "PoppinsSemiBold",
  },
});
