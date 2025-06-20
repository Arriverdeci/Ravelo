import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  ScrollView,
  Image,
  TouchableOpacity,
  StyleSheet,
} from "react-native";

const AddRestaurantScreen = () => {
  const [image, setImage] = useState(null);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity>
          <Image source={require("../../assets/ic_left_arrow.png")} style={styles.backIcon} />
        </TouchableOpacity>
        <Text style={styles.title}>New Restaurant</Text>
        <TouchableOpacity style={styles.saveButton}>
          <Text style={styles.saveButtonText}>Save</Text>
        </TouchableOpacity>
      </View>

      {/* Image Preview */}
      <Image
        source={image || require("../../assets/pizza.jpg")}
        style={styles.imagePreview}
      />
      <TouchableOpacity style={styles.buttonUpload}>
        <Text style={styles.buttonText}>Upload Image</Text>
      </TouchableOpacity>

      {/* Form Fields */}
      <TextInput style={styles.input} placeholder="Restaurant Name" />
      <TextInput style={styles.input} placeholder="City/District" />
      <TextInput style={styles.input} placeholder="Address" />
      <TextInput style={styles.input} placeholder="Opening Hours" />
      <TextInput style={styles.input} placeholder="Phone Number" keyboardType="phone-pad" />

      {/* Detail Section */}
      <Text style={styles.sectionTitle}>Place Details</Text>
      <Text style={styles.sectionSub}>Provide location details below</Text>

      {/* Location Picker */}
      <View style={styles.mapPreview}>
        {/* Nanti kamu bisa integrasi peta di sini */}
      </View>
      <TouchableOpacity style={styles.buttonUpload}>
        <Text style={styles.buttonText}>Select Location</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default AddRestaurantScreen;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#FFFFFF",
    flex: 1,
    paddingHorizontal: 16,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: 32,
  },
  backIcon: {
    width: 22,
    height: 16,
    tintColor: "#911F1B",
  },
  title: {
    fontSize: 18,
    fontFamily: "PoppinsBold",
    color: "#911F1B",
  },
  saveButton: {
    backgroundColor: "#E6020B",
    paddingHorizontal: 16,
    paddingVertical: 4,
    borderRadius: 100,
  },
  saveButtonText: {
    color: "#FFFFFF",
    fontFamily: "PoppinsRegular",
    fontSize: 12,
  },
  sectionLabel: {
    fontFamily: "Poppins-Bold",
    fontSize: 14,
    marginTop: 20,
  },
  imagePreview: {
    width: "100%",
    height: 190,
    backgroundColor: "#f0f0f0",
    marginTop: 10,
    borderRadius: 12,
  },
  buttonUpload: {
    backgroundColor: "#911F1B",
    paddingVertical: 10,
    paddingHorizontal: 16,
    marginTop: 10,
    borderRadius: 6,
    alignSelf: "flex-start",
  },
  buttonText: {
    color: "#FFFFFF",
    fontFamily: "PoppinsRegular",
    fontSize: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: "#cccccc",
    borderRadius: 14,
    padding: 10,
    marginTop: 12,
    fontFamily: "PoppinsLight",
    fontSize: 12,
  },
  sectionTitle: {
    fontSize: 14,
    fontFamily: "PoppinsBold",
    marginTop: 20,
    color: "#202124",
  },
  sectionSub: {
    fontSize: 11,
    fontFamily: "PoppinsRegular",
    color: "#5f6368",
    marginTop: 4,
  },
  mapPreview: {
    height: 150,
    backgroundColor: "#e0e0e0",
    borderRadius: 12,
    marginTop: 8,
  },
});
