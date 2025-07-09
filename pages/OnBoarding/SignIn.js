import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TextInput,
  TouchableOpacity,
  Dimensions,
} from "react-native";

const { width } = Dimensions.get("window");

const SignIn = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Image
        source={require('../../assets/OnBoarding/logo_atas_ravelo.png')}
        style={styles.logo}
        resizeMode="contain"
      />

      <View style={styles.content}>
        <Text style={styles.title}>Join Ravelo and start your taste adventure!</Text>
        <Text style={styles.subtitle}>
          Get early access to top culinary spots, AR Maps, and a vibrant food community.
        </Text>

        <View style={styles.divider} />

        <Text style={styles.sectionTitle}>Create New Account</Text>

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="First Name"
            placeholderTextColor="#999"
          />
          <TextInput
            style={styles.input}
            placeholder="Last Name"
            placeholderTextColor="#999"
          />
          <TextInput
            style={styles.input}
            placeholder="Username"
            placeholderTextColor="#999"
          />
          <TextInput
            style={styles.input}
            placeholder="Mobile Number"
            placeholderTextColor="#999"
            keyboardType="phone-pad"
          />
          <TextInput
            style={styles.input}
            placeholder="Password"
            placeholderTextColor="#999"
            secureTextEntry={true}
          />
          <TextInput
            style={styles.input}
            placeholder="Confirm Password"
            placeholderTextColor="#999"
            secureTextEntry={true}
          />
        </View>

        <TouchableOpacity 
          style={styles.loginTextContainer}
          onPress={() => navigation.navigate("Login")}
        >
          <Text style={styles.loginText}>Already have an account? Login</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.signUpButton}>
          <Text style={styles.signUpButtonText}>SIGN UP</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#911F1B",
    paddingHorizontal: 20,
  },
  logo: {
    width: width * 0.6,
    height: 50,
    marginTop: 48,
    alignSelf: "center",
  },
  content: {
    backgroundColor: "#fff",
    borderRadius: 24,
    padding: 24,
    marginTop: 30,
    marginBottom: 30,
  },
  title: {
    fontSize: 20,
    color: "#391713",
    textAlign: "center",
    fontFamily: "PoppinsBold",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: "#391713",
    textAlign: "center",
    fontFamily: "PoppinsRegular",
    marginBottom: 24,
    lineHeight: 20,
  },
  divider: {
    height: 1,
    backgroundColor: "#E6E6E6",
    marginVertical: 16,
  },
  sectionTitle: {
    fontSize: 18,
    color: "#E6020B",
    fontFamily: "PoppinsBold",
    marginBottom: 24,
    textAlign: "center",
  },
  inputContainer: {
    marginBottom: 16,
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: "#E6E6E6",
    borderRadius: 8,
    paddingHorizontal: 16,
    marginBottom: 16,
    fontFamily: "PoppinsRegular",
    fontSize: 14,
    color: "#391713",
  },
  loginTextContainer: {
    alignSelf: "center",
    marginBottom: 24,
  },
  loginText: {
    color: "#E6020B",
    fontFamily: "PoppinsMedium",
    fontSize: 14,
  },
  signUpButton: {
    backgroundColor: "#E6020B",
    borderRadius: 100,
    paddingVertical: 16,
    alignItems: "center",
  },
  signUpButtonText: {
    color: "#fff",
    fontFamily: "PoppinsBold",
    fontSize: 16,
  },
});

export default SignIn;