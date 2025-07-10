import React, { useState } from 'react';
import {
  View, Text, TextInput, StyleSheet, TouchableOpacity, Image, Alert, ScrollView,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import axios from 'axios';

const AddCulinary = ({ navigation }) => {
  const [namaMakanan, setNamaMakanan] = useState('');
  const [deskripsi, setDeskripsi] = useState('');
  const [harga, setHarga] = useState('');
  const [jenisMakanan, setJenisMakanan] = useState('');
  const [image, setImage] = useState(null);
  const [fotoMakananUrl, setFotoMakananUrl] = useState('');

  const restoranId = 1; // default, nanti bisa disesuaikan
  const createdBy = 'admin';

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.7,
    });

    if (!result.canceled) {
      const selectedAsset = result.assets[0];
      setImage(selectedAsset);
      uploadImage(selectedAsset);
    }
  };

  const uploadImage = async (selectedAsset) => {
    try {
      const formData = new FormData();
      formData.append('image', {
        uri: selectedAsset.uri,
        name: 'kuliner.jpg',
        type: 'image/jpeg',
      });

      const response = await axios.post('http://localhost:8080/kuliner/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setFotoMakananUrl(response.data.url); // hasil dari Spring Boot
    } catch (err) {
      console.error('Upload error:', err);
      Alert.alert('Upload Gagal', 'Pastikan file gambar valid dan server berjalan');
    }
  };

  const handleSubmit = async () => {
    if (!namaMakanan || !harga || !jenisMakanan || !fotoMakananUrl) {
      Alert.alert('Gagal', 'Isi semua data terlebih dahulu');
      return;
    }

    const payload = {
      restoranId,
      namaMakanan,
      deskripsi,
      harga: parseInt(harga),
      jenisMakanan,
      fotoMakanan: fotoMakananUrl,
      createdBy,
    };

    try {
      const response = await axios.post('http://localhost:8080/kuliner/add', payload);
      if (response.data.status === 200) {
        Alert.alert('Sukses', 'Kuliner berhasil ditambahkan');
        navigation.goBack();
      } else {
        Alert.alert('Gagal', response.data.message);
      }
    } catch (err) {
      console.error('Submit error:', err);
      Alert.alert('Error', 'Terjadi kesalahan saat menambahkan data');
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Tambah Kuliner</Text>

      <TextInput placeholder="Nama Makanan" style={styles.input} value={namaMakanan} onChangeText={setNamaMakanan} />
      <TextInput placeholder="Deskripsi" style={styles.input} value={deskripsi} onChangeText={setDeskripsi} />
      <TextInput placeholder="Harga" style={styles.input} keyboardType="numeric" value={harga} onChangeText={setHarga} />
      <TextInput placeholder="Jenis Makanan" style={styles.input} value={jenisMakanan} onChangeText={setJenisMakanan} />

      <TouchableOpacity style={styles.imagePicker} onPress={pickImage}>
        <Text style={{ color: '#fff' }}>Pilih Gambar</Text>
      </TouchableOpacity>

      {image && <Image source={{ uri: image.uri }} style={styles.preview} />}

      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
        <Text style={{ color: '#fff', fontWeight: 'bold' }}>Simpan</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};


export default AddCulinary;

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 20,
    marginBottom: 15,
    fontWeight: 'bold',
    color: '#AB070D',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    marginBottom: 15,
    padding: 10,
    borderRadius: 8,
  },
  imagePicker: {
    backgroundColor: '#AB070D',
    padding: 12,
    alignItems: 'center',
    borderRadius: 8,
    marginBottom: 15,
  },
  submitButton: {
    backgroundColor: 'green',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  preview: {
    width: '100%',
    height: 200,
    marginTop: 10,
    borderRadius: 10,
  },
});
