import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  StatusBar,
  Image,
  Linking,
} from 'react-native';
import MapView, { Marker } from 'react-native-maps';

const AboutUsScreen = () => {
  const officeLocation = {
    latitude: -6.348763867746021,
    longitude: 107.14944073471162,
  };

  const handlePhoneCall = () => {
    Linking.openURL('tel:(+62)895385253810');
  };

  const handleEmailPress = () => {
    Linking.openURL('mailto:support@ravelo.id');
  };

  const handleSearchLocation = () => {
    const url = `https://www.google.com/maps/search/?api=1&query=${officeLocation.latitude},${officeLocation.longitude}`;
    Linking.openURL(url);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>About Us</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Mascot and Brand */}
        <View style={styles.brandSection}>
          <Image 
            source={require('../../assets/ilustration.png')} 
            style={styles.mascotImage}
            resizeMode="contain"
          />
          <Text style={styles.brandName}>Ravelo</Text>
          <Text style={styles.brandDescription}>
            Ravelo aims to provide a fun and limitless culinary exploration experience for its users. The name Ravelo describes an adventurous journey of taste.
          </Text>
        </View>

        {/* Contact Information */}
        <View style={styles.contactSection}>
          <View style={styles.contactRow}>
            <View style={styles.contactItem}>
              <Text style={styles.contactIcon}>📱</Text>
              <TouchableOpacity onPress={handlePhoneCall}>
                <Text style={styles.contactText}>(+62)895385253810</Text>
              </TouchableOpacity>
            </View>
            
            <View style={styles.contactItem}>
              <Text style={styles.contactIcon}>✉️</Text>
              <TouchableOpacity onPress={handleEmailPress}>
                <Text style={styles.contactText}>support@ravelo.id</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Office Location */}
        <View style={styles.locationSection}>
          <View style={styles.locationHeader}>
            <Text style={styles.locationTitle}>Office Location</Text>
            <TouchableOpacity 
              style={styles.searchButton}
              onPress={handleSearchLocation}
            >
              <Text style={styles.searchButtonText}>Click to Search Location</Text>
            </TouchableOpacity>
          </View>

          {/* Map */}
          <View style={styles.mapContainer}>
            <MapView
              style={styles.map}
              initialRegion={{
                latitude: officeLocation.latitude,
                longitude: officeLocation.longitude,
                latitudeDelta: 0.01,
                longitudeDelta: 0.01,
              }}
              showsUserLocation={true}
              showsMyLocationButton={true}
            >
              <Marker
                coordinate={officeLocation}
                title="Ravelo Office"
                description="Politeknik Astra, Delta Silicon II Cibatu, Cikarang Selatan"
              />
            </MapView>
          </View>

          {/* Address */}
          <View style={styles.addressContainer}>
            <View style={styles.addressRow}>
              <View style={styles.locationPin}>
                <Text style={styles.pinIcon}>📍</Text>
              </View>
              <View style={styles.addressText}>
                <Text style={styles.addressTitle}>Politeknik Astra</Text>
                <Text style={styles.addressDetail}>
                  Delta Silicon II Cibatu, Cikarang Selatan
                </Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  backButton: {
    width: 30,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backIcon: {
    fontSize: 20,
    color: '#333',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  placeholder: {
    width: 30,
  },
  content: {
    flex: 1,
  },
  brandSection: {
    alignItems: 'center',
    paddingVertical: 30,
    paddingHorizontal: 20,
  },
  mascotImage: {
    width: 120,
    height: 120,
    marginBottom: 20,
  },
  brandName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  brandDescription: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    lineHeight: 20,
  },
  contactSection: {
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  contactRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  contactIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  contactText: {
    fontSize: 14,
    color: '#333',
  },
  locationSection: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  locationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  locationTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  searchButton: {
    backgroundColor: '#911F1B',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
  },
  searchButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '500',
  },
  mapContainer: {
    height: 200,
    borderRadius: 10,
    overflow: 'hidden',
    marginBottom: 15,
  },
  map: {
    flex: 1,
  },
  addressContainer: {
    backgroundColor: '#F8F8F8',
    borderRadius: 10,
    padding: 15,
  },
  addressRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  locationPin: {
    width: 30,
    height: 30,
    backgroundColor: '#911F1B',
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 15,
  },
  pinIcon: {
    fontSize: 16,
    color: '#FFFFFF',
  },
  addressText: {
    flex: 1,
  },
  addressTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 5,
  },
  addressDetail: {
    fontSize: 14,
    color: '#666',
    lineHeight: 18,
  },
});

export default AboutUsScreen;