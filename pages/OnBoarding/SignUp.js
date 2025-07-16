import React, { useState } from "react";
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
import { API_BASE_URL } from "../../api";

const { width, height } = Dimensions.get("window");

const SignUp = ({ navigation }) => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [username, setUsername] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

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

  const handleSignUp = async () => {
    if (!firstName || !lastName || !username || !phoneNumber || !password || !confirmPassword) {
      showModal("Error", "All fields are required!");
      return;
    }

    if (password !== confirmPassword) {
      showModal("Error", "Password and Confirm Password do not match.");
      return;
    }

    try {
      await axios.post(`${API_BASE_URL}/api/users/register`, {
        firstName,
        lastName,
        username,
        phoneNumber,
        password,
        confirmPassword,
      });


        navigation.replace("NSignUp");
    } catch (error) {
      const msg = error?.response?.data || "Registration failed.";
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
        <Text style={styles.title}>
          Join Ravelo and start your taste adventure! Get early access to top culinary spots, AR Maps, and a vibrant food community.
        </Text>
      </View>

      <View style={styles.content}>
        <Text style={styles.sectionTitle}>Create New Account</Text>

        <View style={styles.inputContainer}>
          <TextInput style={styles.input} placeholder="First Name" placeholderTextColor="#999" value={firstName} onChangeText={setFirstName} />
          <TextInput style={styles.input} placeholder="Last Name" placeholderTextColor="#999" value={lastName} onChangeText={setLastName} />
          <TextInput style={styles.input} placeholder="Username" placeholderTextColor="#999" value={username} onChangeText={setUsername} />
          <TextInput style={styles.input} placeholder="Mobile Number" placeholderTextColor="#999" keyboardType="phone-pad" value={phoneNumber} onChangeText={setPhoneNumber} />
          <TextInput style={styles.input} placeholder="Password" placeholderTextColor="#999" secureTextEntry value={password} onChangeText={setPassword} />
          <TextInput style={styles.input} placeholder="Confirm Password" placeholderTextColor="#999" secureTextEntry value={confirmPassword} onChangeText={setConfirmPassword} />
        </View>

        <TouchableOpacity style={styles.loginTextContainer} onPress={() => navigation.navigate("SignIn")}>
          <Text style={styles.loginText}>Already have an account? Sign In</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.signUpButton} onPress={handleSignUp}>
          <Text style={styles.signUpButtonText}>SIGN UP</Text>
        </TouchableOpacity>
      </View>

      {/* MODAL */}
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
    marginTop: 1,
    marginBottom: 20,
    marginHorizontal: 10,
    lineHeight: 22,
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
    color: "#911F1B",
    fontFamily: "PoppinsMedium",
    fontSize: 14,
  },
  signUpButton: {
    backgroundColor: "#911F1B",
    borderRadius: 100,
    paddingVertical: 16,
    alignItems: "center",
  },
  signUpButtonText: {
    color: "#fff",
    fontFamily: "PoppinsBold",
    fontSize: 16,
  },
  // MODAL
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

export default SignUp;