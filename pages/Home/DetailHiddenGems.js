import React, { useState, useEffect } from 'react';
import { useNavigation, useRoute } from "@react-navigation/native";
import HeaderBar from "../Home/HeaderBar";
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  Dimensions,
  ActivityIndicator,
  TouchableOpacity,
  Linking,
} from 'react-native';
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';
import { API_BASE_URL } from '../../api';
import axios from 'axios';

const initialLayout = { width: Dimensions.get('window').width };

const DetailsTab = ({ restaurant }) => {
  const handleOpenMaps = () => {
    const url = `https://www.google.com/maps/search/?api=1&query=${restaurant.latitude},${restaurant.longitude}`;
    Linking.openURL(url);
  };

  return (
    <ScrollView 
      style={styles.tabContent}
      contentContainerStyle={styles.scrollContent}
    >
      <Text style={styles.restaurantName}>{restaurant.name}</Text>
      <Text style={styles.cityText}>{restaurant.city}</Text>

      <View style={styles.addressContainer}>
        <View style={styles.mapPreview}>
          <MapView
            style={styles.map}
            provider={PROVIDER_GOOGLE}
            initialRegion={{
              latitude: restaurant.latitude,
              longitude: restaurant.longitude,
              latitudeDelta: 0.005,
              longitudeDelta: 0.005,
            }}
            scrollEnabled={false}
            zoomEnabled={false}
            pitchEnabled={false}
            rotateEnabled={false}
          >
            <MapView.Marker coordinate={{ latitude: restaurant.latitude, longitude: restaurant.longitude }} />
          </MapView>
        </View>
        <Text style={styles.addressText}>{restaurant.address}</Text>
      </View>

      <TouchableOpacity 
        style={styles.mapButton}
        onPress={handleOpenMaps}
      >
        <Text style={styles.buttonText}>Lihat di Google Maps</Text>
      </TouchableOpacity>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Opening Hours (WIB):</Text>
        <Text style={styles.sectionContent}>{restaurant.openingHours}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Telephone:</Text>
        <Text style={styles.sectionContent}>{restaurant.phone}</Text>
      </View>
    </ScrollView>
  );
};

const MenuTab = () => (
  <View style={styles.tabContent}>
    <Text style={styles.tabText}>Menu Items</Text>
  </View>
);

const RatingsTab = () => (
  <View style={styles.tabContent}>
    <Text style={styles.tabText}>Customer Ratings</Text>
  </View>
);

const DetailHiddenGems = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { restoranId } = route.params;

  const [search, setSearch] = useState('');
  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: 'details', title: 'Details' },
    { key: 'menu', title: 'Menu' },
    { key: 'ratings', title: 'Ratings' },
  ]);

  const [restaurant, setRestaurant] = useState(null);

  useEffect(() => {
    const fetchRestaurant = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/resto/${restoranId}`);
        const data = res.data;
        setRestaurant({
          id: data.restoranId,
          name: data.namaRestoran,
          city: data.kota,
          address: data.alamat,
          latitude: data.latitude,
          longitude: data.longitude,
          openingHours: data.jamOperasional,
          phone: data.nomorTelepon,
          image: data.fotoRestoran?.startsWith('http')
            ? data.fotoRestoran
            : `${API_BASE_URL}${data.fotoRestoran}`
        });
      } catch (err) {
        console.error('Failed to fetch restaurant detail:', err);
      }
    };

    fetchRestaurant();
  }, [restoranId]);

  const renderTabBar = props => (
    <TabBar
      {...props}
      indicatorStyle={styles.tabIndicator}
      style={styles.tabBar}
      labelStyle={styles.tabLabel}
      activeColor="#911F1B"
      inactiveColor="#911F1B"
    />
  );

  if (!restaurant) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color="#fff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <HeaderBar
        searchValue={search}
        onChangeSearch={(text) => setSearch(text)}
        onPressProfile={() => navigation.navigate('Profile')}
      />

      <Image 
        source={{ uri: restaurant.image }} 
        style={styles.restaurantImage}
        resizeMode="cover"
      />

      <TabView
        navigationState={{ index, routes }}
        renderScene={({route}) => {
          switch (route.key) {
            case 'details':
              return <DetailsTab restaurant={restaurant} />;
            case 'menu':
              return <MenuTab />;
            case 'ratings':
              return <RatingsTab />;
            default:
              return null;
          }
        }}
        onIndexChange={setIndex}
        initialLayout={initialLayout}
        renderTabBar={renderTabBar}
        style={styles.tabView}
      />
    </View>
  );
};

export default DetailHiddenGems;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#911F1B',
  },
  restaurantImage: {
    width: '100%',
    height: 250,
    marginTop: 10,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    overflow: 'hidden',
  },
  tabView: {
    flex: 1,
    backgroundColor: '#fff',
  },
  tabBar: {
    backgroundColor: 'white',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  tabIndicator: {
    backgroundColor: '#911F1B',
    height: 3,
  },
  tabLabel: {
    fontFamily: 'PoppinsMedium',
    fontSize: 14,
    textTransform: 'capitalize',
  },
  tabContent: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
  },
  tabText: {
    fontFamily: 'PoppinsRegular',
    color: '#000',
  },
  restaurantName: {
    fontSize: 20,
    fontFamily: 'PoppinsBold',
    color: '#000',
    marginBottom: 4,
  },
  cityText: {
    fontSize: 14,
    fontFamily: 'PoppinsRegular',
    color: '#555',
    marginBottom: 12,
  },
  addressContainer: {
    marginBottom: 16,
  },
  mapPreview: {
    height: 150,
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 8,
  },
  map: {
    flex: 1,
  },
  addressText: {
    fontSize: 12,
    color: '#333',
    fontFamily: 'PoppinsRegular',
  },
  mapButton: {
    backgroundColor: '#911F1B',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignSelf: 'flex-start',
    marginBottom: 16,
  },
  buttonText: {
    color: '#fff',
    fontFamily: 'PoppinsMedium',
    fontSize: 12,
  },
  section: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 14,
    fontFamily: 'PoppinsBold',
    color: '#111',
    marginBottom: 4,
  },
  sectionContent: {
    fontSize: 13,
    fontFamily: 'PoppinsRegular',
    color: '#333',
  },
});
