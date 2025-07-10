import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TextInput,
  TouchableOpacity,
  Dimensions,
  CheckBox,
} from "react-native";

const { width, height } = Dimensions.get("window");

const Login = ({ navigation }) => {
  const [rememberMe, setRememberMe] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  return (
    <View style={styles.container}>
      <Image
        source={require('../../assets/OnBoarding/logo_atas_ravelo.png')}
        style={styles.logo}
        resizeMode="contain"
      />

      <View style={styles.content}>
        <Text style={styles.versionText}>2.1.1</Text>
        <Text style={styles.title}>Rovello</Text>
        <Text style={styles.subtitle}>We're so capable we can avoid.</Text>

        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Username</Text>
          <TextInput
            style={styles.input}
            placeholder="Username"
            placeholderTextColor="#999"
            value={username}
            onChangeText={setUsername}
          />

          <Text style={styles.inputLabel}>Password</Text>
          <TextInput
            style={styles.input}
            placeholder="Password"
            placeholderTextColor="#999"
            secureTextEntry={true}
            value={password}
            onChangeText={setPassword}
          />

          <Text style={styles.inputLabel}>Confirm Password</Text>
          <TextInput
            style={styles.input}
            placeholder="Confirm Password"
            placeholderTextColor="#999"
            secureTextEntry={true}
            value={confirmPassword}
            onChangeText={setConfirmPassword}
          />
        </View>

        <View style={styles.optionsContainer}>
          <View style={styles.checkboxContainer}>
            <CheckBox
              value={rememberMe}
              onValueChange={setRememberMe}
              style={styles.checkbox}
            />
            <Text style={styles.optionText}>Remember Me</Text>
          </View>

          <TouchableOpacity>
            <Text style={styles.optionText}>Forget Password</Text>
          </TouchableOpacity>
        </View>

        {/* <TouchableOpacity style={styles.loginButton}>
          <Text style={styles.loginButtonText}>ERR IN</Text>
        </TouchableOpacity> */}
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
  versionText: {
    fontSize: 12,
    color: "#999",
    textAlign: "center",
    fontFamily: "PoppinsRegular",
    marginBottom: 8,
  },
  title: {
    fontSize: 24,
    color: "#E6020B",
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
  },
  inputContainer: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    color: "#391713",
    fontFamily: "PoppinsMedium",
    marginBottom: 8,
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
  optionsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  checkbox: {
    alignSelf: "center",
  },
  optionText: {
    fontSize: 14,
    color: "#391713",
    fontFamily: "PoppinsRegular",
    marginLeft: 8,
  },
  loginButton: {
    backgroundColor: "#E6020B",
    borderRadius: 100,
    paddingVertical: 16,
    alignItems: "center",
  },
  loginButtonText: {
    color: "#fff",
    fontFamily: "PoppinsBold",
    fontSize: 16,
    textTransform: "uppercase",
  },
});

export default Login;