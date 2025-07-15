import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import { API_BASE_URL } from '../../api';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useIsFocused } from '@react-navigation/native';
import i18n from '../i18n';
import HeaderBar from '../Home/HeaderBar';
import axios from 'axios';
import { Dimensions } from 'react-native';

const { width } = Dimensions.get("window");

const MyFavorites = ({ navigation }) => {
  const [favorites, setFavorites] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const isFocused = useIsFocused();

  useEffect(() => {
    if (isFocused) {
      fetchFavorites();
    }
  }, [isFocused]);

  const fetchFavorites = async () => {
    try {
    const response = await axios.get(`${API_BASE_URL}/kuliner/getAll`);
    
    const result = response.data;
        if (result.status === 200 && Array.isArray(result.data)) {
        setFavorites(result.data.slice(0, 4));
        } else {
        console.warn("Data bukan array atau status gagal", result);
        }
    } catch (error) {
        console.error("Error fetching favorites:", error);
    }
  };

  const handleSearch = (text) => {
    setSearch(text);
  };

  const filteredFavorites = favorites.filter((item) =>
    item.namaMakanan?.toLowerCase().includes(search.toLowerCase()) ||
    item.jenisMakanan?.toLowerCase().includes(search.toLowerCase())
  );

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

  return (
    <View style={styles.container}>
      <HeaderBar
        searchValue={search}
        onChangeSearch={handleSearch}
        onPressProfile={() => navigation.navigate('Profile')}
      />
      <View style={{ flex: 1, backgroundColor: '#fff', borderTopLeftRadius: 24, borderTopRightRadius: 24, paddingTop: 12 }}>
        {loading ? (
          <ActivityIndicator size="large" color="#911F1B" style={{ marginTop: 40 }} />
        ) : (
          <FlatList
            data={filteredFavorites}
            renderItem={renderFavorite}
            keyExtractor={(item) => item.kulinerId?.toString()}
            numColumns={2}
            columnWrapperStyle={{ justifyContent: 'space-between', paddingHorizontal: 8 }}
            contentContainerStyle={{ paddingBottom: 20 }}
            ListEmptyComponent={<Text style={{ textAlign: 'center', marginTop: 20, color: '#999' }}>{i18n.t('notFound')}</Text>}
          />
        )}
      </View>
    </View>
  );
};

export default MyFavorites;

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
