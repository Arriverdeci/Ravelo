import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Alert,
  Image,
  ScrollView,
} from "react-native";
import axios from "axios";
import { API_BASE_URL } from "../../api";

const { width, height } = Dimensions.get("window");

const ForgotPassword = ({ navigation }) => {
  const [username, setUsername] = useState("");

  const handleRequestOtp = async () => {
    if (!username) {
      Alert.alert("Error", "Username is required");
      return;
    }

    try {
      const res = await axios.post(`${API_BASE_URL}/api/otp/generate`, { username });
      const { otp } = res.data;

      Alert.alert("OTP Sent", `Your OTP is: ${otp}`);

      navigation.navigate("OTPVerification", { username });
    } catch (error) {
      Alert.alert("Error", error?.response?.data || "Failed to send OTP");
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.topSection}>
        <Image
          source={require("../../assets/logo_ravelo.png")}
          style={styles.logo}
          resizeMode="contain"
        />
        <Text style={styles.title}>Reset your password</Text>
        <Text style={styles.subtitle}>
          Please enter your username to receive a one-time password (OTP) and reset your account.
        </Text>
      </View>

      <View style={styles.content}>
        <Text style={styles.sectionTitle}>Forgot Password</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your username"
          placeholderTextColor="#999"
          value={username}
          onChangeText={setUsername}
        />
        <TouchableOpacity style={styles.button} onPress={handleRequestOtp}>
          <Text style={styles.buttonText}>Request OTP</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#911F1B",
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  topSection: {
    alignItems: "center",
    marginTop: 50,
    marginBottom: 8,
  },
  logo: {
    width: width * 0.7,
    height: height * 0.2,
    resizeMode: "contain",
  },
  title: {
    fontSize: 16,
    color: "#FFFFFF",
    textAlign: "center",
    fontFamily: "PoppinsBold",
    marginTop: 10,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: "#FFFFFF",
    textAlign: "center",
    fontFamily: "PoppinsRegular",
    marginHorizontal: 10,
    marginBottom: 20,
    lineHeight: 20,
  },
  content: {
    backgroundColor: "#fff",
    borderRadius: 24,
    padding: 24,
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 18,
    color: "#E6020B",
    fontFamily: "PoppinsBold",
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: "#E6E6E6",
    borderRadius: 8,
    paddingHorizontal: 16,
    marginBottom: 20,
    fontFamily: "PoppinsRegular",
    fontSize: 14,
    color: "#391713",
  },
  button: {
    backgroundColor: "#E6020B",
    borderRadius: 100,
    paddingVertical: 16,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontFamily: "PoppinsBold",
    fontSize: 16,
  },
});

export default ForgotPassword;
