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
import i18n from '../i18n';

const { width } = Dimensions.get("window");

const HomePage = () => {
  const navigation = useNavigation();
  const isFocused = useIsFocused();
  const [search, setSearch] = useState('');
  const [userLocation, setUserLocation] = useState(null);
  const [locationError, setLocationError] = useState(null);
  const [hiddenGems, setHiddenGems] = useState([]);
  const [kulinerList, setKulinerList] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [promoIndex, setPromoIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [locale, setLocale] = useState(i18n.locale);
  const [showLangModal, setShowLangModal] = useState(false);

  useEffect(() => {
    if (isFocused) {
      getCurrentLocation();
      getKulinerData();
    }
  }, [isFocused]);

  const filteredSearchKuliner = kulinerList.filter(item =>
    item.namaMakanan?.toLowerCase().includes(search.toLowerCase()) ||
    item.namaRestoran?.toLowerCase().includes(search.toLowerCase())
  );

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

  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat / 2) ** 2 +
      Math.cos(lat1 * Math.PI / 180) *
      Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  const getRestobyLoc = async (latitude, longitude) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/resto/getByLocation`, { latitude, longitude });
      const data = Array.isArray(response.data) ? response.data : response.data.data || [];
      const processed = data.map((item, index) => ({
        id: item.id || `restaurant_${index}`,
        name: item.namaRestoran,
        image_url: item.fotoRestoran?.startsWith('http') ? item.fotoRestoran : `${API_BASE_URL}${item.fotoRestoran}`,
        distance: calculateDistance(latitude, longitude, item.latitude, item.longitude).toFixed(1),
      }));
      setHiddenGems(processed);
    } catch (error) {
      console.error('Error fetching location-based resto:', error);
      getAllResto();
    } finally {
      setLoading(false);
    }
  };

  const getAllResto = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/resto/getAll`);
      const data = response.data || [];
      const processedData = data.map((item, index) => ({
        id: item.id || `restaurant_${index}`,
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
      console.error('Error fetching all resto:', error);
    } finally {
      setLoading(false);
    }
  };

  const mapKategori = (text = '') => {
    const lower = text.toLowerCase();
    if (lower.includes('drink')) return 'Drink';
    if (lower.includes('dessert')) return 'Dessert';
    if (lower.includes('snack')) return 'Snack';
    if (lower.includes('coffee')) return 'Coffee';
    return 'Food';
  };

  const getKulinerData = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/review/getKuliner`, {
        params: {
          latitude: userLocation?.latitude || -6.2,
          longitude: userLocation?.longitude || 106.8,
        },
      });
      const updated = response.data.map(item => ({
        ...item,
        kategori: mapKategori(item.jenisMakanan || item.namaMakanan),
      }));
      setKulinerList(updated);
    } catch (error) {
      console.error("Error fetching kuliner:", error);
    }
  };

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

  const filteredKulinerByCategory = kulinerList.filter(
    item => item.kategori === selectedCategory
  );

  const filteredKulinerList = kulinerList.filter(
    item => (item.totalRating || 0) >= 4
  );

  const categories = [
    { key: "Food", icon: require("../../assets/ic_food.png"), label: i18n.t("categoryFood") },
    { key: "Drink", icon: require("../../assets/ic_drinks.png"), label: i18n.t("categoryDrink") },
    { key: "Dessert", icon: require("../../assets/ic_desserts.png"), label: i18n.t("categoryDessert") },
    { key: "Snack", icon: require("../../assets/ic_snacks.png"), label: i18n.t("categorySnack") },
    { key: "Coffee", icon: require("../../assets/ic_coffee.png"), label: i18n.t("categoryCoffee") },
  ];

  const translateCategory = (key) => {
    switch (key) {
      case 'Food': return i18n.t("categoryFood");
      case 'Drink': return i18n.t("categoryDrink");
      case 'Dessert': return i18n.t("categoryDessert");
      case 'Snack': return i18n.t("categorySnack");
      case 'Coffee': return i18n.t("categoryCoffee");
      default: return key;
    }
  };
  
  return (
    <View style={styles.container}>
      <HeaderBar
        searchValue={search}
        onChangeSearch={setSearch}
        onPressProfile={() => navigation.navigate('DetailProfile')}
        onPressLanguage={() => setShowLangModal(true)} 
        onPressNotif={() => navigation.navigate('Notification')} // Tambahkan ini
      />
      <FlatList
        style={styles.scrollContent}
        ListHeaderComponent={
          <View>
            {/* CATEGORY */}
            <View style={[styles.section]}>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {categories.map((item, index) => (
                  <TouchableOpacity
                    key={index}
                    onPress={() => setSelectedCategory(item.key)}
                    style={styles.categoryItem}
                  >
                    <View style={[
                      styles.categoryIconContainer,
                      selectedCategory === item.key && styles.categoryIconContainerSelected,
                    ]}>
                      <Image
                        source={item.icon}
                        style={[
                          styles.categoryIcon,
                          selectedCategory === item.key && styles.categoryIconSelected
                        ]}
                        resizeMode="contain"
                      />
                    </View>
                    <Text style={[
                      styles.categoryLabel,
                      selectedCategory === item.key && styles.categoryLabelSelected
                    ]}>
                      {item.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
              <View style={styles.categoryUnderline} />
            </View>

            {/* Back and title when filter category is active */}
            {selectedCategory !== "" && (
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>{translateCategory(selectedCategory)}</Text>
                <TouchableOpacity onPress={() => setSelectedCategory("")}>
                  <Text style={styles.viewAllText}>{i18n.t('back')}</Text>
                </TouchableOpacity>
              </View>
            )}
            
            {/* Show hidden gems + promo + for you if no search and no filter */}
            {selectedCategory === "" && search.trim() === "" && (
              <View>
                {/* Hidden Gems Section */}
                <View style={styles.section}>
                  <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>{i18n.t('hiddenGems')}</Text>
                    <TouchableOpacity 
                      style={styles.viewAll}
                      onPress={() => navigation.navigate('HiddenGems')}>
                      <Text style={styles.viewAllText}>{i18n.t('viewAll')}</Text>
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
                        <Text style={styles.retryText}>{i18n.t('retryText')}</Text>
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
                        <TouchableOpacity onPress={() => { navigation.navigate('DetailHiddenGems', { restoranId: item.id })}}>
                          <HiddenGemsCard
                            imageSource={
                              item.image_url && item.image_url !== 'null'
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
                      <Text style={styles.emptyText}>{i18n.t('emptyTextHome')}</Text>
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

                {/* For Your Taste Buds */}
                <View style={styles.section}>
                  <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>{i18n.t('forYou')}</Text>
                    <TouchableOpacity style={styles.viewAll}>
                      <Text 
                        style={styles.viewAllText}
                        onPress={() => navigation.navigate('TasteBuds')}>
                        {i18n.t('viewAll')}
                      </Text>
                      <Image
                        source={require("../../assets/ic_right_arrow.png")}
                        style={styles.arrowIcon}
                      />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            )}
          </View>
        }
        data={
          selectedCategory !== ""
            ? filteredKulinerByCategory
            : search.trim() !== ""
            ? filteredSearchKuliner
            : filteredKulinerList
        }
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
              rating={item.totalRating || 0}
              distance={item.jarakKm?.toFixed(1) || "0.0"}
            />
          </TouchableOpacity>
        )}
      />

      {showLangModal && (
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>{i18n.t('chooseLanguage')}</Text>
            <TouchableOpacity
              style={styles.langOption}
              onPress={() => {
                i18n.locale = 'id';
                setLocale('id');
                setShowLangModal(false);
              }}
            >
              <Text style={styles.langText}>🇮🇩 {i18n.t('bahasaIndo')}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.langOption}
              onPress={() => {
                i18n.locale = 'en';
                setLocale('en');
                setShowLangModal(false);
              }}
            >
              <Text style={styles.langText}>🇺🇸 {i18n.t('bahasaEng')}</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setShowLangModal(false)}>
              <Text style={styles.cancelText}>❌ {i18n.t('cancelLang')}</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

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
  categoryIconContainerSelected: {
    backgroundColor: "#fff", 
    borderWidth: 2,
    borderColor: "#911F1B",
  },
  categoryLabelSelected: {
    color: "#911F1B",
    fontFamily: 'PoppinsMedium',
  },
  categoryIconSelected: {
    tintColor: "#911F1B",
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
  modalOverlay: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 999,
  },
  modalBox: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    width: 280,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    fontFamily: 'PoppinsMedium',
  },
  langOption: {
    paddingVertical: 10,
    width: '100%',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  langText: {
    fontSize: 16,
    fontFamily: 'PoppinsRegular',
  },
  cancelText: {
    marginTop: 10,
    fontSize: 14,
    color: 'red',
    fontFamily: 'PoppinsRegular',
  },

});

export default HomePage;