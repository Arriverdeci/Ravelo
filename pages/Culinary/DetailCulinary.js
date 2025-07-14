import React, { useState } from 'react';
import {
  View, Text, Image, ScrollView, StyleSheet, TouchableOpacity
} from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { useRoute } from '@react-navigation/native';

const DetailCulinary = () => {
  const route = useRoute();
  const kuliner = route.params?.kuliner;
  if (!kuliner) {
  return (
      <View style={styles.container}>
        <Text style={{ padding: 20, color: 'red' }}>No dish data found.</Text>
      </View>
    );
  }


  const [favorit, setFavorit] = useState(false);

  const openInMaps = () => {
    const lat = kuliner.latitude || -6.2;
    const lon = kuliner.longitude || 106.81;
    Linking.openURL(`https://www.google.com/maps/search/?api=1&query=${lat},${lon}`);
  };

  return (
    <ScrollView style={styles.container}>
        <View style={{ position: 'relative' }}>
            <Image source={{ uri: kuliner.fotoMakanan }} style={styles.image} />
            <View style={styles.actions}>
                {/* tombol love & location */}
            </View>
        </View>

      {/* Header action */}
      <View style={styles.actions}>
        <TouchableOpacity onPress={openInMaps}>
            <Image source={require('../../assets/ic_location.png')} style={styles.icon} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setFavorit(!favorit)}>
          <Image
            source={favorit ? require('../../assets/ic_love.png') : require('../../assets/ic_love.png')}
            style={styles.icon}
          />
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <Text style={styles.title}>{kuliner.namaMakanan}</Text>
        <Text style={styles.rating}>⭐ 0.0 Rating</Text>

        <Text style={styles.description}>{kuliner.deskripsi}</Text>

        {/* Optional: ingredient list if you want */}
        <View style={{ marginTop: 10 }}>
          {kuliner.jenisMakanan?.split(',').map((item, index) => (
            <Text key={index}>- {item.trim()}</Text>
           ))}
        </View>

        <Text style={styles.sectionTitle}>Location</Text>
        <MapView
          style={styles.map}
          initialRegion={{
            latitude: kuliner.latitude || -6.200000, 
            longitude: kuliner.longitude || 106.816666,
            latitudeDelta: 0.005,
            longitudeDelta: 0.005,
          }}
        >
          <Marker
            coordinate={{
              latitude: kuliner.latitude || -6.200000,
              longitude: kuliner.longitude || 106.816666
            }}
            title={kuliner.namaMakanan}
          />
        </MapView>
      </View>
    </ScrollView>
  );
}

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

