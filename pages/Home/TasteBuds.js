import React, { useState, useEffect } from 'react';
import { useIsFocused } from '@react-navigation/native';
import { API_BASE_URL } from '../../api';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import * as Location from 'expo-location';
import HeaderBar from '../Home/HeaderBar';
import i18n from '../i18n';
import axios from 'axios';

const TasteCard = ({ image, title, rating, distance }) => {
  return (
    <View style={styles.tasteCardContainer}>
      <View style={styles.tasteCardImageWrapper}>
        <Image source={image} style={styles.tasteCardImage} />
        <View style={styles.ratingBadge}>
          <Text style={styles.ratingText}>{rating?.toFixed(1)} ⭐</Text>
        </View>
        <View style={styles.distanceBadgeBottomRight}>
          <Text style={styles.distanceText}>{distance} Km</Text>
        </View>
      </View>
      <Text style={styles.tasteCardTitle} numberOfLines={1}>{title}</Text>
    </View>
  );
};

const TasteBuds = ({ navigation }) => {
  const [kulinerList, setKulinerList] = useState([]);
  const [search, setSearch] = useState('');
  const [filteredList, setFilteredList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [userLocation, setUserLocation] = useState(null);
  const isFocused = useIsFocused();
  const [locale, setLocale] = useState(i18n.locale);
  const [showLangModal, setShowLangModal] = useState(false);

  useEffect(() => {
    if (isFocused) {
      getLocationAndData();
    }
  }, [isFocused]);

  const getLocationAndData = async () => {
    try {
      setLoading(true);
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.warn("Permission denied");
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      setUserLocation(location.coords);
      await getKulinerData(location.coords);
    } catch (error) {
      console.error('Location error:', error);
    } finally {
      setLoading(false);
    }
  };

  const getKulinerData = async (coords) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/review/getKuliner`, {
        params: {
          latitude: coords?.latitude || -6.2,
          longitude: coords?.longitude || 106.8,
        },
      });
      setKulinerList(response.data);
      setFilteredList(response.data);
    } catch (error) {
      console.error('Error fetching kuliner:', error);
    }
  };

  const handleSearch = (text) => {
    setSearch(text);
    const filtered = kulinerList.filter((item) =>
      item.namaMakanan?.toLowerCase().includes(text.toLowerCase())
    );
    setFilteredList(filtered);
  };

  const renderTasteCard = ({ item }) => (
    <TouchableOpacity
      style={{ flex: 1, margin: 6 }}
      onPress={() =>
        navigation.navigate('DetailHiddenGems', { restoranId: item.restoranId })
      }
    >
      <TasteCard
        image={
            item.fotoMakanan
                ? { uri: `${API_BASE_URL}${item.fotoMakanan}` }
                : require("../../assets/logo_ravelo.png")
            }
        title={item.namaMakanan}
        rating={item.totalRating || 0}
        distance={item.jarakKm?.toFixed(1) || 0}
      />
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <HeaderBar
        searchValue={search}
        onChangeSearch={handleSearch}
        onPressProfile={() => navigation.navigate('DetailProfile')}
        onPressLanguage={() => setShowLangModal(true)} 
      />
      <View style={styles.scrollWrapper}>
        {loading ? (
          <ActivityIndicator size="large" color="#911F1B" style={{ marginTop: 40 }} />
        ) : filteredList.length === 0 ? (
          <View style={styles.emptyWrapper}>
            <Text style={styles.emptyText}>{i18n.t('notFound')}</Text>
          </View>
        ) : (
          <FlatList
            data={filteredList}
            renderItem={renderTasteCard}
            keyExtractor={(item, index) => item.kulinerId?.toString() || index.toString()}
            numColumns={2}
            contentContainerStyle={styles.listContainer}
            showsVerticalScrollIndicator={false}
          />
        )}

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
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#911F1B',
  },
  scrollWrapper: {
    flex: 1,
    backgroundColor: '#fff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 12,
    paddingHorizontal: 8,
  },
  tasteCardContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 2,
  },
  tasteCardImageWrapper: {
    position: 'relative',
  },
  tasteCardImage: {
    width: '100%',
    height: 120,
    resizeMode: 'cover',
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
  distanceText: {
    fontSize: 12,
    color: "#FFFFFF",
    fontFamily: 'PoppinsMedium',
  },
  tasteCardTitle: {
    fontSize: 14,
    color: '#000',
    marginTop: 6,
    paddingHorizontal: 8,
    paddingBottom: 10,
    fontFamily: 'PoppinsMedium',
  },
  emptyWrapper: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 60,
  },
  emptyText: {
    fontSize: 16,
    fontFamily: 'PoppinsMedium',
    color: '#666',
  },
  listContainer: {
    paddingBottom: 20,
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

export default TasteBuds;
