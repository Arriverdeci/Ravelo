import React, { useState } from 'react';
import { useNavigation } from "@react-navigation/native";
import HeaderBar from "../Home/HeaderBar";
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  Dimensions,
} from 'react-native';
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';

const initialLayout = { width: Dimensions.get('window').width };

const DetailsTab = ({ restaurant }) => {

  return (
    <ScrollView 
      style={styles.tabContent}
      contentContainerStyle={styles.scrollContent}
    >
      {/* Nama Restoran */}
      <Text style={styles.restaurantName}>{restaurant.name}</Text>
      
      {/* Kota */}
      <Text style={styles.cityText}>{restaurant.city}</Text>
      
      {/* Alamat dengan Map Preview */}
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
          />
        </View>
        <Text style={styles.addressText}>{restaurant.address}</Text>
      </View>
      
      {/* Tombol Google Maps */}
      <TouchableOpacity 
        style={styles.mapButton}
        onPress={handleOpenMaps}
      >
        <Text style={styles.buttonText}>Lihat di Google Maps</Text>
      </TouchableOpacity>
      
      {/* Jam Buka */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Opening Hours (WIB):</Text>
        <Text style={styles.sectionContent}>{restaurant.openingHours}</Text>
      </View>
      
      {/* Telepon */}
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
    {/* Add your menu content here */}
  </View>
);

const RatingsTab = () => (
  <View style={styles.tabContent}>
    <Text style={styles.tabText}>Customer Ratings</Text>
    {/* Add your ratings content here */}
  </View>
);

const renderScene = SceneMap({
  details: DetailsTab,
  menu: MenuTab,
  ratings: RatingsTab,
});

const DetailHiddenGems = ({ route }) => {
  const navigation = useNavigation();
  const [search, setSearch] = useState('');
  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: 'details', title: 'Details' },
    { key: 'menu', title: 'Menu' },
    { key: 'ratings', title: 'Ratings' },
  ]);

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

  return (
    <View style={styles.container}>
      <HeaderBar
        searchValue={search}
        onChangeSearch={(text) => setSearch(text)}
        onPressProfile={() => navigation.navigate('Profile')}
      />

      {/* Restaurant Image */}
      <Image 
        source={restaurant.image} 
        style={styles.restaurantImage}
        resizeMode="cover"
      />

      {/* Tab View */}
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
});