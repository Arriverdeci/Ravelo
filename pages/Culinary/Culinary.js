import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

const Culinary = () => {
  const navigation = useNavigation();
  const [tasteBuds, setTasteBuds] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await fetch('http://10.1.50.74:8080/kuliner/getAll');
      const result = await response.json();

      if (result.status === 200) {
        setTasteBuds(result.data);
      } else {
        console.warn('Gagal ambil data:', result.message);
      }
    } catch (error) {
      console.error('Error fetch kuliner:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderTaste = ({ item }) => (
    <View style={styles.tasteCard}>
      <Image
        source={{ uri: `http://10.1.50.74:8080${item.fotoMakanan}` }}
        style={styles.image}
      />
      <View style={styles.ratingContainer}>
        <Text style={styles.ratingText}>Rp {item.harga}</Text>
        <Text style={styles.distanceText}>{item.jenisMakanan}</Text>
      </View>
      <TouchableOpacity style={styles.tasteHeart}>
        <Icon name="heart" size={18} color="red" />
      </TouchableOpacity>
      <Text style={styles.title}>{item.namaMakanan}</Text>
    </View>
  );

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.heading}>For Your Taste Buds</Text>
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => navigation.navigate('AddCulinary')}
      >
        <Text style={styles.addButtonText}>+ Tambah Kuliner</Text>
      </TouchableOpacity>


      {loading ? (
        <Text style={styles.loading}>Loading...</Text>
      ) : (
        <FlatList
          data={tasteBuds}
          renderItem={renderTaste}
          keyExtractor={(item) => item.kulinerId.toString()}
          numColumns={2}
          scrollEnabled={false}
          columnWrapperStyle={styles.columnWrapper}
        />
      )}
    </ScrollView>
  );
};

export default Culinary;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingTop: 24,
    paddingBottom: 100,
    backgroundColor: '#fff',
  },
  heading: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333',
  },
  tasteCard: {
    flex: 1,
    margin: 8,
    borderRadius: 12,
    backgroundColor: '#f8f8f8',
    paddingBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 2,
    position: 'relative',
  },
  image: {
    height: 120,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    width: '100%',
  },
  ratingContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    marginTop: 8,
  },
  ratingText: {
    color: '#FF6347',
    fontWeight: 'bold',
  },
  distanceText: {
    fontSize: 12,
    color: '#888',
  },
  title: {
    marginTop: 4,
    marginHorizontal: 12,
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
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
