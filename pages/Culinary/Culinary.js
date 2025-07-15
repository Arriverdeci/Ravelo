import { useNavigation, useIsFocused } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import * as Location from 'expo-location';
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  TextInput,
  SafeAreaView 
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { API_BASE_URL } from '../../api';
import i18n from '../i18n';



const { width } = Dimensions.get("window");

const Culinary = () => {
  const navigation = useNavigation();
  const isFocused = useIsFocused();
  const [userLocation, setUserLocation] = useState(null);
  const [locationError, setLocationError] = useState(null);
  const [hiddenGems, setHiddenGems] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [tasteBuds, setTasteBuds] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [kulinerList, setKulinerList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    if (isFocused) {
      getCurrentLocation();
      getKulinerData();
    }
    fetchData();
  }, [isFocused]);

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

  const fetchData = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/kuliner/getAll`);
      const result = await response.json();

      if (result.status === 200) {
        setTasteBuds(result.data);
        setFavorites(result.data.slice(0, 4));
      } else {
        console.warn('Gagal ambil data:', result.message);
      }
    } catch (error) {
      console.error('Error fetch kuliner:', error);
    } finally {
      setLoading(false);
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

  const renderFavorite = ({ item }) => (
    <View style={styles.favoriteCard}>
      <TouchableOpacity onPress={() => navigation.navigate('DetailCulinary', { kuliner: item })}>
        <Image
          source={{ uri: `${API_BASE_URL}${item.fotoMakanan}` }}
          style={styles.favoriteImage}
        />
      </TouchableOpacity>
      <TouchableOpacity style={styles.heartIcon}>
        <Icon name="heart" size={16} color="red" />
      </TouchableOpacity>
      <Text style={styles.favoriteTitle} numberOfLines={1}>
        {item.namaMakanan}
      </Text>
      <View style={styles.userRow}>
        <Image
          source={{ uri: 'https://randomuser.me/api/portraits/women/1.jpg' }}
          style={styles.userImage}
        />
        <Text style={styles.username}>Alice Fala</Text>
      </View>
    </View>
  );

  const filterKulinerBySearch = () => {
    if (!search.trim()) return kulinerList;
    const keyword = search.toLowerCase();
    return kulinerList.filter(item => 
      item.namaMakanan?.toLowerCase().includes(keyword) ||
      item.jenisMakanan?.toLowerCase().includes(keyword)
    );
  };

  const filteredKuliner = filterKulinerBySearch()
  .filter(item => (item.totalRating || 0) >= 4)
  .sort((a, b) => (b.totalRating || 0) - (a.totalRating || 0))
  .slice(0, 4);


  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      <FlatList
        style={styles.scrollContent}
        ListHeaderComponent={
          <View style={{ paddingHorizontal: 16, paddingTop: 16}}>
            {/* Header */}
            <Text style={styles.headerTitle}>{i18n.t('culinaryTitle')}</Text>

            {/* Search Bar */}
            <View style={styles.searchBar}>
              <Icon name="search" size={16} color="#888" style={{ marginRight: 8 }} />
              <TextInput 
                placeholder={i18n.t('searchPlaceholder')} 
                style={{ flex: 1 }} 
                value={search}
                onChangeText={setSearch}
              />
              {search.length > 0 && (
                <TouchableOpacity onPress={() => setSearch('')}>
                  <Icon name="times" size={16} color="#888" style={{ marginLeft: 8 }} />
                </TouchableOpacity>
              )}
            </View>

            {/* My Favorites */}
            <View>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>{i18n.t('myFav')}</Text>
                  <TouchableOpacity style={styles.viewAll}>
                    <Text 
                      style={styles.seeAll}
                      onPress={() => navigation.navigate('MyFavorites')}>{i18n.t('viewAll')}
                    </Text>
                  </TouchableOpacity>
              </View>
              
              <FlatList
                data={filterKulinerBySearch().slice(0, 4)}
                renderItem={renderFavorite}
                keyExtractor={(item) => item.kulinerId.toString()}
                numColumns={2}
                scrollEnabled={false}
                columnWrapperStyle={{ justifyContent: 'space-between' }}
              />
            </View>
            
            {/* For Your Taste Buds */}
            <View>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>{i18n.t('forYou')}</Text>
                  <TouchableOpacity style={styles.viewAll}>
                    <Text 
                      style={styles.seeAll}
                      onPress={() => navigation.navigate('TasteBuds')}>{i18n.t('viewAll')}
                    </Text>
                  </TouchableOpacity>
              </View>

              <FlatList
                data={filteredKuliner}
                keyExtractor={(item, index) => item.kulinerId?.toString() || `kuliner_${index}`}
                numColumns={2}
                columnWrapperStyle={{ justifyContent: 'space-between', paddingHorizontal: 4 }}
                contentContainerStyle={{ paddingBottom: 20 }}
                renderItem={({ item }) => (
                  <TouchableOpacity onPress={() => navigation.navigate('DetailCulinary', { kuliner: item })}>
                    <View style={styles.tasteCardContainer}>
                      <View style={styles.tasteCardImageWrapper}>
                        <Image
                          source={
                            item.fotoMakanan
                              ? { uri: `${API_BASE_URL}${item.fotoMakanan}` }
                              : require("../../assets/logo_ravelo.png")
                          }
                          style={styles.tasteCardImage}
                        />
                        <View style={styles.ratingBadge}>
                          <Text style={styles.ratingText}>{(item.totalRating || 0).toFixed(1)} ⭐</Text>
                        </View>
                        <View style={styles.distanceBadgeBottomRight}>
                          <Text style={styles.distanceText}>{item.jarakKm?.toFixed(1) || '0.0'} Km</Text>
                        </View>
                      </View>
                    </View>
                  </TouchableOpacity>
                )}
                ListEmptyComponent={() => (
                  <Text style={{ textAlign: 'center', marginTop: 20, color: '#888' }}>
                    Tidak ada hasil ditemukan.
                  </Text>
                )}
              />
            </View>
          </View>
        }
      />
    </SafeAreaView>
  );
};
export default Culinary;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 16,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: 'red',
    alignSelf: 'center',
    marginTop: 12,
  },
  searchBar: {
    marginTop: 12,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F1F1F1',
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 40,
  },
  sectionHeader: {
    marginTop: 24,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  seeAll: {
    fontSize: 14,
    color: 'red',
  },
  favoriteCard: {
    flex: 1,
    margin: 8,
    borderRadius: 12,
    backgroundColor: '#fff',
    paddingBottom: 8,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },

  favoriteColumn: {
    flexDirection: 'column',
    marginRight: 12,
  },
  favoriteImage: {
    width: '100%',
    height: 90,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  heartIcon: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: '#fff',
    borderRadius: 50,
    padding: 4,
    elevation: 2,
  },
  favoriteTitle: {
    marginHorizontal: 8,
    marginTop: 6,
    fontSize: 14,
    fontWeight: '600',
  },
  userRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 8,
    marginTop: 4,
  },
  userImage: {
    width: 20,
    height: 20,
    borderRadius: 10,
    marginRight: 6,
  },
  username: {
    fontSize: 12,
    color: '#888',
  },
  tasteCardContainer: {
    width: (width - 48) / 2,
    marginBottom: 8,
    marginTop: 8,
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
  tasteCardTitle: {
    fontSize: 12,
    color: "#000",
    fontFamily: 'PoppinsMedium',
  },

  image: {
    height: 120,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    width: '100%',
  },
  ratingOverlay: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    marginTop: 8,
  },
  ratingText: {
    fontSize: 12,
    color: "#000",
    fontFamily: 'PoppinsMedium',
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
  distanceBadgeBottomRight: {
    position: "absolute",
    bottom: 6,
    right: 0,
    backgroundColor: "#E95322",
    borderRadius: 8,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  distanceText: {
    fontSize: 12,
    color: "#FFFFFF",
    fontFamily: 'PoppinsMedium',
  },
  tasteHeart: {
    position: 'absolute',
    top: 10,
    right: 12,
    backgroundColor: 'white',
    borderRadius: 50,
    padding: 5,
    elevation: 4,
  },
  title: {
    marginTop: 6,
    marginHorizontal: 12,
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  columnWrapper: {
    justifyContent: 'space-between',
  },
  loading: {
    fontSize: 16,
    color: '#999',
    textAlign: 'center',
    marginTop: 32,
  },
});
