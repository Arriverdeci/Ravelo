import React, { useState, useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TextInput,
  TouchableOpacity,
  Dimensions,
  ScrollView,
  Modal,
  Animated,
} from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_BASE_URL } from "../../api";
import { AuthContext } from "../context/AuthContext";

const { width, height } = Dimensions.get("window");

const SignIn = ({ navigation }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const { setUsername: setContextUsername } = useContext(AuthContext);

  const [modalVisible, setModalVisible] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [modalMessage, setModalMessage] = useState("");
  const [modalAnim] = useState(new Animated.Value(0));

  const showModal = (title, message, callback = null) => {
    setModalTitle(title);
    setModalMessage(message);
    setModalVisible(true);
    Animated.spring(modalAnim, {
      toValue: 1,
      useNativeDriver: true,
    }).start(() => {
      if (callback) {
        setTimeout(() => {
          callback();
          hideModal();
        }, 1500);
      }
    });
  };

  const hideModal = () => {
    Animated.timing(modalAnim, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start(() => setModalVisible(false));
  };

  const handleLogin = async () => {
    if (!username || !password || !confirmPassword) {
      showModal("Error", "All fields are required.");
      return;
    }

    if (password !== confirmPassword) {
      showModal("Error", "Password and Confirm Password do not match.");
      return;
    }

    try {
      const response = await axios.post(`${API_BASE_URL}/api/users/login`, {
        username,
        password,
        confirmPassword,
      });

      await AsyncStorage.setItem("username", username);
      setContextUsername(username);

      showModal("Success", "Login berhasil!", () => {
        navigation.replace("NSignIn");
      });
    } catch (error) {
      const msg = error?.response?.data || "Login failed. Please try again.";
      showModal("Error", msg);
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
        <Text style={styles.title}>We’re so excited to see you again!</Text>
      </View>

      <View style={styles.content}>
        <Text style={styles.sectionTitle}>Login to Your Account</Text>

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Username"
            placeholderTextColor="#999"
            value={username}
            onChangeText={setUsername}
          />
          <TextInput
            style={styles.input}
            placeholder="Password"
            placeholderTextColor="#999"
            secureTextEntry={true}
            value={password}
            onChangeText={setPassword}
          />
          <TextInput
            style={styles.input}
            placeholder="Confirm Password"
            placeholderTextColor="#999"
            secureTextEntry={true}
            value={confirmPassword}
            onChangeText={setConfirmPassword}
          />
        </View>

        <TouchableOpacity
          style={styles.forgotPasswordContainer}
          onPress={() => navigation.navigate("ForgotPassword")}
        >
          <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.signInButton} onPress={handleLogin}>
          <Text style={styles.signInButtonText}>SIGN IN</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.loginTextContainer}
          onPress={() => navigation.navigate("SignUp")}
        >
          <Text style={styles.loginText}>Don't have an account? Sign Up</Text>
        </TouchableOpacity>
      </View>

      {/* Modal */}
      <Modal visible={modalVisible} transparent animationType="none">
        <View style={styles.modalOverlay}>
          <Animated.View
            style={[
              styles.modalContainer,
              {
                transform: [
                  { scale: modalAnim },
                  {
                    translateY: modalAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [50, 0],
                    }),
                  },
                ],
                opacity: modalAnim,
              },
            ]}
          >
            <Text style={styles.modalTitle}>{modalTitle}</Text>
            <Text style={styles.modalMessage}>{modalMessage}</Text>
            {!modalTitle.includes("Success") && (
              <TouchableOpacity style={styles.modalButton} onPress={hideModal}>
                <Text style={styles.modalButtonText}>OK</Text>
              </TouchableOpacity>
            )}
          </Animated.View>
        </View>
      </Modal>
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
    marginBottom: 2,
  },
  logo: {
    width: width * 0.7,
    height: height * 0.2,
    resizeMode: "contain",
  },
  title: {
    fontSize: 15,
    color: "#FFFFFF",
    textAlign: "center",
    fontFamily: "PoppinsRegular",
    marginTop: 6,
    marginBottom: 12,
    paddingHorizontal: 10,
    lineHeight: 22,
    alignSelf: "center",
    maxWidth: "80%",
  },
  content: {
    backgroundColor: "#fff",
    borderRadius: 24,
    padding: 24,
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 18,
    color: "#911F1B",
    fontFamily: "PoppinsBold",
    marginBottom: 24,
    textAlign: "center",
  },
  inputContainer: {
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
  forgotPasswordContainer: {
    alignItems: "flex-end",
    marginBottom: 24,
  },
  forgotPasswordText: {
    fontSize: 14,
    color: "#911F1B",
    textDecorationLine: "underline",
    fontFamily: "PoppinsMedium",
  },
  signInButton: {
    backgroundColor: "#911F1B",
    borderRadius: 100,
    paddingVertical: 16,
    alignItems: "center",
  },
  signInButtonText: {
    color: "#fff",
    fontFamily: "PoppinsBold",
    fontSize: 16,
  },
  loginTextContainer: {
    alignSelf: "center",
    marginTop: 24,
  },
  loginText: {
    color: "#911F1B",
    fontFamily: "PoppinsMedium",
    fontSize: 14,
  },
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 24,
    width: "80%",
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 18,
    fontFamily: "PoppinsBold",
    marginBottom: 12,
    color: "#000",
  },
  modalMessage: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginBottom: 20,
    fontFamily: "PoppinsRegular",
  },
  modalButton: {
    backgroundColor: "#911F1B",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  modalButtonText: {
    color: "#fff",
    fontFamily: "PoppinsBold",
    fontSize: 16,
  },
});

export default SignIn;
