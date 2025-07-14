import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  TextInput,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { API_BASE_URL } from '../../api';

const EditProfile = () => {
  const navigation = useNavigation();
  const [username, setUsername] = useState('');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      const storedUsername = await AsyncStorage.getItem('username');
      if (storedUsername) {
        setUsername(storedUsername);
        try {
          const res = await axios.get(`${API_BASE_URL}/api/users/${storedUsername}/profile`);
          setFullName(res.data.fullName);
          setEmail(res.data.email || '');
          setAddress(res.data.address || '');
          setPhoneNumber(res.data.phoneNumber || '');
        } catch (err) {
          console.error('Error fetching user:', err);
        }
      }
    };
    fetchData();
  }, []);

  const handleSave = async () => {
    try {
      await axios.put(`${API_BASE_URL}/api/users/${username}`, {
        email,
        address,
        phoneNumber,
      });
      Alert.alert('Success', 'Profile updated successfully');
      navigation.goBack(); // kembali ke DetailProfile
    } catch (err) {
      console.error('Update error:', err);
      Alert.alert('Error', 'Failed to update profile');
    }
  };

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#000000" />
        </TouchableOpacity>
        <Text style={styles.header}>Edit Profile</Text>
      </View>

      <View style={styles.profilePictureContainer}>
        <Image
          source={require('../../assets/profile.png')}
          style={styles.profilePicture}
        />
        <TouchableOpacity style={styles.editPhotoButton}>
          <Text style={styles.editPhotoText}>Edit Photo</Text>
        </TouchableOpacity>
      </View>

      {/* Full Name - read only */}
      <View style={styles.section}>
        <Text style={styles.label}>Full Name</Text>
        <TextInput
          style={styles.input}
          value={fullName}
          editable={false}
        />
      </View>
      <View style={styles.divider} />

      {/* Email */}
      <View style={styles.section}>
        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          placeholder="Enter Email"
        />
      </View>
      <View style={styles.divider} />

      {/* Address */}
      <View style={styles.section}>
        <Text style={styles.label}>Address</Text>
        <TextInput
          style={styles.input}
          value={address}
          onChangeText={setAddress}
          placeholder="Enter Address"
        />
      </View>
      <View style={styles.divider} />

      {/* Phone Number */}
      <View style={styles.section}>
        <Text style={styles.label}>Phone Number</Text>
        <TextInput
          style={styles.input}
          value={phoneNumber}
          onChangeText={setPhoneNumber}
          placeholder="Enter Phone Number"
          keyboardType="numeric"
        />
      </View>

      {/* Save Button */}
      <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
        <Text style={styles.saveButtonText}>Save</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 30,
    marginBottom: 20,
  },
  header: {
    fontSize: 18,
    fontFamily: 'PoppinsMedium',
    color: '#000000',
    marginLeft: 10,
  },
  profilePictureContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  profilePicture: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 3,
    borderColor: '#911F1B',
  },
  editPhotoButton: {
    marginTop: 10,
  },
  editPhotoText: {
    color: '#911F1B',
    fontSize: 14,
    fontFamily: 'PoppinsMedium',
  },
  section: {
    paddingVertical: 15,
    paddingHorizontal: 10,
  },
  label: {
    fontSize: 14,
    color: '#888888',
    marginBottom: 5,
  },
  input: {
    fontSize: 16,
    color: '#000000',
    fontFamily: 'PoppinsRegular',
    borderBottomWidth: 1,
    borderColor: '#ccc',
    paddingVertical: 5,
  },
  divider: {
    height: 1,
    backgroundColor: '#EEEEEE',
    marginHorizontal: 10,
  },
  saveButton: {
    backgroundColor: '#911F1B',
    paddingVertical: 14,
    margin: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'PoppinsMedium',
  },
});

export default EditProfile;
