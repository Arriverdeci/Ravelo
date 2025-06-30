import React, { useState, useEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import HeaderBar from "../Home/HeaderBar";
import { API_BASE_URL } from '../../api';
import axios from 'axios';
import * as Location from 'expo-location';
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  FlatList
} from "react-native";

const { width } = Dimensions.get("window");

const HomePage = () => {
  const navigation = useNavigation();
  const [search, setSearch] = useState('');
  const [hiddenGems, setHiddenGems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userLocation, setUserLocation] = useState(null);
  const [locationError, setLocationError] = useState(null);
  const [shouldRefresh, setShouldRefresh] = useState(false);

  useEffect(() => {
    getCurrentLocation();
    
  }, []);

  // Fungsi untuk mendapatkan lokasi
  const getCurrentLocation = async () => {
    try {
      setLoading(true);
      
      // Minta permission untuk akses lokasi
      let { status } = await Location.requestForegroundPermissionsAsync();
      
      if (status !== 'granted') {
        setLocationError('Permission untuk akses lokasi ditolak');
        // Fallback: gunakan semua restoran
        getAllResto();
        return;
      }

      // Dapatkan lokasi current user
      let location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
        timeInterval: 10000,
        distanceInterval: 1,
      });

      const { latitude, longitude } = location.coords;
      setUserLocation({ latitude, longitude });
      setLocationError(null);
      
      // console.log('User location:', { latitude, longitude });
      
      getRestobyLoc(latitude, longitude);
      
    } catch (error) {
      console.error('Error getting location:', error);
      setLocationError('Gagal mendapatkan lokasi: ' + error.message);
      // Fallback: gunakan semua restoran
      getAllResto();
    }
  };

  const getRestobyLoc = async (latitude, longitude) => {
    try {
      setLoading(true);
      
      const response = await axios.post(
        `${API_BASE_URL}/resto/getByLocation`,
        { latitude, longitude }
      );
      
      // console.log('Location-based API Response:', response.data);
      
      let restaurantData = response.data;
      if (!Array.isArray(restaurantData)) {
        restaurantData = restaurantData.data || [];
      }

      const processedData = restaurantData.map((item, index) => ({
        id: item.restoranId || item.id || `restaurant_${index}`,
        name: item.namaRestoran,
        address: item.alamat,
        phone: item.nomorTelepon,
        city: item.kota,
        operatingHours: item.jamOperasional,
        latitude: item.latitude,
        longitude: item.longitude,
        status: item.status,
        image_url: item.fotoRestoran
          ? item.fotoRestoran.startsWith('http') 
            ? item.fotoRestoran
            : `${API_BASE_URL}${item.fotoRestoran}`
          : null,
        distance: calculateDistance(
          latitude,
          longitude,
          item.latitude,
          item.longitude
        ).toFixed(1)
      }));

      setHiddenGems(processedData);
      // console.log('Processed location-based data:', processedData);
      
    } catch (error) {
      console.error('Error fetching restaurants by location:', error);
      // Fallback ke semua restoran
      getAllResto();
    } finally {
      setLoading(false);
    }
  };

  // kalo ga diijinin ambil lokasi
  const getAllResto = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE_URL}/resto/getAll`);
      let restaurantData = [];
      
      if (response.data && Array.isArray(response.data)) {
        restaurantData = response.data;
      } 

      const processedData = restaurantData.map((item, index) => ({
        id: item.restoranId || item.id || `restaurant_${index}`,
        name: item.namaRestoran,
        address: item.alamat,
        phone: item.nomorTelepon,
        city: item.kota,
        operatingHours: item.jamOperasional,
        latitude: item.latitude,
        longitude: item.longitude,
        status: item.status,
        image_url: item.fotoRestoran || item.image_url
          ? (item.fotoRestoran || item.image_url).startsWith('http') 
            ? (item.fotoRestoran || item.image_url)
            : `${API_BASE_URL}${item.fotoRestoran || item.image_url}`
          : null,
        distance: userLocation 
          ? calculateDistance(
              userLocation.latitude, 
              userLocation.longitude, 
              item.latitude || 0, 
              item.longitude || 0
            ).toFixed(1)
          : (Math.random() * 10).toFixed(1)
      }));

      setHiddenGems(processedData);
      // console.log('Processed all restaurant data:', processedData);
      
    } catch (error) {
      console.error('Error fetching all restaurants:', error);
      if (error.response) {
        console.error('Error response:', error.response.data);
        console.error('Error status:', error.response.status);
      }
    } finally {
      setLoading(false);
    }
  };

  // Helper function untuk nampilin jarak dalam km
  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Radius bumi dalam km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const distance = R * c;
    return distance;
  };

  const HiddenGemsCard = ({ imageSource, distance, title }) => {
    return (
      <View style={styles.cardContainer}>
        {/* Gambar Utama */}
        <View style={styles.cardImageWrapper}>
          <Image source={imageSource} style={styles.cardImage} />
        </View>

        {/* Badge Jarak */}
        <View style={styles.distanceBadge}>
          <Text style={styles.distanceText}>{distance}</Text>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* HeaderBar */}
      <HeaderBar
        searchValue={search}
        onChangeSearch={setSearch}
        onPressProfile={() => navigation.navigate('Profile')}
        // onPressNotif={() => navigation.navigate('Notification')}
        // onPressFilter={() => console.log('Filter tapped')}
      />

      {/* Scrollable Content */}
      <ScrollView style={styles.scrollContent}>
        {/* Category */}
        <View style={styles.section}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
          >
            {/* CATEGORY ITEM */}
            {[
              { name: "Food", icon: require("../../assets/ic_food.png") },
              { name: "Drink", icon: require("../../assets/ic_drinks.png") },
              { name: "Dessert", icon: require("../../assets/ic_desserts.png") },
              { name: "Snack", icon: require("../../assets/ic_snacks.png") },
              { name: "Coffee", icon: require("../../assets/ic_coffee.png") },
            ].map((item, index) => (
              <View key={index} style={styles.categoryItem}>
                <View style={styles.categoryIconContainer}>
                  <Image
                    source={item.icon}
                    style={styles.categoryIcon}
                    resizeMode="contain"
                  />
                </View>
                <Text style={styles.categoryLabel}>{item.name}</Text>
              </View>
            ))}

          </ScrollView>
          <View style={styles.categoryUnderline} />
        </View>

        {/* Hidden Gems */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Hidden Gems</Text>
            <TouchableOpacity 
              style={styles.viewAll}
              onPress={() => navigation.navigate('HiddenGems')}>
              <Text style={styles.viewAllText}>View All</Text>
              <Image
                source={require("../../assets/ic_right_arrow.png")}
                style={styles.arrowIcon}
              />
            </TouchableOpacity>
          </View>

          {loading ? (
            <View style={styles.loadingContainer}>
              <Text style={{paddingHorizontal: 16}}>
                {userLocation ? 'Loading nearby restaurants...' : 'Getting your location...'}
              </Text>
            </View>
          ) : locationError ? (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>📍 {locationError}</Text>
              <TouchableOpacity style={styles.retryButton} onPress={getCurrentLocation}>
                <Text style={styles.retryText}>Try Again</Text>
              </TouchableOpacity>
            </View>
          ) : hiddenGems.length > 0 ? (
            <FlatList
              data={hiddenGems}
              horizontal
              showsHorizontalScrollIndicator={false}
              keyExtractor={(item, index) => item.id ? item.id.toString() : `item_${index}`}
              contentContainerStyle={{ paddingHorizontal: 16 }}
              renderItem={({ item }) => (
                <HiddenGemsCard
                  imageSource={
                    item.image_url 
                      ? { uri: item.image_url }
                      : require("../../assets/logo_ravelo.png") // Gambar default
                  }
                  distance={`${item.distance} km`}
                />
              )}
            />
          ) : (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No restaurants found</Text>
            </View>
          )}
        </View>

        {/* Promotion Card */}
        <View style={styles.section}>
          <View style={styles.promoCard}>
            <View style={styles.promoTextBox}>
              <Text style={styles.promoText}>Make the 10-minute trip</Text>
            </View>
            <Image
              source={require("../../assets/logo_ravelo.png")}
              style={styles.promoImage}
            />
          </View>
          <View style={styles.dotContainer}>
            <View style={styles.dotActive} />
            <View style={styles.dotInactive} />
            <View style={styles.dotInactive} />
          </View>
        </View>

        {/* For Your Taste */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>For Your Taste Buds</Text>
            <TouchableOpacity style={styles.viewAll}>
              <Text style={styles.viewAllText}>View All</Text>
              <Image
                source={require("../../assets/ic_right_arrow.png")}
                style={styles.arrowIcon}
              />
            </TouchableOpacity>
          </View>

          {/* TODO: Replace with FlatList for "For Your Taste" */}
          <View style={styles.placeholderBox} />
        </View>
      </ScrollView>
    </View>
  );
};

export default HomePage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#911F1B",
  },
  scrollContent: {
    flex: 1,
    backgroundColor: "#fff",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 16,
  },
  section: {
    marginBottom: 20,
    // paddingHorizontal: 16,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 16,
    color: "#000",
    fontFamily: 'PoppinsMedium',
  },
  viewAll: {
    flexDirection: "row",
    alignItems: "center",
  },
  viewAllText: {
    color: "#911F1B",
    fontSize: 11,
    fontFamily: 'PoppinsRegular',
  },
  arrowIcon: {
    width: 6,
    height: 10,
    marginLeft: 8,
    tintColor: "#911F1B",
  },
  promoCard: {
    flexDirection: "row",
    borderRadius: 20,
    overflow: "hidden",
    elevation: 3,
    height: 120,
    backgroundColor: "#911F1B",
    marginHorizontal: 16,
  },
  promoTextBox: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 16,
  },
  promoText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
  promoImage: {
    flex: 1,
    height: "100%",
    resizeMode: "cover",
  },
  dotContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 10,
  },
  dotActive: {
    width: 20,
    height: 6,
    borderRadius: 4,
    backgroundColor: "#911F1B",
    marginHorizontal: 2,
  },
  dotInactive: {
    width: 20,
    height: 6,
    borderRadius: 4,
    backgroundColor: "#F3E9B5",
    marginHorizontal: 2,
  },
  placeholderBox: {
    height: 100,
    backgroundColor: "#F3F3F3",
    borderRadius: 8,
  },
  categoryItem: {
    alignItems: "center",
    marginRight: 3,
    marginHorizontal: 16,
  },
  categoryIconContainer: {
    width: 60,
    height: 75,
    backgroundColor: "#911F1B",
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    padding: 17,
  },
  categoryIcon: {
    width: 40,
    height: 40,
    tintColor: "#FFFFFF",
  },
  categoryLabel: {
    fontSize: 12,
    color: "#000000",
    fontFamily: 'PoppinsRegular',
    marginTop: 4,
  },
  categoryUnderline: {
    height: 1.5,
    backgroundColor: "#911F1B",
    marginTop: 10,
    marginHorizontal: 16,
  },
  cardContainer: {
    width: 100,
    height: 120,
    marginRight: 8,
    position: "relative",
  },
  cardImageWrapper: {
    flex: 1,
    borderRadius: 18,
    overflow: "hidden",
  },
  cardImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  distanceBadge: {
    position: "absolute",
    bottom: 9,
    right: 0,
    backgroundColor: "#E95322",
    borderRadius: 8,
    paddingVertical: 2,
    paddingHorizontal: 6,
  },
  distanceText: {
    fontSize: 10,
    color: "#FFFFFF",
    fontFamily: 'PoppinsMedium',
  },
});
