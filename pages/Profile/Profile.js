import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  Animated,
  Modal,
  Vibration,
} from "react-native";
import { Ionicons, MaterialIcons, Entypo } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { API_BASE_URL } from "../../api";

function Profile({ navigation }) {
  const [user, setUser] = useState(null);
  const [fadeAnim] = useState(new Animated.Value(1));
  const [slideAnim] = useState(new Animated.Value(0));
  const [modalAnim] = useState(new Animated.Value(0));
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const username = await AsyncStorage.getItem("username");
        if (username) {
          const res = await axios.get(`${API_BASE_URL}/api/users/${username}/profile`);
          setUser(res.data);
        }
      } catch (error) {
        console.error("Failed to fetch user profile:", error);
      }
    };
    fetchUser();
  }, []);

  const handleNavigateToDetail = () => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: -30,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => {
      navigation.navigate("DetailProfile");
      fadeAnim.setValue(1);
      slideAnim.setValue(0);
    });
  };

  const showLogoutAlert = () => {
    setShowLogoutModal(true);
    Vibration.vibrate(30);
    Animated.spring(modalAnim, {
      toValue: 1,
      useNativeDriver: true,
      tension: 100,
      friction: 8,
    }).start();
  };

  const hideLogoutAlert = () => {
    Animated.timing(modalAnim, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start(() => {
      setShowLogoutModal(false);
    });
  };

  const handleLogoutConfirm = () => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: -30,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(async () => {
      try {
        await AsyncStorage.clear();
      } catch (err) {
        console.error("Gagal hapus AsyncStorage:", err);
      }
      hideLogoutAlert();
      navigation.replace("SignIn");
    });
  };

  const settings = [
    { label: "Help Center", icon: "help-outline" },
    { label: "About Us", icon: "info-outline" },
    { label: "Log Out", icon: "logout", color: "#E6020B" },
  ];

  return (
    <>
      <Animated.ScrollView
        style={[
          styles.container,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          },
        ]}
      >
        <View style={styles.headerContainer}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color="#000" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Profile</Text>
        </View>

        <TouchableOpacity style={styles.profileCard} onPress={handleNavigateToDetail}>
          <Image
            source={require("../../assets/profile.png")}
            style={styles.avatar}
          />
          <View style={{ flex: 1 }}>
            <Text style={styles.name}>{user?.fullName ?? ""}</Text>
            <Text style={styles.email}>{user?.email ?? ""}</Text>
          </View>
          <Entypo name="chevron-right" size={24} color="white" style={{ marginLeft: "auto" }} />
        </TouchableOpacity>

        <Text style={styles.settingsTitle}>Settings</Text>

        <View style={styles.menuList}>
          {settings.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.menuItem,
                item.label === "Log Out" && {
                  borderTopWidth: 1,
                  borderColor: "#ddd",
                },
              ]}
              onPress={() => {
                if (item.label === "Log Out") {
                  showLogoutAlert();
                } else {
                  console.log(`${item.label} clicked`);
                }
              }}
            >
              <MaterialIcons
                name={item.icon}
                size={24}
                color={item.color || "#391713"}
                style={styles.menuIcon}
              />
              <Text
                style={[
                  styles.menuText,
                  item.label === "Log Out" && { color: "#E6020B" },
                ]}
              >
                {item.label}
              </Text>
              <Entypo name="chevron-right" size={20} color="#999" style={{ marginLeft: "auto" }} />
            </TouchableOpacity>
          ))}
        </View>
      </Animated.ScrollView>

      {/* Modal Logout */}
      <Modal
        visible={showLogoutModal}
        transparent={true}
        animationType="none"
        onRequestClose={hideLogoutAlert}
      >
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
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Keluar Akun</Text>
              <Text style={styles.modalMessage}>
                Apakah Anda yakin ingin keluar dari akun?
              </Text>

              <View style={styles.modalButtonContainer}>
                <TouchableOpacity
                  style={[styles.modalButton, styles.cancelButton]}
                  onPress={hideLogoutAlert}
                >
                  <Text style={[styles.modalButtonText, styles.cancelButtonText]}>
                    Batal
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.modalButton, styles.confirmButton]}
                  onPress={handleLogoutConfirm}
                >
                  <Text style={[styles.modalButtonText, styles.confirmButtonText]}>
                    Iya
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </Animated.View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 20,
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 20,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#000",
    marginLeft: 10,
  },
  profileCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#911F1B",
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 16,
    backgroundColor: "#ccc",
  },
  name: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff",
  },
  email: {
    fontSize: 14,
    color: "#fff",
  },
  settingsTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#391713",
    marginBottom: 10,
  },
  menuList: {
    backgroundColor: "#fff",
    borderRadius: 12,
    paddingVertical: 4,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderColor: "#eee",
  },
  menuIcon: {
    marginRight: 16,
  },
  menuText: {
    fontSize: 14,
    color: "#391713",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 24,
    width: "80%",
    maxWidth: 400,
  },
  modalContent: {
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 12,
    color: "#000",
  },
  modalMessage: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginBottom: 20,
  },
  modalButtonContainer: {
    flexDirection: "row",
    gap: 12,
    width: "100%",
  },
  modalButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  cancelButton: {
    backgroundColor: "#ccc",
  },
  confirmButton: {
    backgroundColor: "#911F1B",
  },
  modalButtonText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  cancelButtonText: {
    color: "#333",
  },
  confirmButtonText: {
    color: "#fff",
  },
});

export default Profile;
