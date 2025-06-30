import React, { useState, useEffect } from 'react';
import { useNavigation } from "@react-navigation/native";
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
  ScrollView,
} from 'react-native';

const HiddenGems = ({ navigation }) => {
  const [search, setSearch] = useState('');
  const [hiddenGems, setHiddenGems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filteredHiddenGems, setFilteredHiddenGems] = useState([]);

  useEffect(() => {
    getAllResto();
  }, []);

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
        source={item.imageUrl ? { uri: item.imageUrl } : require('../../assets/onboarding1.png')}
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
        <Text style={styles.buttonText}>See Detail</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <HeaderBar
        searchValue={search}
        onChangeSearch={handleSearch}
        onPressProfile={() => navigation.navigate('Profile')}
        // onPressNotif={() => navigation.navigate('Notification')}
        // onPressFilter={() => console.log('Filter tapped')}
      />

        {/* Scrollable Content */}
        <View style={styles.scrollWrapper}>
            <FlatList
            data={filteredHiddenGems}
            keyExtractor={(item) => item.id}
            renderItem={renderCard}
            contentContainerStyle={styles.flatListContent}
            showsVerticalScrollIndicator={false}
            />
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
});
