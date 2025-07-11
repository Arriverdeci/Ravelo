import React, { useCallback, useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
  StyleSheet,
  Pressable,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useNavigation, useRoute} from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import { API_BASE_URL } from '../../api';

const AddCulinary = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const restoranId = route.params?.restoranId;
  const [image, setImage] = useState(null);
  const [nama, setNama] = useState('');
  const [harga, setHarga] = useState('');
  const [deskripsi, setDeskripsi] = useState('');
  const [kategori, setKategori] = useState({
    food: false,
    drink: false,
    snack: false,
    dessert: false,
    coffee: false,
  });
  const [saveQueue, setSaveQueue] = useState([]);

  const resetForm = useCallback(() => {
    setNama("");
    setHarga("");
    setDeskripsi("");
    setImage(null);
    setKategori({ food: false, drink: false, snack: false, dessert: false, coffee: false });
  }, []);

  const pickImage = useCallback(async () => {
    try {
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permissionResult.granted) {
        Alert.alert("Permission Required", "Permission to access gallery is required!");
        return;
      }
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });
      if (!result.canceled && result.assets?.length > 0) {
        setImage(result.assets[0].uri);
      }
    } catch (error) {
      console.error("Error picking image:", error);
      Alert.alert("Error", "Failed to pick image from gallery");
    }
  }, []);

  const takePhoto = useCallback(async () => {
    try {
      const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
      if (!permissionResult.granted) {
        Alert.alert("Permission Required", "Permission to access camera is required!");
        return;
      }
      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });
      if (!result.canceled && result.assets?.length > 0) {
        setImage(result.assets[0].uri);
      }
    } catch (error) {
      console.error("Error taking photo:", error);
      Alert.alert("Error", "Failed to take photo");
    }
  }, []);

  const handleImagePress = useCallback(() => {
    Alert.alert("Upload Image", "Choose source", [
      { text: "Cancel", style: "cancel" },
      { text: "Camera", onPress: () => takePhoto() },
      { text: "Gallery", onPress: () => pickImage() },
    ]);
  }, [takePhoto, pickImage]);

  const uploadImage = async (imageUri) => {
    let uploadUri = imageUri;
    if (uploadUri.startsWith("content://")) {
      const newPath = FileSystem.documentDirectory + `upload_${Date.now()}.jpg`;
      await FileSystem.copyAsync({ from: uploadUri, to: newPath });
      uploadUri = newPath;
    }
    const formData = new FormData();
    formData.append("image", {
      uri: uploadUri,
      type: "image/jpeg",
      name: `kuliner_${Date.now()}.jpg`,
    });
    const response = await fetch(`${API_BASE_URL}/kuliner/upload`, {
      method: "POST",
      headers: { "Content-Type": "multipart/form-data" },
      body: formData,
    });
    const resData = await response.json();
    if (!response.ok || (!resData.url && !resData.filename)) {
      throw new Error("Upload failed");
    }
    return resData.url || `${API_BASE_URL}/kuliner/uploads/${resData.filename}`;
  };

  const saveInBackground = async (formData, imageUri) => {
    const saveId = Date.now();
    try {
      setSaveQueue(prev => [...prev, { id: saveId, status: 'uploading', name: formData.namaMakanan }]);
      let imageUrl = null;
      if (imageUri) imageUrl = await uploadImage(imageUri);

      const kulinerData = {
        namaMakanan: formData.namaMakanan,
        harga: formData.harga,
        deskripsi: formData.deskripsi,
        fotoMakanan: imageUrl,
        restoranId: formData.restoranId,
        jenisMakanan: formData.jenisMakanan,
        createdBy: "tata",
      };

      const response = await fetch(`${API_BASE_URL}/kuliner/add`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(kulinerData),
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.message || `HTTP ${response.status}`);
      setSaveQueue(prev => prev.filter(item => item.id !== saveId));
      return result;
    } catch (error) {
      console.error("Save failed:", error);
      setSaveQueue(prev => prev.map(item => item.id === saveId ? { ...item, status: 'error', error: error.message } : item));
      Alert.alert("Save Failed", error.message, [
        { text: "OK" },
        { text: "Retry", onPress: () => retryFailedSave(saveId, formData, imageUri) },
      ]);
    }
  };

  const retryFailedSave = (saveId, formData, imageUri) => {
    setSaveQueue(prev => prev.filter(item => item.id !== saveId));
    saveInBackground(formData, imageUri);
  };

  const handleKategoriChange = (key) => {
    setKategori(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSave = async () => {
    if (!nama.trim()) return Alert.alert("Error", "Dish name is required");
    if (!harga.trim()) return Alert.alert("Error", "Price is required");
    if (!deskripsi.trim()) return Alert.alert("Error", "Description is required");
    if (!image) return Alert.alert("Error", "Please add dish photo");

    const selectedKategori = Object.entries(kategori)
        .filter(([_, isSelected]) => isSelected)
        .map(([key]) => key)
        .join(',');
    
    const formData = {
      namaMakanan: nama.trim(),
      harga: harga.trim(),
      deskripsi: deskripsi.trim(),
      restoranId,
      jenisMakanan: selectedKategori,
    };

    await saveInBackground(formData, image);
    resetForm();
    navigation.navigate("Home", {
      screen: "DetailHiddenGems",
      params: {restoranId: restoranId}
    });

  };

  const renderSaveQueue = () => {
    if (saveQueue.length === 0) return null;
    const hasActive = saveQueue.some(item => item.status === 'uploading' || item.status === 'saving');
    const errors = saveQueue.filter(item => item.status === 'error');
    return (
      <View>
        {hasActive && (
          <View>
            <ActivityIndicator size="small" color="#911F1B" />
            <Text>Saving menu...</Text>
          </View>
        )}
        {errors.map(item => (
          <TouchableOpacity key={item.id} onPress={() => retryFailedSave(item.id, {}, null)}>
            <Text>❌ {item.name} failed - Tap to retry</Text>
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  return (
    <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Image source={require('../../assets/ic_left_arrow.png')} style={styles.backIcon} />
        </TouchableOpacity>
        <Text style={styles.title}>New Menu</Text>
        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveButtonText}>Save</Text>
        </TouchableOpacity>
      </View>

      {renderSaveQueue()}

      {/* Image Picker */}
      <View style={styles.imageSection}>
        <TouchableOpacity onPress={handleImagePress} style={styles.imageContainer}>
          {image ? (
            <Image source={{ uri: image }} style={styles.uploadedImage} resizeMode="cover" />
          ) : (
            <View style={styles.placeholderContainer}>
              <Image
                source={require('../../assets/ic_pictupload.png')}
                style={styles.placeholderIcon}
              />
              <Text style={styles.placeholderText}>Tap to add photo</Text>
              <Text style={styles.placeholderSubText}>Camera or Gallery</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      {/* Inputs */}
      <TextInput
        style={styles.input}
        placeholder="Dish Name"
        value={nama}
        onChangeText={setNama}
      />
      <TextInput
        style={styles.input}
        placeholder="Price"
        value={harga}
        onChangeText={setHarga}
        keyboardType="numeric"
      />
      <TextInput
        style={[styles.input, { height: 90, textAlignVertical: 'top' }]}
        placeholder="Description"
        value={deskripsi}
        onChangeText={setDeskripsi}
        multiline
        numberOfLines={4}
      />

      <Text style={styles.sectionLabel}>Category</Text>
      <View style={styles.checkboxGroup}>
        {Object.entries(kategori).map(([key, value]) => (
          <Pressable key={key} style={styles.checkboxRow} onPress={() => handleKategoriChange(key)}>
            <View style={[styles.checkbox, value && styles.checkboxChecked]} />
            <Text style={styles.checkboxLabel}>
              {key.charAt(0).toUpperCase() + key.slice(1)}
            </Text>
          </Pressable>
        ))}
      </View>

      <View style={{ height: 50 }} />
    </ScrollView>
  );
};

export default AddCulinary;

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    flexGrow: 1,
    paddingHorizontal: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 32,
  },
  backIcon: {
    width: 22,
    height: 16,
    tintColor: '#911F1B',
  },
  title: {
    fontSize: 18,
    fontFamily: 'PoppinsBold',
    color: '#911F1B',
  },
  saveButton: {
    backgroundColor: '#E6020B',
    paddingHorizontal: 16,
    paddingVertical: 4,
    borderRadius: 100,
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontFamily: 'PoppinsRegular',
    fontSize: 12,
  },
  imageSection: {
    marginTop: 10,
  },
  imageContainer: {
    width: '100%',
    height: 190,
    borderRadius: 12,
    overflow: 'hidden',
  },
  uploadedImage: {
    width: '100%',
    height: '100%',
  },
  placeholderContainer: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    borderWidth: 2,
    borderColor: '#e9ecef',
    borderStyle: 'dashed',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  placeholderIcon: {
    width: 60,
    height: 60,
    tintColor: '#911F1B',
    marginBottom: 12,
  },
  placeholderText: {
    fontSize: 16,
    fontFamily: 'PoppinsMedium',
    color: '#911F1B',
    textAlign: 'center',
    marginBottom: 4,
  },
  placeholderSubText: {
    fontSize: 12,
    fontFamily: 'PoppinsRegular',
    color: '#911F1B',
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#cccccc',
    borderRadius: 14,
    padding: 10,
    marginTop: 12,
    fontFamily: 'PoppinsLight',
    fontSize: 12,
    backgroundColor: '#FFFFFF',
  },
  sectionLabel: {
    fontFamily: 'PoppinsBold',
    fontSize: 14,
    marginTop: 20,
    color: '#202124',
  },
  checkboxGroup: {
    marginTop: 8,
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 6,
  },
  checkbox: {
    width: 18,
    height: 18,
    borderWidth: 2,
    borderColor: '#911F1B',
    borderRadius: 4,
    marginRight: 10,
  },
  checkboxChecked: {
    backgroundColor: '#911F1B',
  },
  checkboxLabel: {
    fontSize: 14,
    fontFamily: 'PoppinsRegular',
    color: '#202124',
  },
});
