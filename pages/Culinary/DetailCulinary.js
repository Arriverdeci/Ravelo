import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Linking,
} from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { useRoute } from '@react-navigation/native';
import axios from 'axios';
import { API_BASE_URL } from '../../api';

const DetailCulinary = () => {
  const route = useRoute();
  const { kuliner, kulinerId } = route.params || {};
  const [data, setData] = useState(kuliner || null);
  const [favorit, setFavorit] = useState(false);

  useEffect(() => {
    if (!data && kulinerId) {
      fetchKulinerDetail(kulinerId);
    }
  }, [kulinerId]);

  const fetchKulinerDetail = async (id) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/kuliner/getById/`, {
        params: { id: kuliner.kulinerId },
      });
      if (response.data?.status === 200) {
        setData(response.data.data);
      } else {
        console.warn('Data tidak ditemukan');
      }
    } catch (error) {
      console.error('Error ambil detail kuliner:', error);
    }
  };

  const openInMaps = () => {
    const lat = data?.latitude || -6.2;
    const lon = data?.longitude || 106.81;
    Linking.openURL(`https://www.google.com/maps/search/?api=1&query=${lat},${lon}`);
  };

  if (!data) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
        <View style={styles.container}>
          <Text style={{ padding: 20, color: 'red' }}>Loading detail...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      <ScrollView style={styles.container}>
        <View style={{ position: 'relative' }}>
          <Image
            source={
              data.fotoMakanan
                ? { uri: `${API_BASE_URL}${data.fotoMakanan}` }
                : require('../../assets/logo_ravelo.png')
            }
            style={styles.image}
          />
        </View>

        <View style={styles.content}>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
            <Text style={styles.title}>{data.namaMakanan}</Text>
            <TouchableOpacity onPress={openInMaps}>
              <Image source={require('../../assets/ic_location.png')} style={styles.icon} />
            </TouchableOpacity>
          </View>
          <Text style={styles.rating}>⭐ {(data.totalRating || 0).toFixed(1)} Rating</Text>

          <Text style={styles.description}>{data.deskripsi || 'No description available.'}</Text>

          {/* Optional: ingredient list */}
          {data.jenisMakanan && (
            <View style={{ marginTop: 10 }}>
              {data.jenisMakanan.split(',').map((item, index) => (
                <Text key={index}>- {item.trim()}</Text>
              ))}
            </View>
          )}

          {/* Map Section */}
          <Text style={styles.sectionTitle}>Location</Text>
          <MapView
            style={styles.map}
            initialRegion={{
              latitude: data.latitude || -6.2,
              longitude: data.longitude || 106.81,
              latitudeDelta: 0.005,
              longitudeDelta: 0.005,
            }}
          >
            <Marker
              coordinate={{
                latitude: data.latitude || -6.2,
                longitude: data.longitude || 106.81,
              }}
              title={data.namaMakanan}
            />
          </MapView>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default DetailCulinary;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  image: {
    width: '100%',
    height: 250,
    resizeMode: 'cover',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  actions: {
    position: 'absolute',
    top: 40,
    right: 20,
    flexDirection: 'row',
    gap: 16,
  },
  icon: {
    width: 24,
    height: 24,
    tintColor: '#911F1B',
  },
  content: {
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1D1D1D',
  },
  rating: {
    fontSize: 14,
    color: '#888',
    marginVertical: 4,
  },
  description: {
    fontSize: 14,
    color: '#333',
    marginTop: 8,
    lineHeight: 20,
  },
  sectionTitle: {
    marginTop: 24,
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1D1D1D',
  },
  map: {
    width: '100%',
    height: 200,
    borderRadius: 15,
    marginTop: 12,
  },
});
