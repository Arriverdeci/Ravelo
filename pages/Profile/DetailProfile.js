import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';

const DetailProfile = () => {
  const navigation = useNavigation();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        // Ambil username dari AsyncStorage (pastikan key-nya benar, misalnya 'username')
        const storedUsername = await AsyncStorage.getItem('username'); // bukan 'Users'!
        if (storedUsername) {
          const res = await axios.get(`http://10.1.50.225:8080/api/users/${storedUsername}/profile`);
          console.log('User fetched:', res.data); // Debug
          setUser(res.data);
        } else {
          console.warn('Username not found in AsyncStorage.');
        }
      } catch (error) {
        console.error('Failed to fetch user profile:', error);
      }
    };

    fetchProfile();
  }, []);

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={() => navigation.navigate('MainTabs')}>
          <Ionicons name="arrow-back" size={24} color="#000000" />
        </TouchableOpacity>
        <Text style={styles.header}>Detail Profile</Text>
      </View>

      {/* Profile Picture */}
      <View style={styles.profilePictureContainer}>
        <Image
          source={require('../../assets/profile.png')}
          style={styles.profilePicture}
        />
        <TouchableOpacity
          style={styles.editPhotoButton}
          onPress={() => navigation.navigate('EditProfile')}
        >
          <Text style={styles.editPhotoText}>Edit Photo</Text>
        </TouchableOpacity>
      </View>

      {/* Full Name */}
      <View style={styles.section}>
        <Text style={styles.label}>Full Name</Text>
        <Text style={styles.infoText}>
          {user?.fullName || 'Loading...'}
        </Text>
      </View>
      <View style={styles.divider} />

      {/* Email */}
      <View style={styles.section}>
        <Text style={styles.label}>Email</Text>
        <Text style={styles.infoText}>{user?.email || 'Add Email'}</Text>
      </View>
      <View style={styles.divider} />

      {/* Address */}
      <View style={styles.section}>
        <Text style={styles.label}>Address</Text>
        <Text style={styles.addText}>{user?.address || 'Add Address'}</Text>
      </View>
      <View style={styles.divider} />

      {/* Phone Number */}
      <View style={styles.section}>
        <Text style={styles.label}>Phone Number</Text>
        <Text style={styles.addText}>{user?.phoneNumber || 'Add Phone Number'}</Text>
      </View>
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
    fontSize: 24,
    fontWeight: 'bold',
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
    fontWeight: '500',
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
  infoText: {
    fontSize: 16,
    color: '#000000',
    fontWeight: '500',
  },
  addText: {
    fontSize: 16,
    color: '#911F1B',
    fontStyle: 'italic',
  },
  divider: {
    height: 1,
    backgroundColor: '#EEEEEE',
    marginHorizontal: 10,
  },
});

export default DetailProfile;
