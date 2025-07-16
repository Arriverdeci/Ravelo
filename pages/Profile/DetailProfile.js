import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  Animated,
  Easing,
} from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import { API_BASE_URL } from '../../api';

const DetailProfile = () => {
  const navigation = useNavigation();
  const [user, setUser] = useState(null);

  // Animation states
  const [fadeAnim] = useState(new Animated.Value(1));
  const [slideAnim] = useState(new Animated.Value(0));
  const [buttonScale] = useState(new Animated.Value(1));
  const [buttonOpacity] = useState(new Animated.Value(1));
  const [cardScale] = useState(new Animated.Value(1));
  const [profileScale] = useState(new Animated.Value(1));

  // Refetch profile on focus or after update
  useFocusEffect(
    React.useCallback(() => {
      const fetchProfile = async () => {
        try {
          const isUpdated = await AsyncStorage.getItem('profileUpdated');
          if (isUpdated === 'true') {
            await AsyncStorage.removeItem('profileUpdated');
          }

          const storedUsername = await AsyncStorage.getItem('username');
          if (storedUsername) {
            const res = await axios.get(`${API_BASE_URL}/api/users/${storedUsername}/profile`);
            setUser(res.data);
          } else {
            console.warn('Username not found in AsyncStorage.');
          }
        } catch (error) {
          console.error('Failed to fetch user profile:', error);
        }
      };

      fetchProfile();
    }, [])
  );

  const handleGoBack = () => {
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
      navigation.navigate('MainTabs');
    });
  };

  const handlePressIn = () => {
    Animated.parallel([
      Animated.timing(buttonScale, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(buttonOpacity, {
        toValue: 0.7,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handlePressOut = () => {
    Animated.parallel([
      Animated.timing(buttonScale, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(buttonOpacity, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handleEditPress = () => {
    Animated.sequence([
      Animated.timing(buttonScale, {
        toValue: 0.9,
        duration: 150,
        easing: Easing.bezier(0.2, 0.8, 0.2, 1),
        useNativeDriver: true,
      }),
      Animated.parallel([
        Animated.timing(profileScale, {
          toValue: 0.8,
          duration: 300,
          easing: Easing.bezier(0.4, 0.0, 0.2, 1),
          useNativeDriver: true,
        }),
        Animated.timing(cardScale, {
          toValue: 0.95,
          duration: 300,
          easing: Easing.bezier(0.4, 0.0, 0.2, 1),
          useNativeDriver: true,
        }),
        Animated.timing(buttonOpacity, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
      ])
    ]).start(() => {
      navigation.navigate('EditProfile', { user });
      setTimeout(() => {
        buttonScale.setValue(1);
        buttonOpacity.setValue(1);
        cardScale.setValue(1);
        profileScale.setValue(1);
      }, 100);
    });
  };

  return (
    <Animated.ScrollView
      style={[
        styles.container,
        {
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
        },
      ]}
    >
      {/* Header */}
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={handleGoBack}>
          <Ionicons name="arrow-back" size={24} color="#1A1A1A" />
        </TouchableOpacity>
        <Text style={styles.header}>Detail Profile</Text>
      </View>

      {/* Profile Picture */}
      <Animated.View
        style={[
          styles.profilePictureContainer,
          {
            transform: [{ scale: profileScale }],
          },
        ]}
      >
        <Image
          source={require('../../assets/profile.png')}
          style={styles.profilePicture}
        />
        <Animated.View
          style={{
            transform: [{ scale: buttonScale }],
            opacity: buttonOpacity,
          }}
        >
          <TouchableOpacity
            style={styles.editProfileButton}
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
            onPress={handleEditPress}
            activeOpacity={0.8}
          >
            <Ionicons name="create-outline" size={16} color="#911F1B" />
            <Text style={styles.editProfileText}>Edit Profile</Text>
          </TouchableOpacity>
        </Animated.View>
      </Animated.View>

      {/* Profile Info */}
      <Animated.View
        style={[
          styles.profileCard,
          {
            transform: [{ scale: cardScale }],
          },
        ]}
      >
        <View style={styles.fieldContainer}>
          <View style={styles.fieldHeader}>
            <Ionicons name="person-outline" size={20} color="#911F1B" />
            <Text style={styles.fieldLabel}>Full Name</Text>
          </View>
          <Text style={styles.fieldValue}>
            {user?.fullName || ''}
          </Text>
        </View>

        <View style={styles.fieldDivider} />

        <View style={styles.fieldContainer}>
          <View style={styles.fieldHeader}>
            <Ionicons name="mail-outline" size={20} color="#911F1B" />
            <Text style={styles.fieldLabel}>Email</Text>
          </View>
          <Text style={styles.fieldValue}>
            {user?.email || ''}
          </Text>
        </View>

        <View style={styles.fieldDivider} />

        <View style={styles.fieldContainer}>
          <View style={styles.fieldHeader}>
            <Ionicons name="location-outline" size={20} color="#911F1B" />
            <Text style={styles.fieldLabel}>Address</Text>
          </View>
          <Text
            style={[
              styles.fieldValue,
              !user?.address && styles.placeholderText,
            ]}
          >
            {user?.address || 'Add Address'}
          </Text>
        </View>

        <View style={styles.fieldDivider} />

        <View style={styles.fieldContainer}>
          <View style={styles.fieldHeader}>
            <Ionicons name="call-outline" size={20} color="#911F1B" />
            <Text style={styles.fieldLabel}>Phone Number</Text>
          </View>
          <Text
            style={[
              styles.fieldValue,
              !user?.phoneNumber && styles.placeholderText,
            ]}
          >
            {user?.phoneNumber || 'Add Phone Number'}
          </Text>
        </View>
      </Animated.View>
    </Animated.ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
    paddingHorizontal: 20,
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
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
  },
  editProfileButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 15,
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: '#FFFFFF',
    borderRadius: 25,
    borderWidth: 1.5,
    borderColor: '#911F1B',
    shadowColor: '#911F1B',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  editProfileText: {
    color: '#911F1B',
    fontSize: 14,
    fontFamily: 'PoppinsMedium',
    marginLeft: 8,
  },
  profileCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingVertical: 20,
    paddingHorizontal: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
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
  fieldValue: {
    fontSize: 16,
    color: '#1A1A1A',
    fontFamily: 'PoppinsRegular',
    marginLeft: 30,
    lineHeight: 24,
  },
  placeholderText: {
    color: '#911F1B',
    fontStyle: 'italic',
    opacity: 0.7,
  },
  fieldDivider: {
    height: 1,
    backgroundColor: '#F0F0F0',
    marginHorizontal: 10,
  },
});

export default DetailProfile;