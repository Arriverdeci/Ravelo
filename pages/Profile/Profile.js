import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { Ionicons, MaterialIcons, Entypo } from "@expo/vector-icons";

export default function Profile({ navigation }) {
  const profileName = "Sahar Romansa";
  const email = "saharromansa@gmail.com";

  const settings = [
    { label: "Address List", icon: "location-on" },
    { label: "Setting", icon: "settings" },
    { label: "Help Center", icon: "help-outline" },
    { label: "About Us", icon: "info-outline" },
    { label: "Rating", icon: "favorite-border" },
    { label: "Log Out", icon: "logout", color: "#E6020B" },
  ];

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Profile</Text>
      </View>
      {/* Profile Card */}
      <TouchableOpacity
        style={styles.profileCard}
        onPress={() => navigation.navigate("DetailProfile")}
      >
        <Image
          source={require("../../assets/profile.png")}
          style={styles.avatar}
        />
        <View style={{ flex: 1 }}>
          <Text style={styles.name}>{profileName}</Text>
          <Text style={styles.email}>{email}</Text>
        </View>
        <Entypo
          name="chevron-right"
          size={24}
          color="white"
          style={{ marginLeft: "auto" }}
        />
      </TouchableOpacity>

      {/* Settings Title */}
      <Text style={styles.settingsTitle}>Settings</Text>

      {/* Settings List */}
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
                navigation.navigate("SignIn");
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
            <Entypo
              name="chevron-right"
              size={20}
              color="#999"
              style={{ marginLeft: "auto" }}
            />
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
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
});
