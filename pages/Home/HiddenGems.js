import React, { useState, useEffect } from 'react';
import { useNavigation, useIsFocused } from "@react-navigation/native";
import HeaderBar from "../Home/HeaderBar";
import { API_BASE_URL } from '../../api';
import axios from 'axios';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import i18n from '../i18n';

const HiddenGems = ({ navigation }) => {
  const [search, setSearch] = useState('');
  const [hiddenGems, setHiddenGems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filteredHiddenGems, setFilteredHiddenGems] = useState([]);
  const isFocused = useIsFocused();
  const [locale, setLocale] = useState(i18n.locale);
  const [showLangModal, setShowLangModal] = useState(false);

  useEffect(() => {
    if (isFocused) {
      getAllResto();
    }
  }, [isFocused]);

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
        location: item.kota,
        openHour: item.jamOperasional,
        imageUrl: item.fotoRestoran
          ? item.fotoRestoran.startsWith('http')
            ? item.fotoRestoran
            : `${API_BASE_URL}${item.fotoRestoran}`
          : null,
      }));

      setHiddenGems(processedData);
      setFilteredHiddenGems(processedData);
    } catch (error) {
      console.error('Error fetching restaurants:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (text) => {
    setSearch(text);

    if (text.trim() === '') {
        setFilteredHiddenGems(hiddenGems);
    } else {
        const filtered = hiddenGems.filter((item) => {
            const searchResto = text.toLowerCase();

            return (
                (item.name && item.name.toLowerCase().includes(searchResto)) ||
                (item.location && item.location.toLowerCase().includes(searchResto)) ||
                (item.openHour && item.openHour.toLowerCase().includes(searchResto))
            );
        });
        setFilteredHiddenGems(filtered);
    }
  };

  const renderCard = ({ item }) => (
    <View style={styles.card}>
      <Image
        source={item.imageUrl ? { uri: item.imageUrl } : require('../../assets/OnBoarding/onboarding1.png')}
        style={styles.image}
      />

      <View style={styles.content}>
        <Text style={styles.name}>{item.name}</Text>

        <View style={styles.row}>
          <Image
            source={require('../../assets/ic_location_mini.png')}
            style={styles.icon}
          />
          <Text style={styles.location}>{item.location}</Text>
        </View>

        <View style={styles.row}>
          <Image
            source={require('../../assets/ic_clock.png')}
            style={styles.icon}
          />
          <Text style={styles.openHour}>{item.openHour}</Text>
        </View>
      </View>

      <TouchableOpacity
        style={styles.button}
        onPress={() =>
          navigation.navigate('DetailHiddenGems', { restoranId: item.id })
        }
      >
        <Text style={styles.buttonText}>{i18n.t('seeDetail')}</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <HeaderBar
        searchValue={search}
        onChangeSearch={handleSearch}
        // onPressNotif={() => navigation.navigate('Notification')}
        onPressProfile={() => navigation.navigate('Profile')}
        onPressLanguage={() => setShowLangModal(true)} 
      />

        {/* Scrollable Content */}
        <View style={styles.scrollWrapper}>
          {filteredHiddenGems.length === 0 && search.trim() !== '' ? (
            <View style={styles.emptyWrapper}>
              <Text style={styles.emptyText}>{i18n.t('notFound')}</Text>
              <TouchableOpacity
                style={styles.addButton}
                onPress={() =>
                  navigation.navigate("Culinary", {
                    screen: "AddRestoran",
                  })
                }
              >
                <Text style={styles.plus}>{i18n.t('addRestaurant')}</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <FlatList
              data={filteredHiddenGems}
              keyExtractor={(item) => item.id.toString()}
              renderItem={renderCard}
              contentContainerStyle={styles.flatListContent}
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

export default HiddenGems;

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
    overflow: 'hidden', 
    paddingTop: 8,
  },
  card: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 16,
    elevation: 1,
    marginHorizontal: 16,
    marginVertical: 6,
    padding: 14,
    alignItems: 'center',
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 12,
    marginRight: 16,
  },
  content: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontFamily: 'PoppinsMedium',
    marginBottom: 4,
    color: '#000',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  icon: {
    width: 20,
    height: 20,
    marginRight: 4,
    tintColor: '#911F1B', 
  },
  location: {
    fontSize: 12,
    fontFamily: 'PoppinsLight',
    color: '#666',
  },
  openHour: {
    fontSize: 12,
    fontFamily: 'PoppinsLight',
    color: '#666',
  },
  button: {
    backgroundColor: '#911F1B', 
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 100,
    alignSelf: 'flex-end',
  },
  buttonText: {
    fontSize: 12,
    color: '#fff',
    fontFamily: 'PoppinsMedium',
  },
  emptyWrapper: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
  },
  emptyText: {
    fontSize: 16,
    fontFamily: 'PoppinsMedium',
    color: '#555',
    marginBottom: 20,
    textAlign: 'center',
  },
  addButton: {
    backgroundColor: '#911F1B',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 100,
  },
  plus: {
    color: '#fff',
    fontSize: 14,
    fontFamily: 'PoppinsSemiBold',
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
