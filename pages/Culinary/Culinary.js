import { useNavigation, useIsFocused } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Dimensions,
  TextInput,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { API_BASE_URL } from '../../api';
import HeaderBar from "../Home/HeaderBar";

const { width } = Dimensions.get("window");

const Culinary = () => {
  const navigation = useNavigation();
  const isFocused = useIsFocused();
  const [userLocation, setUserLocation] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [tasteBuds, setTasteBuds] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [kulinerList, setKulinerList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isFocused) {
    getKulinerData();
    }
    fetchData();
  }, [isFocused]);

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
      <Image
        source={{ uri: `${API_BASE_URL}${item.fotoMakanan}` }}
        style={styles.favoriteImage}
      />
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

  const TasteCard = ({ image, rating, distance }) => {
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
      </View>
    );
  };

  const filteredKulinerByCategory = kulinerList.filter(
    item => item.kategori === selectedCategory
  );

  const filteredKulinerList = kulinerList.filter(
    item => (item.totalRating || 0) >= 4
  );


  const renderTaste = ({ item }) => (
    <View style={{ marginBottom: 16 }}>
      <TasteCard
        image={
          item.fotoMakanan
            ? { uri: `${API_BASE_URL}${item.fotoMakanan}` }
            : require('../../assets/logo_ravelo.png')
        }
        rating={item.totalRating || 0}
        distance={item.jarakKm?.toFixed(1) || '0.0'}
      />
    </View>
  );



  return (
    <View style={styles.container}>
      <HeaderBar
        searchValue={search}
        onChangeSearch={setSearch}
        onPressProfile={() => navigation.navigate('DetailProfile')}
      />

      <FlatList
        style={styles.scrollContent}
        ListHeaderComponent={
          <View>

            {/* 🔍 Search Result or My Favorites */}
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>My Favorites</Text>
                <TouchableOpacity style={styles.viewAll}>
                  <Text style={styles.viewAllText}>View All</Text>
                  <Image
                    source={require("../../assets/ic_right_arrow.png")}
                    style={styles.arrowIcon}
                  />
                </TouchableOpacity>
              </View>

              {/* Dummy Favorites list bisa pake FlatList horizontal */}
              <FlatList
                horizontal
                data={favoriteList} // ganti ini sesuai state
                keyExtractor={(item, index) => `fav_${index}`}
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ paddingHorizontal: 16 }}
                renderItem={({ item }) => (
                  <TouchableOpacity>
                    {/* Bisa pake komponen FavoriteCard */}
                    <View style={{ width: 100, height: 100, backgroundColor: '#eee', borderRadius: 8, justifyContent: 'center', alignItems: 'center', marginRight: 12 }}>
                      <Text>{item.namaMakanan || 'Fav'}</Text>
                    </View>
                  </TouchableOpacity>
                )}
              />
            </View>

            {/* 🍴 For Your Taste Buds */}
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

          </View>
        }

        data={kulinerList.filter(item => (item.totalRating || 0) >= 4)}
        keyExtractor={(item, index) => item.kulinerId?.toString() || `kuliner_${index}`}
        numColumns={2}
        columnWrapperStyle={{ justifyContent: 'space-between', paddingHorizontal: 16 }}
        contentContainerStyle={{ paddingBottom: 20 }}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => navigation.navigate('DetailHiddenGems', { restoranId: item.restoranId })}>
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
              <Text style={styles.tasteCardTitle} numberOfLines={1}>{item.namaMakanan}</Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
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
