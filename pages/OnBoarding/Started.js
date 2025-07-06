import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Dimensions,
} from "react-native";

const { width, height } = Dimensions.get("window");

const Started = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Image
        source={require('../../assets/OnBoarding/logo_atas_ravelo.png')}
        style={styles.logo}
        resizeMode="contain"
      />

      <View style={styles.content}>
        <Text style={styles.title}>Stevens Flavors Around You</Text>
        <Text style={styles.subtitle}>One Star at a Star</Text>

        <View style={styles.buttonContainer}>
          <TouchableOpacity 
            style={styles.getStartedButton}
            onPress={() => navigation.navigate("SignIn")}
          >
            <Text style={styles.getStartedText}>GET STARTED</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.haveAccountButton}
            onPress={() => navigation.navigate("Login")}
          >
            <Text style={styles.haveAccountText}>I'M READY HAVE AN ACCOUNT</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#911F1B",
    paddingHorizontal: 20,
    justifyContent: "center",
  },
  logo: {
    width: width * 0.6,
    height: 50,
    alignSelf: "center",
    position: "absolute",
    top: 48,
  },
  content: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: height * 0.1,
  },
  title: {
    fontSize: 24,
    color: "#FFFFFF",
    textAlign: "center",
    fontFamily: "PoppinsBold",
    marginBottom: 8,
    lineHeight: 32,
  },
  subtitle: {
    fontSize: 16,
    color: "#F3E9B5",
    textAlign: "center",
    fontFamily: "PoppinsMedium",
    marginBottom: 40,
  },
  buttonContainer: {
    width: "100%",
    marginTop: 40,
  },
  getStartedButton: {
    backgroundColor: "#FFFFFF",
    borderRadius: 100,
    paddingVertical: 16,
    alignItems: "center",
    marginBottom: 16,
  },
  getStartedText: {
    color: "#E6020B",
    fontFamily: "PoppinsBold",
    fontSize: 16,
  },
  haveAccountButton: {
    borderWidth: 1,
    borderColor: "#FFFFFF",
    borderRadius: 100,
    paddingVertical: 16,
    alignItems: "center",
  },
  haveAccountText: {
    color: "#FFFFFF",
    fontFamily: "PoppinsMedium",
    fontSize: 14,
  },
});

export default Started;