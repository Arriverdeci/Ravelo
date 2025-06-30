import React, { useState, useEffect, useCallback } from "react";
import * as ImagePicker from "expo-image-picker";
import { useNavigation, useRoute, useFocusEffect } from "@react-navigation/native";
import MapView, { Marker } from "react-native-maps";
import { API_BASE_URL } from '../../api'
import * as FileSystem from 'expo-file-system';
import HomePage from "../Home/HomePage";
import {
  View,
  Text,
  TextInput,
  ScrollView,
  Image,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator
} from "react-native";

const AddRestoran = () => {
  const [image, setImage] = useState(null);
  const route = useRoute();
  const navigation = useNavigation();
  const [pickedLocation, setPickedLocation] = useState(null);
  const [namaRestoran, setNamaRestoran] = useState("");
  const [kota, setKota] = useState("");
  const [alamat, setAlamat] = useState("");
  const [jamBuka, setJamBuka] = useState("");
  const [noTelp, setNoTelp] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // State untuk loading indicator
  const [saveQueue, setSaveQueue] = useState([]); // Queue untuk track background saves

  // Restore state dari params ketika kembali dari screen lain
  useFocusEffect(
    useCallback(() => {
      // console.log("useFocusEffect triggered with params:", route.params);
      
      // Restore location yang dipilih
      if (route.params?.selectedLocation) {
        // console.log("Restoring selected location:", route.params.selectedLocation);
        setPickedLocation(route.params.selectedLocation);
      }
      
      // Restore form data
      if (route.params?.formData) {
        const { namaRestoran, kota, alamat, jamBuka, noTelp, image: imageParam } = route.params.formData;
        // console.log("Restoring form data:", route.params.formData);
        
        setNamaRestoran(namaRestoran || "");
        setKota(kota || "");
        setAlamat(alamat || "");
        setJamBuka(jamBuka || "");
        setNoTelp(noTelp || "");

        // Cek validitas image URI sebelum set
        if (imageParam && typeof imageParam === 'string') {
          setImage(imageParam);
          // console.log("Image restored from params:", imageParam);
        }
      }
    }, [route.params])
  );

  const resetForm = useCallback(() => {
    setNamaRestoran("");
    setKota("");
    setAlamat("");
    setJamBuka("");
    setNoTelp("");
    setImage(null);
    setPickedLocation(null);
  }, []);

  // Fungsi untuk mengambil gambar dari galeri
  const pickImage = useCallback(async () => {
    try {
      let permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (permissionResult.granted === false) {
        Alert.alert("Permission Required", "Permission to access gallery is required!");
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });
      
      // console.log("pickImage result:", result);

      if (!result.canceled && result.assets && result.assets.length > 0) {
        setImage(result.assets[0].uri);
        // console.log("Image set to:", result.assets[0].uri);
      }
    } catch (error) {
      console.error("Error picking image:", error);
      Alert.alert("Error", "Failed to pick image from gallery");
    }
  }, []);

  // Fungsi untuk mengambil foto dengan kamera
  const takePhoto = useCallback(async () => {
    try {
      let permissionResult = await ImagePicker.requestCameraPermissionsAsync();
      if (permissionResult.granted === false) {
        Alert.alert("Permission Required", "Permission to access camera is required!");
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        setImage(result.assets[0].uri);
        // console.log("Photo taken:", result.assets[0].uri);
      }
    } catch (error) {
      console.error("Error taking photo:", error);
      Alert.alert("Error", "Failed to take photo");
    }
  }, []);

  // Fungsi untuk menangani press pada area gambar
  const handleImagePress = useCallback(() => {
    Alert.alert(
      "Upload Image",
      "Choose source",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Camera", onPress: () => takePhoto() },
        { text: "Gallery", onPress: () => pickImage() },
      ],
      { cancelable: true }
    );
  }, [takePhoto, pickImage]);

  // Fungsi untuk upload gambar
  const uploadImage = async (imageUri) => {
    // console.log("Starting image upload for URI:", imageUri);
    
    let uploadUri = imageUri;

    if (uploadUri.startsWith("content://")) {
      try {
        const newPath = FileSystem.documentDirectory + `upload_${Date.now()}.jpg`;
        await FileSystem.copyAsync({
          from: uploadUri,
          to: newPath,
        });
        uploadUri = newPath;
        // console.log("File copied to:", uploadUri);
      } catch (error) {
        console.error("Error handling content URI:", error);
        throw new Error("Failed to process image file");
      }
    }

    const formData = new FormData();
    formData.append("image", {
      uri: uploadUri,
      type: "image/jpeg",
      name: `resto_${Date.now()}.jpg`,
    });

    try {
      // console.log("Uploading image to:", `${API_BASE_URL}/resto/upload`);
      
      const response = await fetch(`${API_BASE_URL}/resto/upload`, {
        method: "POST",
        headers: {
          "Content-Type": "multipart/form-data",
        },
        body: formData,
      });

      const resData = await response.json();
      // console.log("Upload response:", resData);

      if (!response.ok) {
        throw new Error(`Upload failed: ${resData?.error || resData?.message || `HTTP ${response.status}`}`);
      }

      // Server sekarang mengembalikan URL lengkap
      let finalImageUrl = resData.url;
      
      // Fallback jika server hanya mengembalikan filename
      if (!finalImageUrl && resData.filename) {
        finalImageUrl = `${API_BASE_URL}/resto/uploads/${resData.filename}`;
      }
      
      if (!finalImageUrl) {
        throw new Error("Server did not return image URL or filename");
      }

      // console.log("Image uploaded successfully, final URL:", finalImageUrl);
      return finalImageUrl;
    } catch (error) {
      console.error("Upload error:", error);
      throw error;
    }
  };

  // Background save function - diperbaiki
  const saveInBackground = async (formData, imageUri) => {
    const saveId = Date.now();
    
    try {
      // console.log("Starting background save with ID:", saveId);
      setSaveQueue(prev => [...prev, { id: saveId, status: 'uploading', name: formData.namaRestoran }]);
      
      // Upload image first
      let imageUrl = null;
      if (imageUri) {
        // console.log("Uploading image...");
        imageUrl = await uploadImage(imageUri);
        
        if (!imageUrl) {
          throw new Error("Failed to get image URL after upload");
        }
        
        // console.log("Image uploaded successfully:", imageUrl);
        setSaveQueue(prev => prev.map(item => 
          item.id === saveId ? { ...item, status: 'saving' } : item
        ));
      }

      const restoranData = {
        namaRestoran: formData.namaRestoran,
        alamat: formData.alamat,
        kota: formData.kota,
        latitude: formData.latitude,
        longitude: formData.longitude,
        jamOperasional: formData.jamOperasional,
        nomorTelepon: formData.nomorTelepon,
        fotoRestoran: imageUrl,
        createdBy: "tata", 
      };

      const response = await fetch(`${API_BASE_URL}/resto/add`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(restoranData),
      });

      const result = await response.json();
      // console.log("Save response:", result);

      if (!response.ok) {
        throw new Error(`Save failed: ${result?.message || `HTTP ${response.status}`}`);
      }

      // Remove from queue on success
      setSaveQueue(prev => prev.filter(item => item.id !== saveId));
      
      // Show success message
      // Alert.alert(
      //   "Success", 
      //   "Restaurant has been saved successfully!",
      //   [{ text: "OK" }]
      // );
      
      // console.log("Restaurant saved successfully:", result);
      return result;
      
    } catch (error) {
      console.error("Background save failed:", error);
      
      setSaveQueue(prev => prev.map(item => 
        item.id === saveId ? { ...item, status: 'error', error: error.message } : item
      ));
      
      // Show error alert
      Alert.alert(
        "Save Failed",
        `Failed to save restaurant: ${error.message}`,
        [
          { text: "OK" },
          { text: "Retry", onPress: () => retryFailedSave(saveId, formData, imageUri) }
        ]
      );
    }
  };

  // Retry failed save
  const retryFailedSave = (saveId, formData, imageUri) => {
    setSaveQueue(prev => prev.filter(item => item.id !== saveId));
    saveInBackground(formData, imageUri);
  };

  // Main save handler
  const handleSave = async () => {
    // Validasi form
    if (!namaRestoran.trim()) {
      Alert.alert("Error", "Restaurant name is required");
      return;
    }
    if (!kota.trim()) {
      Alert.alert("Error", "City is required");
      return;
    }
    if (!alamat.trim()) {
      Alert.alert("Error", "Address is required");
      return;
    }
    if (!pickedLocation) {
      Alert.alert("Error", "Please select location on map");
      return;
    }
    if (!image) {
      Alert.alert("Error", "Please add restaurant photo");
      return;
    }

    const formData = {
      namaRestoran: namaRestoran.trim(),
      alamat: alamat.trim(),
      kota: kota.trim(),
      latitude: pickedLocation.latitude,
      longitude: pickedLocation.longitude,
      jamOperasional: jamBuka.trim(),
      nomorTelepon: noTelp.trim(),
    };

    // console.log("Saving restaurant with data:", formData);

    await saveInBackground(formData, image);
    // navigation.navigate('HomePage', {refresh: true});
    
    resetForm();
  };

  // Show background save status
  const renderSaveQueue = () => {
    if (saveQueue.length === 0) return null;

    const hasActiveOperations = saveQueue.some(item => item.status === 'uploading' || item.status === 'saving');
    const errorItems = saveQueue.filter(item => item.status === 'error');

    return (
      <View style={styles.saveQueueContainer}>
        {hasActiveOperations && (
          <View style={styles.loadingIndicator}>
            <ActivityIndicator size="small" color="#911F1B" />
            <Text style={styles.loadingText}>Saving restaurant...</Text>
          </View>
        )}
        {errorItems.map(item => (
          <TouchableOpacity 
            key={item.id}
            style={styles.errorItem}
            onPress={() => retryFailedSave(item.id, {}, null)}
          >
            <Text style={styles.errorText}>❌ {item.name} failed - Tap to retry</Text>
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  // Handle navigation to pick location - menyimpan current form data
  const handlePickLocation = () => {
    const currentFormData = {
      namaRestoran,
      kota,
      alamat,
      jamBuka,
      noTelp,
      image
    };

    // console.log("Navigating to PickLocation with form data:", currentFormData);

    navigation.navigate("PickLocation", {
      formData: currentFormData,
      currentLocation: pickedLocation,
    });
  };

  return (
    <ScrollView 
      contentContainerStyle={styles.container}
      keyboardShouldPersistTaps="handled" 
    >
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Image source={require("../../assets/ic_left_arrow.png")} style={styles.backIcon} />
        </TouchableOpacity>
        <Text style={styles.title}>New Restaurant</Text>
        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveButtonText}>Save</Text>
        </TouchableOpacity>
      </View>

      {/* Background Save Queue Status */}
      {renderSaveQueue()}

      {/* Image Preview */}
      <View style={styles.imageSection}>
        <TouchableOpacity onPress={handleImagePress} style={styles.imageContainer}>
          {image ? (
            <Image
              source={{ uri: image }}
              style={styles.uploadedImage}
              resizeMode="cover"
            />
          ) : (
            <View style={styles.placeholderContainer}>
              <Image
                source={require("../../assets/ic_pictupload.png")}
                style={styles.placeholderIcon}
                resizeMode="contain"
              />
              <Text style={styles.placeholderText}>Tap to add photo</Text>
              <Text style={styles.placeholderSubText}>Camera or Gallery</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      {/* Form Fields */}
      <TextInput 
        style={styles.input} 
        placeholder="Restaurant Name" 
        value={namaRestoran} 
        onChangeText={setNamaRestoran}
        returnKeyType="next"
      />
      <TextInput 
        style={styles.input} 
        placeholder="City/District" 
        value={kota} 
        onChangeText={setKota}
        returnKeyType="next"
      />
      <TextInput 
        style={styles.input} 
        placeholder="Address" 
        value={alamat} 
        onChangeText={setAlamat}
        returnKeyType="next"
        multiline={true}
        numberOfLines={2}
      />
      <TextInput 
        style={styles.input} 
        placeholder="Opening Hours (e.g., 09:00 - 22:00)" 
        value={jamBuka}
        onChangeText={setJamBuka}
        returnKeyType="next"
      />
      <TextInput 
        style={styles.input} 
        placeholder="Phone Number" 
        keyboardType="phone-pad" 
        value={noTelp} 
        onChangeText={setNoTelp}
        returnKeyType="done"
      />

      {/* Detail Section */}
      <Text style={styles.sectionTitle}>Place Details</Text>
      <Text style={styles.sectionSub}>Provide location details below</Text>

      {/* Location Picker */}
      <View style={styles.mapPreview}>
        {pickedLocation ? (
          <MapView
            style={StyleSheet.absoluteFillObject}
            region={{
              latitude: pickedLocation.latitude,
              longitude: pickedLocation.longitude,
              latitudeDelta: 0.005,
              longitudeDelta: 0.005,
            }}
            scrollEnabled={true}
            zoomEnabled={true}
          >
            <Marker coordinate={pickedLocation} />
          </MapView>
        ) : (
          <TouchableOpacity
            style={styles.placeholderContainer}
            onPress={handlePickLocation}
          >
            <Image
              source={require("../../assets/ic_location.png")}
              style={styles.placeholderImage}
            />
            <Text style={styles.mapPlaceholderText}>Tap to select location</Text>
          </TouchableOpacity>
        )}
      </View>
      
      {pickedLocation && (
        <TouchableOpacity style={styles.editLocationButton} onPress={handlePickLocation}>
          <Text style={styles.editLocationText}>Change Location</Text>
        </TouchableOpacity>
      )}
      
      <View style={{ height: 50 }} />
    </ScrollView>
  );
};

export default AddRestoran;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#FFFFFF",
    flexGrow: 1, 
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
    fontFamily: 'PoppinsBold',
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
    fontFamily: 'PoppinsRegular',
    fontSize: 12,
  },
  sectionLabel: {
    fontFamily: 'PoppinsBold',
    fontSize: 14,
    marginTop: 20,
  },
  imageSection: {
    marginTop: 10,
  },
  imageContainer: {
    width: "100%",
    height: 190,
    borderRadius: 12,
    overflow: "hidden",
  },
  uploadedImage: {
    width: "100%",
    height: "100%",
    backgroundColor: "transparent",
  },
  placeholderContainer: {
    width: "100%",
    height: "100%",
    backgroundColor: "#f8f9fa",
    borderWidth: 2,
    borderColor: "#e9ecef",
    borderStyle: "dashed",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  placeholderIcon: {
    width: 60,
    height: 60,
    tintColor: "#911F1B",
    marginBottom: 12,
  },
  placeholderText: {
    fontSize: 16,
    fontFamily: 'PoppinsMedium',
    color: "#911F1B",
    textAlign: "center",
    marginBottom: 4,
  },
  placeholderSubText: {
    fontSize: 12,
    fontFamily: 'PoppinsRegular',
    color: "#911F1B",
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#cccccc",
    borderRadius: 14,
    padding: 10,
    marginTop: 12,
    fontFamily: 'PoppinsLight',
    fontSize: 12,
    backgroundColor: "#FFFFFF", 
  },
  sectionTitle: {
    fontSize: 14,
    fontFamily: 'PoppinsBold',
    marginTop: 20,
    color: "#202124",
  },
  sectionSub: {
    fontSize: 11,
    fontFamily: 'PoppinsRegular',
    color: "#5f6368",
    marginTop: 4,
  },
  mapPreview: {
    height: 190,
    width: "100%",
    overflow: "hidden",
    backgroundColor: "#f8f9fa",
    borderRadius: 12,
    marginTop: 8,
  },
  mapPlaceholderText: {
    fontSize: 12,
    color: "#911F1B",
    textAlign: "center",
    marginTop: 20,
    fontFamily: 'PoppinsRegular',
  },
  placeholderImage: {
    width: 100,
    height: 90,
    tintColor: "#911F1B", 
  },
  editLocationButton: {
    marginTop: 8,
    padding: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#911F1B",
    backgroundColor: "#FFFFFF",
    alignItems: "center",
  },
  editLocationText: {
    color: "#911F1B",
    fontSize: 12,
    fontFamily: 'PoppinsRegular',
  },
  saveQueueContainer: {
    marginBottom: 12,
  },
  loadingIndicator: {
    alignItems: 'center',
    paddingVertical: 8,
  },
  errorItem: {
    backgroundColor: '#ffebee',
    padding: 8,
    borderRadius: 6,
    marginBottom: 4,
    borderLeftWidth: 3,
    borderLeftColor: '#FF3B30',
  },
  errorText: {
    fontSize: 12,
    color: '#FF3B30',
    fontWeight: '500',
  },
});