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
  Animated,
  Easing,
  Modal,
} from 'react-native';
import { useNavigation, useRoute, useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { API_BASE_URL } from '../../api';

const EditProfile = () => {
  const navigation = useNavigation();
  const route = useRoute();
  
  const [username, setUsername] = useState('');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [loading, setLoading] = useState(true);

  // Custom Alert Modal State
  const [showCustomAlert, setShowCustomAlert] = useState(false);
  const [alertConfig, setAlertConfig] = useState({
    title: '',
    message: '',
    buttons: [],
    type: 'info'
  });

  const [fadeAnim] = useState(new Animated.Value(0));
  const [slideAnim] = useState(new Animated.Value(50));
  const [profileScale] = useState(new Animated.Value(0.8));
  const [modalAnim] = useState(new Animated.Value(0));

  const userFromParams = route.params?.user;

  // Custom Alert Function
  const showAlert = (title, message, buttons = [], type = 'info') => {
    setAlertConfig({ title, message, buttons, type });
    setShowCustomAlert(true);
    
    Animated.spring(modalAnim, {
      toValue: 1,
      useNativeDriver: true,
      tension: 100,
      friction: 8,
    }).start();
  };

  const hideAlert = () => {
    Animated.timing(modalAnim, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start(() => {
      setShowCustomAlert(false);
    });
  };

  useFocusEffect(
    React.useCallback(() => {
      fadeAnim.setValue(0);
      slideAnim.setValue(50);
      profileScale.setValue(0.8);
      
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 400,
          easing: Easing.bezier(0.4, 0.0, 0.2, 1),
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 400,
          easing: Easing.bezier(0.4, 0.0, 0.2, 1),
          useNativeDriver: true,
        }),
        Animated.timing(profileScale, {
          toValue: 1,
          duration: 500,
          easing: Easing.bezier(0.4, 0.0, 0.2, 1),
          useNativeDriver: true,
        }),
      ]).start();
    }, [fadeAnim, slideAnim, profileScale])
  );

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const storedUsername = await AsyncStorage.getItem('username');
        
        if (storedUsername) {
          setUsername(storedUsername);
          
          if (userFromParams) {
            setFullName(userFromParams.fullName || '');
            setEmail(userFromParams.email || '');
            setAddress(userFromParams.address || '');
            setPhoneNumber(userFromParams.phoneNumber || '');
          } else {
            const res = await axios.get(`${API_BASE_URL}/api/users/${storedUsername}/profile`);
            setFullName(res.data.fullName || '');
            setEmail(res.data.email || '');
            setAddress(res.data.address || '');
            setPhoneNumber(res.data.phoneNumber || '');
          }
        }
      } catch (err) {
        console.error('Error fetching user:', err);
        showAlert('Error', 'Failed to load profile data', [
          { text: 'OK', onPress: hideAlert, style: 'cancel' }
        ], 'error');
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [userFromParams]);

  const handleSave = async () => {
    try {
      if (!email.trim()) {
        showAlert('Validation Error', 'Email is required', [
          { text: 'OK', onPress: hideAlert, style: 'cancel' }
        ], 'error');
        return;
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        showAlert('Validation Error', 'Please enter a valid email address', [
          { text: 'OK', onPress: hideAlert, style: 'cancel' }
        ], 'error');
        return;
      }

      if (phoneNumber.trim()) {
        const phoneRegex = /^[0-9+\-\s()]+$/;
        if (!phoneRegex.test(phoneNumber)) {
          showAlert('Validation Error', 'Please enter a valid phone number', [
            { text: 'OK', onPress: hideAlert, style: 'cancel' }
          ], 'error');
          return;
        }
      }

      const saveButton = new Animated.Value(1);
      Animated.sequence([
        Animated.timing(saveButton, {
          toValue: 0.95,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.timing(saveButton, {
          toValue: 1,
          duration: 100,
          useNativeDriver: true,
        }),
      ]).start();

      await axios.put(`${API_BASE_URL}/api/users/${username}`, {
        email: email.trim(),
        address: address.trim(),
        phoneNumber: phoneNumber.trim(),
      });

      showAlert('Success', 'Profile updated successfully', [
        {
          text: 'OK',
          onPress: () => {
            hideAlert();
            Animated.parallel([
              Animated.timing(fadeAnim, {
                toValue: 0,
                duration: 300,
                useNativeDriver: true,
              }),
              Animated.timing(slideAnim, {
                toValue: -50,
                duration: 300,
                useNativeDriver: true,
              }),
            ]).start(() => {
              navigation.goBack();
            });
          },
          style: 'default',
        },
      ], 'success');
    } catch (err) {
      console.error('Update error:', err);
      showAlert('Error', 'Failed to update profile. Please try again.', [
        { text: 'OK', onPress: hideAlert, style: 'cancel' }
      ], 'error');
    }
  };

  const handleGoBack = () => {
    // Exit animation before navigating back
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: -50,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => {
      navigation.goBack();
    });
  };

  // Custom Alert Modal Component
  const CustomAlertModal = () => (
    <Modal
      visible={showCustomAlert}
      transparent={true}
      animationType="none"
      onRequestClose={hideAlert}
    >
      <View style={styles.modalOverlay}>
        <Animated.View
          style={[
            styles.modalContainer,
            {
              transform: [
                {
                  scale: modalAnim,
                },
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
            <Text style={styles.modalTitle}>{alertConfig.title}</Text>
            <Text style={styles.modalMessage}>{alertConfig.message}</Text>
            
            <View style={styles.modalButtonContainer}>
              {alertConfig.buttons.map((button, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.modalButton,
                    button.style === 'cancel' ? styles.cancelButton : styles.confirmButton,
                    alertConfig.buttons.length === 1 ? { flex: 1 } : {}
                  ]}
                  onPress={button.onPress}
                >
                  <Text
                    style={[
                      styles.modalButtonText,
                      button.style === 'cancel' ? styles.cancelButtonText : styles.confirmButtonText,
                    ]}
                  >
                    {button.text}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </Animated.View>
      </View>
    </Modal>
  );

  if (loading) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  return (
    <>
      <ScrollView style={styles.container}>
        {/* Header */}
        <Animated.View 
          style={[
            styles.headerContainer,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }]
            }
          ]}
        >
          <TouchableOpacity onPress={handleGoBack}>
            <Ionicons name="arrow-back" size={24} color="#1A1A1A" />
          </TouchableOpacity>
          <Text style={styles.header}>Edit Profile</Text>
        </Animated.View>

        {/* Profile Picture */}
        <Animated.View 
          style={[
            styles.profilePictureContainer,
            {
              opacity: fadeAnim,
              transform: [{ scale: profileScale }]
            }
          ]}
        >
          <Image
            source={require('../../assets/profile.png')}
            style={styles.profilePicture}
          />
        </Animated.View>

        {/* Profile Information Card */}
        <Animated.View 
          style={[
            styles.profileCard,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }]
            }
          ]}
        >
          
          {/* Full Name - read only */}
          <View style={styles.fieldContainer}>
            <View style={styles.fieldHeader}>
              <Ionicons name="person-outline" size={20} color="#911F1B" />
              <Text style={styles.fieldLabel}>Full Name</Text>
            </View>
            <TextInput
              style={[styles.fieldInput, styles.readOnlyInput]}
              value={fullName}
              editable={false}
            />
          </View>

          <View style={styles.fieldDivider} />

          {/* Email */}
          <View style={styles.fieldContainer}>
            <View style={styles.fieldHeader}>
              <Ionicons name="mail-outline" size={20} color="#911F1B" />
              <Text style={styles.fieldLabel}>Email *</Text>
            </View>
            <TextInput
              style={styles.fieldInput}
              value={email}
              onChangeText={setEmail}
              placeholder="Enter Email"
              placeholderTextColor="#999999"
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          <View style={styles.fieldDivider} />

          {/* Address */}
          <View style={styles.fieldContainer}>
            <View style={styles.fieldHeader}>
              <Ionicons name="location-outline" size={20} color="#911F1B" />
              <Text style={styles.fieldLabel}>Address</Text>
            </View>
            <TextInput
              style={[styles.fieldInput, styles.multilineInput]}
              value={address}
              onChangeText={setAddress}
              placeholder="Enter Address"
              placeholderTextColor="#999999"
              multiline={true}
              numberOfLines={2}
              textAlignVertical="top"
            />
          </View>

          <View style={styles.fieldDivider} />

          {/* Phone Number */}
          <View style={styles.fieldContainer}>
            <View style={styles.fieldHeader}>
              <Ionicons name="call-outline" size={20} color="#911F1B" />
              <Text style={styles.fieldLabel}>Phone Number</Text>
            </View>
            <TextInput
              style={styles.fieldInput}
              value={phoneNumber}
              onChangeText={setPhoneNumber}
              placeholder="Enter Phone Number"
              placeholderTextColor="#999999"
              keyboardType="phone-pad"
            />
          </View>

        </Animated.View>

        {/* Save Button */}
        <Animated.View 
          style={{
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }]
          }}
        >
          <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
            <Ionicons name="checkmark-circle-outline" size={20} color="#FFFFFF" />
            <Text style={styles.saveButtonText}>Save Changes</Text>
          </TouchableOpacity>
        </Animated.View>
      </ScrollView>

      {/* Custom Alert Modal */}
      <CustomAlertModal />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
    paddingHorizontal: 20,
  },
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#666666',
    fontFamily: 'PoppinsRegular',
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 50,
    marginBottom: 30,
    paddingHorizontal: 5,
  },
  header: {
    fontSize: 22,
    fontFamily: 'PoppinsSemiBold',
    color: '#1A1A1A',
    marginLeft: 15,
  },
  profilePictureContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  profilePicture: {
    width: 130,
    height: 130,
    borderRadius: 65,
    borderWidth: 4,
    borderColor: '#911F1B',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
  },
  profileCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingVertical: 20,
    paddingHorizontal: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  fieldContainer: {
    paddingVertical: 18,
  },
  fieldHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  fieldLabel: {
    fontSize: 14,
    color: '#666666',
    fontFamily: 'PoppinsMedium',
    marginLeft: 10,
  },
  fieldInput: {
    fontSize: 16,
    color: '#1A1A1A',
    fontFamily: 'PoppinsRegular',
    marginLeft: 30,
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#F8F9FA',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    minHeight: 48,
  },
  multilineInput: {
    minHeight: 80,
    maxHeight: 120,
  },
  readOnlyInput: {
    backgroundColor: '#F5F5F5',
    color: '#666666',
  },
  fieldDivider: {
    height: 1,
    backgroundColor: '#F0F0F0',
    marginHorizontal: 10,
  },
  saveButton: {
    backgroundColor: '#911F1B',
    paddingVertical: 16,
    paddingHorizontal: 20,
    margin: 20,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    shadowColor: '#911F1B',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'PoppinsSemiBold',
    marginLeft: 8,
  },
  // Custom Alert Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 0,
    width: '85%',
    maxWidth: 400,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 10,
  },
  modalContent: {
    alignItems: 'center',
    paddingTop: 40,
    paddingHorizontal: 30,
    paddingBottom: 20,
  },
  modalTitle: {
    fontSize: 24,
    fontFamily: 'PoppinsSemiBold',
    color: '#1A1A1A',
    marginBottom: 20,
    textAlign: 'center',
  },
  modalMessage: {
    fontSize: 16,
    fontFamily: 'PoppinsRegular',
    color: '#666666',
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 24,
  },
  modalButtonContainer: {
    flexDirection: 'row',
    width: '100%',
    gap: 12,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 50,
  },
  cancelButton: {
    backgroundColor: '#E0E0E0',
  },
  confirmButton: {
    backgroundColor: '#FF0000',
  },
  modalButtonText: {
    fontSize: 16,
    fontFamily: 'PoppinsSemiBold',
  },
  cancelButtonText: {
    color: '#1A1A1A',
  },
  confirmButtonText: {
    color: '#FFFFFF',
  },
});

export default EditProfile;