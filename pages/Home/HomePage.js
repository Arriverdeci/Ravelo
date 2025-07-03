import React, { useState, useEffect } from "react";
import { useNavigation, useIsFocused } from "@react-navigation/native";
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
  const [kulinerList, setKulinerList] = useState([]);
  const isFocused = useIsFocused();
  const [promoIndex, setPromoIndex] = useState(0);

  useEffect(() => {
    if (isFocused || userLocation) {
      getCurrentLocation();
      getKulinerData();
    }
  }, [isFocused, userLocation]);

  const getCurrentLocation = async () => {
    try {
      setLoading(true);
      
      let { status } = await Location.requestForegroundPermissionsAsync();
      
      if (status !== 'granted') {
        setLocationError('Permission untuk akses lokasi ditolak');
        getAllResto();
        return;
      }

      let location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
        timeInterval: 10000,
        distanceInterval: 1,
      });

      const { latitude, longitude } = location.coords;
      setUserLocation({ latitude, longitude });
      setLocationError(null);
      
      getRestobyLoc(latitude, longitude);
      
    } catch (error) {
      console.error('Error getting location:', error);
      setLocationError('Failed to get location: ' + error.message);
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
      
    } catch (error) {
      console.error('Error fetching restaurants by location:', error);
      getAllResto();
    } finally {
      setLoading(false);
    }
  };

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

  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371;
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

  const getKulinerData = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/review/getKuliner`, {
        params: {
          latitude: userLocation?.latitude || -6.2,
          longitude: userLocation?.longitude || 106.8,
        }
      });
      setKulinerList(response.data);
    } catch (error) {
      console.error("Error fetching kuliner:", error);
    }
  };

  const filteredKulinerList = kulinerList.filter(item => {
    const rating = item.totalRating || 0;
    return rating >= 4;
  });

  const HiddenGemsCard = ({ imageSource, distance, title }) => {
    return (
      <View style={styles.cardContainer}>
        <View style={styles.cardImageWrapper}>
          <Image source={imageSource} style={styles.cardImage} />
        </View>
        <View style={styles.distanceBadge}>
          <Text style={styles.distanceText}>{distance}</Text>
        </View>
      </View>
    );
  };

  const TasteCard = ({ image, title, rating, distance }) => {
    return (
      <View style={styles.tasteCardContainer}>
        <View style={styles.tasteCardImageWrapper}>
          <Image source={image} style={styles.tasteCardImage} />
          <View style={styles.ratingBadge}>
            <Text style={styles.ratingText}>{rating.toFixed(1)} ⭐</Text>
          </View>
          <View style={styles.distanceBadgeBottomRight}>
            <Text style={styles.distanceText}>{distance} Km</Text>
          </View>
        </View>
        <Text style={styles.tasteCardTitle} numberOfLines={1}>{title}</Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <HeaderBar
        searchValue={search}
        onChangeSearch={setSearch}
        onPressProfile={() => navigation.navigate('Profile')}
      />

      <FlatList
        style={styles.scrollContent}
        ListHeaderComponent={
          <>
            {/* Category Section */}
            <View style={styles.section}>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
              >
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

            {/* Hidden Gems Section */}
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
                  horizontal
                  data={hiddenGems}
                  showsHorizontalScrollIndicator={false}
                  keyExtractor={(item, index) => item.id ? item.id.toString() : `item_${index}`}
                  contentContainerStyle={{ paddingHorizontal: 16 }}
                  renderItem={({ item }) => (
                    <TouchableOpacity onPress={() => navigation.navigate('DetailHiddenGems', { restoranId: item.id })}>
                      <HiddenGemsCard
                        imageSource={
                          item.image_url 
                            ? { uri: item.image_url }
                            : require("../../assets/logo_ravelo.png")
                        }
                        distance={`${item.distance} km`}
                        title={item.name}
                      />
                    </TouchableOpacity>
                  )}
                />
              ) : (
                <View style={styles.emptyContainer}>
                  <Text style={styles.emptyText}>No restaurants found</Text>
                </View>
              )}
            </View>

            {/* Promotion */}
            <View style={styles.section}>
              <FlatList
                data={[
                  { id: '1', text: 'Make the 10-minute trip', image: require('../../assets/promotion_card1.jpeg') },
                  { id: '2', text: 'Grab your foodie deal now!', image: require('../../assets/promotion_card2.jpeg') },
                  { id: '3', text: 'Taste something new today!', image: require('../../assets/promotion_card3.jpeg') },
                ]}
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                  <View style={styles.promoCard}>
                    <View style={styles.promoTextBox}>
                      <Text style={styles.promoText}>{item.text}</Text>
                    </View>
                    <Image source={item.image} style={styles.promoImage} />
                  </View>
                )}
                onScroll={e => {
                  const index = Math.round(e.nativeEvent.contentOffset.x / (Dimensions.get('window').width - 32));
                  setPromoIndex(index);
                }}
              />
              <View style={styles.dotContainer}>
                {[0, 1, 2].map((i) => (
                  <View
                    key={i}
                    style={i === promoIndex ? styles.dotActive : styles.dotInactive}
                  />
                ))}
              </View>
            </View>

            {/* For Your Taste Header */}
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
            </View>
          </>
        }
        data={filteredKulinerList}
        keyExtractor={(item, index) => item.kulinerId?.toString() || `kuliner_${index}`}
        numColumns={2}
        columnWrapperStyle={{ justifyContent: 'space-between', paddingHorizontal: 16 }}
        contentContainerStyle={{ paddingBottom: 20 }}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => navigation.navigate('DetailHiddenGems', { restoranId: item.restoranId })}>
            <TasteCard
              image={
                item.fotoMakanan
                  ? { uri: `${API_BASE_URL}${item.fotoMakanan}` }
                  : require("../../assets/logo_ravelo.png")
              }
              // title={item.namaMakanan}
              rating={item.totalRating || 0}
              distance={item.jarakKm?.toFixed(1) || "0.0"}
            />
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

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
    width: Dimensions.get('window').width - 32,
    marginHorizontal: 16,
    borderRadius: 16,
    backgroundColor: '#911F1B',
    flexDirection: 'row',
    overflow: 'hidden',
    height: 120,
    elevation: 3,
  },
  promoTextBox: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingLeft: 16,
    paddingRight: 8,
  },
  promoText: {
    fontSize: 18,
    fontFamily: 'PoppinsBold',
    textAlign: 'center',
    color: '#fff',
  },
  promoImage: {
    width: '45%',
    height: '100%', 
    resizeMode: 'cover',
    alignSelf: 'flex-end', 
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
    marginHorizontal: 4,
  },
  dotInactive: {
    width: 20,
    height: 6,
    borderRadius: 4,
    backgroundColor: "#F3E9B5",
    marginHorizontal: 4,
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
    fontSize: 12,
    color: "#FFFFFF",
    fontFamily: 'PoppinsMedium',
  },
  tasteCardContainer: {
    width: (width - 48) / 2, 
  },
  tasteCardImageWrapper: {
    width: "100%",
    height: 120,
    borderRadius: 16,
    overflow: "hidden",
    position: "relative",
  },
  tasteCardImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  ratingBadge: {
    position: "absolute",
    top: 6,
    left: 6,
    backgroundColor: "#FFF",
    borderRadius: 8,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  ratingText: {
    fontSize: 12,
    color: "#000",
    fontFamily: 'PoppinsMedium',
  },
  distanceBadgeBottomRight: {
    position: "absolute",
    bottom: 6,
    right: 0,
    backgroundColor: "#E95322",
    borderRadius: 8,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  tasteCardTitle: {
    // marginTop: 4,
    fontSize: 12,
    color: "#000",
    fontFamily: 'PoppinsMedium',
  },
  loadingContainer: {
    padding: 16,
    alignItems: 'center',
  },
  errorContainer: {
    padding: 16,
    alignItems: 'center',
  },
  errorText: {
    color: 'red',
    marginBottom: 8,
  },
  retryButton: {
    backgroundColor: '#911F1B',
    padding: 8,
    borderRadius: 4,
  },
  retryText: {
    color: 'white',
  },
  emptyContainer: {
    padding: 16,
    alignItems: 'center',
  },
  emptyText: {
    color: '#666',
  },
});

export default HomePage;