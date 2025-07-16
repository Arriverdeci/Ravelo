import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions,
  ScrollView,
  Modal,
  Animated,
} from "react-native";
import axios from "axios";

const { width, height } = Dimensions.get("window");

const OTPVerification = ({ route, navigation }) => {
  const { username } = route.params;
  const [otp, setOtp] = useState("");
  const [timeLeft, setTimeLeft] = useState(60);
  const [canResend, setCanResend] = useState(false);

  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [modalTitle, setModalTitle] = useState("");
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

  useEffect(() => {
    let interval = null;
    if (timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else {
      setCanResend(true);
    }
    return () => clearInterval(interval);
  }, [timeLeft]);

  const handleVerifyOtp = async () => {
    if (!otp) {
      showModal("Error", "OTP is required");
      return;
    }

    try {
      await axios.post("http://10.94.66.133:8080/api/otp/verify", {
        username,
        otp,
      });

      showModal("Success", "OTP Verified", () =>
        navigation.navigate("ResetPassword", { username })
      );
    } catch (error) {
      showModal(
        "Error",
        error?.response?.data?.message || "Invalid or expired OTP"
      );
    }
  };

  const handleResendOtp = async () => {
    try {
      const res = await axios.post(
        "http://10.94.66.133:8080/api/otp/generate",
        { username }
      );
      const { otp } = res.data;
      showModal("OTP Resent", `Your new OTP is: ${otp}`);
      setTimeLeft(60);
      setCanResend(false);
    } catch (error) {
      showModal(
        "Error",
        error?.response?.data?.message || "Failed to resend OTP"
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
        <Text style={styles.title}>OTP Verification</Text>
        <Text style={styles.subtitle}>
          We've sent a 4-digit code to your account. Please enter it below to
          continue resetting your password.
        </Text>
      </View>

      <View style={styles.content}>
        <Text style={styles.sectionTitle}>Enter OTP</Text>
        <TextInput
          style={styles.input}
          placeholder="4-digit OTP"
          placeholderTextColor="#999"
          keyboardType="numeric"
          maxLength={4}
          value={otp}
          onChangeText={setOtp}
        />

        <View style={styles.resendContainer}>
          {canResend ? (
            <TouchableOpacity onPress={handleResendOtp}>
              <Text style={styles.resendText}>Resend Code</Text>
            </TouchableOpacity>
          ) : (
            <Text style={styles.timerText}>
              Resend code in {timeLeft} seconds
            </Text>
          )}
        </View>

        <TouchableOpacity style={styles.button} onPress={handleVerifyOtp}>
          <Text style={styles.buttonText}>Verify OTP</Text>
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
    fontSize: 18,
    color: "#391713",
    textAlign: "center",
  },
  resendContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  timerText: {
    color: "#888",
    fontSize: 14,
    fontFamily: "PoppinsRegular",
  },
  resendText: {
    color: "#911F1B",
    fontFamily: "PoppinsBold",
    fontSize: 14,
    textDecorationLine: "underline",
  },
  button: {
    backgroundColor: "#911F1B",
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

export default OTPVerification;
