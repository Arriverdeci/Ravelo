import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  Dimensions,
  Modal,
  Animated,
} from "react-native";
import axios from "axios";

const { width, height } = Dimensions.get("window");

const ResetPassword = ({ route, navigation }) => {
  const { username } = route.params;
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [modalVisible, setModalVisible] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [modalMessage, setModalMessage] = useState("");
  const [modalAnim] = useState(new Animated.Value(0));

  const showModal = (title, message, callback) => {
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
        }, 2000);
      }
    });
  };

  const hideModal = () => {
    Animated.timing(modalAnim, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start(() => {
      setModalVisible(false);
    });
  };

  const handleResetPassword = async () => {
    if (!newPassword || !confirmPassword) {
      showModal("Error", "All fields are required");
      return;
    }

    if (newPassword !== confirmPassword) {
      showModal("Error", "Passwords do not match");
      return;
    }

    try {
      await axios.post("http://10.94.66.133:8080/api/otp/reset", {
        username,
        newPassword,
      });

      navigation.navigate("SuccessPage");
    } catch (error) {
      showModal(
        "Error",
        error?.response?.data?.message || "Failed to reset password"
      );
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
        <Text style={styles.title}>Reset Your Password</Text>
        <Text style={styles.subtitle}>
          Set a new password for your account so you can login and continue
          your journey.
        </Text>
      </View>

      <View style={styles.content}>
        <Text style={styles.sectionTitle}>Enter New Password</Text>

        <TextInput
          style={styles.input}
          placeholder="New Password"
          placeholderTextColor="#999"
          secureTextEntry
          value={newPassword}
          onChangeText={setNewPassword}
        />
        <TextInput
          style={styles.input}
          placeholder="Confirm New Password"
          placeholderTextColor="#999"
          secureTextEntry
          value={confirmPassword}
          onChangeText={setConfirmPassword}
        />

        <TouchableOpacity style={styles.button} onPress={handleResetPassword}>
          <Text style={styles.buttonText}>Update Password</Text>
        </TouchableOpacity>
      </View>

      {/* Custom Modal */}
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
    marginBottom: 8,
  },
  logo: {
    width: width * 0.7,
    height: height * 0.2,
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
    fontSize: 16,
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
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    width: "80%",
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 24,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
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

export default ResetPassword;
