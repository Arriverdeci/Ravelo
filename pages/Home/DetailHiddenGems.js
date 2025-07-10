import React, { useState, useEffect, useCallback } from 'react';
import { useRoute, useNavigation, useIsFocused  } from '@react-navigation/native';
import {
  View,
  Text,
  Image,
  ScrollView,
  Dimensions,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  Linking,
  FlatList,
  Modal,
  TextInput,
  Alert
} from 'react-native';
import { TabView, TabBar } from 'react-native-tab-view';
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';
import { API_BASE_URL } from '../../api';
import HeaderBar from '../Home/HeaderBar';
import axios from 'axios';
import * as FileSystem from 'expo-file-system';
import * as ImagePicker from 'expo-image-picker';
import { FontAwesome } from "@expo/vector-icons";

const initialLayout = { width: Dimensions.get('window').width };

const DetailsTab = ({ restaurant }) => {
  const [index, setIndex] = useState(0);

  const handleOpenMaps = () => {
    const url = `https://www.google.com/maps/search/?api=1&query=${restaurant.latitude},${restaurant.longitude}`;
    Linking.openURL(url);
  };

  return (
    <ScrollView contentContainerStyle={styles.tabContent}>
      <Text style={[styles.tabText, { fontSize: 20, fontFamily: 'PoppinsBold' }]}>{restaurant.name}</Text>
      <Text style={[styles.tabText, { color: '#666', marginBottom: 10 }]}>{restaurant.city}</Text>

      <View style={styles.mapAddressRow}>
        <MapView
          style={styles.mapStyle}
          provider={PROVIDER_GOOGLE}
          initialRegion={{
            latitude: restaurant.latitude,
            longitude: restaurant.longitude,
            latitudeDelta: 0.005,
            longitudeDelta: 0.005,
          }}
          scrollEnabled={false}
        />
        <View style={styles.addressContainer}>
          <Text style={styles.tabText}>{restaurant.address}</Text>
          <TouchableOpacity onPress={handleOpenMaps}>
            <Text style={[styles.tabText, { color: '#911F1B', marginTop: 4 }]}>View on Google Maps</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.infoBlock}>
        <Text style={[styles.tabText, styles.label]}>Opening Hours (WIB)</Text>
        <Text style={styles.tabText}>{restaurant.openingHours}</Text>
      </View>

      <View style={styles.infoBlock}>
        <Text style={[styles.label]}>Telephone</Text>
        <Text style={styles.tabText}>{restaurant.phone}</Text>
      </View>
    </ScrollView>
  );
};

const MenuTab = ({ restoranId, onReviewSubmitted  }) => {
  const navigation = useNavigation();
  const [menu, setMenu] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [reviewImages, setReviewImages] = useState([]);
  const [saveQueue, setSaveQueue] = useState([]);
  const isFocused = useIsFocused();
  const [index, setIndex] = useState(0);

  const userId = 1;

  useEffect(() => {
    if (isFocused && restoranId) {
      fetchMenus();
    }
  }, [isFocused, restoranId]);

  const fetchMenus = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/kuliner/getByRestoId?id=${restoranId}`);
      setMenu(response.data.data || []);
    } catch (error) {
      console.error("Failed to fetch menu:", error);
    }
  };

  const pickImage = useCallback(async () => {
    try {
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permissionResult.granted) {
        Alert.alert("Permission Required", "Permission to access gallery is required!");
        return;
      }
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });
      if (!result.canceled && result.assets?.length > 0) {
        setReviewImages((prev) => [...prev, { uri: result.assets[0].uri }]);
      }
    } catch (error) {
      console.error("Error picking image:", error);
    }
  }, []);

  const takePhoto = useCallback(async () => {
    try {
      const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
      if (!permissionResult.granted) {
        Alert.alert("Permission Required", "Permission to access camera is required!");
        return;
      }
      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });
      if (!result.canceled && result.assets?.length > 0) {
        setReviewImages((prev) => [...prev, { uri: result.assets[0].uri }]);
      }
    } catch (error) {
      console.error("Error taking photo:", error);
    }
  }, []);

  const handleImageUpload = useCallback(() => {
    Alert.alert("Upload Image", "Choose source", [
      { text: "Cancel", style: "cancel" },
      { text: "Camera", onPress: () => takePhoto() },
      { text: "Gallery", onPress: () => pickImage() },
    ]);
  }, [takePhoto, pickImage]);

  const uploadMultipleImages = async (imageArray) => {
    const uploadedUrls = [];
    for (const image of imageArray) {
      let uri = image.uri;
      if (uri.startsWith("content://")) {
        const newPath = FileSystem.documentDirectory + `upload_${Date.now()}.jpg`;
        await FileSystem.copyAsync({ from: uri, to: newPath });
        uri = newPath;
      }

      const formData = new FormData();
      formData.append("image", {
        uri,
        type: "image/jpeg",
        name: `review_${Date.now()}.jpg`,
      });

      const res = await fetch(`${API_BASE_URL}/review/upload`, {
        method: "POST",
        headers: { "Content-Type": "multipart/form-data" },
        body: formData,
      });

      const data = await res.json();
      if (!res.ok || (!data.url && !data.filename)) {
        throw new Error("Upload failed");
      }
      const uploaded = data.url || `${API_BASE_URL}/review/uploads/${data.filename}`;
      uploadedUrls.push(uploaded);
    }
    return uploadedUrls;
  };

  const saveInBackground = async (formData, imageArray) => {
    const saveId = Date.now();
    try {
      setSaveQueue((prev) => [...prev, { id: saveId, status: "uploading", name: formData.reviewText }]);

      const uploadedUrls = await uploadMultipleImages(imageArray);

      const reviewData = {
        userId,
        makananId: formData.makananId,
        rating: formData.rating,
        reviewText: formData.reviewText,
        fotoMakanan: uploadedUrls.join(","),
        createdBy: "tata",
      };

      const response = await fetch(`${API_BASE_URL}/review/add`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(reviewData),
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.message || `HTTP ${response.status}`);
      setSaveQueue((prev) => prev.filter((item) => item.id !== saveId));
      return result;
    } catch (error) {
      console.error("Save failed:", error);
      setSaveQueue((prev) =>
        prev.map((item) => (item.id === saveId ? { ...item, status: "error", error: error.message } : item))
      );
      Alert.alert("Save Failed", error.message, [
        { text: "OK" },
        {
          text: "Retry",
          onPress: () => retryFailedSave(saveId, formData, imageArray),
        },
      ]);
    }
  };

  const retryFailedSave = (saveId, formData, imageArray) => {
    setSaveQueue((prev) => prev.filter((item) => item.id !== saveId));
    saveInBackground(formData, imageArray);
    if (typeof onReviewSubmitted === 'function') {
      onReviewSubmitted();
    }
  };

  const removeImage = (index) => {
    const newImages = [...reviewImages];
    newImages.splice(index, 1);
    setReviewImages(newImages);
  };

  const onSubmitReview = async () => {
    if (rating === 0 || reviewText.trim() === "") {
      return Alert.alert("Error", "All fields required");
    }

    const formData = {
      makananId: selectedImage.kulinerId,
      rating,
      reviewText: reviewText.trim(),
    };
    await saveInBackground(formData, reviewImages);

    // Reset state
    setSelectedImage(null);
    setRating(0);
    setReviewText("");
    setReviewImages([]);

    if (onReviewSubmitted) {
      onReviewSubmitted();
    }
  };

  const renderSaveQueue = () => {
    if (saveQueue.length === 0) return null;
    return (
      <View>
        {saveQueue.some((item) => item.status === "uploading") && (
          <View>
            <ActivityIndicator size="small" color="#911F1B" />
            <Text>Uploading review...</Text>
          </View>
        )}
        {saveQueue
          .filter((item) => item.status === "error")
          .map((item) => (
            <TouchableOpacity key={item.id} onPress={() => retryFailedSave(item.id, {}, [])}>
              <Text>❌ {item.name} failed - Tap to retry</Text>
            </TouchableOpacity>
          ))}
      </View>
    );
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity onPress={() => setSelectedImage(item)} style={styles.menuCard}>
      <Image
        source={item.fotoMakanan ? { uri: `${API_BASE_URL}${item.fotoMakanan}` } : require("../../assets/OnBoarding/onboarding1.png")}
        style={styles.menuImage}
      />
      <View style={styles.menuTextOverlay}>
        <Text style={styles.menuName} numberOfLines={1}>
          {item.namaMakanan}
        </Text>
        <Text style={styles.menuPrice}>Rp {item.harga}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <>
      <View style={{ flex: 1 }}>
        {/* {menu.length === 0 ? ( */}
          <View style={styles.emptyWrapper}>
            <Text style={styles.emptyText}>Wanna add new menu?</Text>
            <TouchableOpacity
              style={styles.addButton}
              onPress={() =>
                navigation.navigate("Culinary", {
                  screen: "AddKuliner",
                  params: { restoranId },
                })
              }
            >
              <Text style={styles.plus}>+</Text>
            </TouchableOpacity>
          </View>
        {/* ) : ( */}
          <FlatList
            data={menu}
            renderItem={renderItem}
            keyExtractor={(item) => item.kulinerId.toString()}
            numColumns={2}
            columnWrapperStyle={styles.columnWrapper}
            contentContainerStyle={styles.menuContainer}
          />
        {/* )} */}
      </View>

      <Modal visible={!!selectedImage} transparent animationType="slide" onRequestClose={() => setSelectedImage(null)}>
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            <Image source={{ uri: `${API_BASE_URL}${selectedImage?.fotoMakanan}` }} style={styles.modalImage} resizeMode="cover" />
            <Text style={styles.modalTitle}>{selectedImage?.namaMakanan}</Text>
            {renderSaveQueue()}
            <View style={styles.starRow}>
              {[1, 2, 3, 4, 5].map((i) => (
                <TouchableOpacity key={i} onPress={() => setRating(i)}>
                  <Text style={[styles.star, { color: i <= rating ? "#FFC60D" : "#FFFFFF" }]}>★</Text>
                </TouchableOpacity>
              ))}
            </View>
            <TextInput
              style={styles.reviewInput}
              placeholder="Write your review..."
              placeholderTextColor="#888"
              multiline
              value={reviewText}
              onChangeText={setReviewText}
            />
            <View style={styles.imageUploadContainer}>
              <TouchableOpacity style={styles.uploadButton} onPress={handleImageUpload}>
                <Text style={styles.uploadButtonText}>+ Upload Image</Text>
              </TouchableOpacity>
              {reviewImages.length > 0 && (
                <View style={styles.imagePreviewContainer}>
                  {reviewImages.map((image, index) => (
                    <View key={index} style={styles.imagePreviewWrapper}>
                      <Image source={{ uri: image.uri }} style={styles.imagePreview} />
                      <TouchableOpacity style={styles.removeImageButton} onPress={() => removeImage(index)}>
                        <Text style={styles.removeImageText}>×</Text>
                      </TouchableOpacity>
                    </View>
                  ))}
                </View>
              )}
            </View>
            <View style={styles.buttonContainer}>
              <TouchableOpacity onPress={() => setSelectedImage(null)} style={styles.closeButton}>
                <Text style={styles.closeButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.submitButton} onPress={onSubmitReview}>
                <Text style={styles.submitButtonText}>Send Review</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
};

const RatingsTab = ({ restoranId, refreshReviewFlag  }) => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const isFocused = useIsFocused();

  useEffect(() => {
    if (restoranId && isFocused) {
      fetchReviews();
    }
  }, [restoranId, isFocused, refreshReviewFlag]);

  const fetchReviews = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/review/byRestoran?id=${restoranId}`);
      setReviews(response.data || []);
    } catch (error) {
      console.error("Error fetching reviews:", error);
    } finally {
      setLoading(false);
    }
  };

  const parseFotoMakanan = (fotoMakanan) => {
    if (!fotoMakanan) return [];
    return fotoMakanan.split(',').map((url) =>
      url.startsWith('http') ? url : `${API_BASE_URL}${url}`
    );
  };

  if (loading) {
    return <ActivityIndicator size="large" style={{ marginTop: 20 }} />;
  }

  if (reviews.length === 0) {
    return <Text style={{ textAlign: 'center', marginTop: 20, fontFamily: 'PoppinsRegular' }}>There are no reviews yet.</Text>;
  }

  return (
    <ScrollView contentContainerStyle={{ paddingBottom: 20 }}>
      {reviews.map((review) => {
        const images = parseFotoMakanan(review.fotoMakanan);

        return (
          <View key={review.reviewId} style={styles.reviewCardContainer}>
            {/* Header User Info */}
            <View style={styles.reviewUserRow}>
              <Image
                source={require('../../assets/OnBoarding/onboarding1.png')} // ganti pake user profile
                style={styles.reviewUserImage}
              />
              <View>
                <Text style={styles.reviewUsername}>{review.createdBy || 'Anonymous'}</Text>
                <Text style={styles.reviewTimestamp}>{review.namaMakanan} | {review.formattedCreatedAtEnglish}</Text>
              </View>
            </View>

            {/* Bintang */}
            <View style={styles.reviewRatingRow}>
              {[1, 2, 3, 4, 5].map((i) => (
                <FontAwesome
                  key={i}
                  name="star"
                  size={16}
                  color={i <= review.rating ? "#FFC60D" : "#DDD"}
                  style={{ marginRight: 2 }}
                />
              ))}
              <Text style={styles.reviewRatingText}>{review.rating}/5</Text>
            </View>

            {/* Teks review */}
            <Text style={styles.reviewTextContent}>{review.reviewText}</Text>

            {/* Gambar review */}
            {images.length > 0 && (
              <View style={styles.reviewImageGallery}>
                {images.map((img, idx) => (
                  <Image key={idx} source={{ uri: img }} style={styles.reviewImage} />
                ))}
              </View>
            )}
          </View>
        );
      })}
    </ScrollView>
  );
};

const DetailHiddenGems = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { restoranId } = route.params;
  const [refreshReviewFlag, setRefreshReviewFlag] = useState(false);

  const [restaurant, setRestaurant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: 'details', title: 'Details' },
    { key: 'menu', title: 'Menu' },
    { key: 'ratings', title: 'Ratings' },
  ]);


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

  useEffect(() => {
    fetchRestaurantDetail();
  }, [restoranId]);

  const triggerRefreshReviews = () => {
    setRefreshReviewFlag(prev => !prev);
  };

  const fetchRestaurantDetail = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/resto/getById?id=${restoranId}`);
      const item = response.data.data;

      if (!item) {
        console.warn('Data restoran kosong');
        return;
      }

      setRestaurant({
        id: item.restoranId,
        name: item.namaRestoran,
        city: item.kota,
        address: item.alamat,
        latitude: item.latitude,
        longitude: item.longitude,
        openingHours: item.jamOperasional,
        phone: item.nomorTelepon,
        imageUrl: item.fotoRestoran
          ? item.fotoRestoran.startsWith('http')
            ? item.fotoRestoran
            : `${API_BASE_URL}${item.fotoRestoran}`
          : null,
      });
    } catch (error) {
      console.error('Error fetching detail:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading || !restaurant) {
    return <ActivityIndicator style={{ flex: 1 }} size="large" />;
  }

  return (
    <View style={ styles.container }>
      <HeaderBar
        searchValue=""
        onChangeSearch={() => {}}
        onPressProfile={() => navigation.navigate('DetailProfile')}
      />

      <View style={styles.scrollWrapper}>
        <Image
          source={
            restaurant.imageUrl
              ? { uri: restaurant.imageUrl }
              : require('../../assets/OnBoarding/onboarding1.png')
          }
          style={styles.restaurantImage}
          resizeMode="cover"
        />

        <TabView
          navigationState={{ index, routes }}
          renderScene={({ route }) => {
            switch (route.key) {
              case 'details':
                return <DetailsTab restaurant={restaurant} />;
              case 'menu':
                return <MenuTab restoranId={restoranId} onReviewSubmitted={triggerRefreshReviews}/>;
              case 'ratings':
                return <RatingsTab restoranId={restoranId} refreshReviewFlag={refreshReviewFlag}/>;
              default:
                return null;
            }
          }}
          onIndexChange={setIndex}
          initialLayout={initialLayout}
          renderTabBar={props => (
            <TabBar
              {...props}
              style={styles.tabBar}
              indicatorStyle={styles.tabIndicator}
              renderLabel={({ route, focused }) => (
                <Text style={[
                  styles.tabLabel, 
                  { 
                    color: focused ? '#911F1B' : '#911F1B', 
                    opacity: focused ? 1 : 0.6 
                  }
                ]}>
                  {route.title}
                </Text>
              )}
              activeColor="#911F1B" 
              inactiveColor="#911F1B"
            />
          )}
        />
      </View>
      
    </View>
  );
};

export default DetailHiddenGems;

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
  },
  restaurantImage: {
    width: '100%',
    height: 260,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
  tabBar: {
    backgroundColor: '#fff',
    elevation: 2,
  },
  tabIndicator: {
    backgroundColor: '#911F1B',
    height: 3,
  },
  tabLabel: {
    fontFamily: 'PoppinsBold',
    fontSize: 14,
  },
  tabContent: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
  },
  tabText: {
    fontFamily: 'PoppinsRegular',
    color: '#000',
    fontSize: 14
  },
  mapAddressRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  mapStyle: {
    flex: 1.2,
    height: 150,
    borderRadius: 8,
  },
  addressContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  infoBlock: {
    marginTop: 12,
  },
  label: {
    fontFamily: 'PoppinsMedium',
    marginBottom: 2,
    color: '#000',
  },
  emptyWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#f9f9f9',
    paddingTop: 8,
    paddingLeft: 12,
    paddingRight: 12,
    paddingBottom: 8
  },
  emptyText: {
    flex: 1,
    fontSize: 16,
    color: '#888',
    fontFamily: 'PoppinsRegular',
  },
  addButton: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#911F1B',
    borderRadius: 20,
    width: 38,
    height: 38,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 12,
  },
  plus: {
    fontSize: 24,
    color: '#911F1B',
    fontWeight: 'bold',
  },
  menuContainer: {
    paddingHorizontal: 8,
    paddingTop: 6,
    paddingBottom: 20,
  },
  columnWrapper: {
    justifyContent: 'space-between',
    paddingHorizontal: 8,
    marginBottom: 8,
  },
  menuCard: {
    width: '48%',
    aspectRatio: 1,
    borderRadius: 12,
    overflow: 'hidden',
    marginTop: 8,
    position: 'relative',
    elevation: 2,
  },
  menuImage: {
    width: '100%',
    height: '100%',
  },
  menuTextOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.15)',
    padding: 8,
  },
  menuName: {
    fontSize: 14,
    fontFamily: 'PoppinsMedium',
    color: '#fff',
  },
  menuPrice: {
    fontSize: 12,
    fontFamily: 'PoppinsRegular',
    color: '#fff',
  },
  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: "100%",
    backgroundColor: '#fff',
    borderRadius: 12,
    alignItems: 'center',
    paddingBottom: 16,
  },
  modalImage: {
    width: "100%",
    height: 300,
    borderRadius: 12,
  },
  modalTitle: {
    fontSize: 18,
    fontFamily: 'PoppinsMedium',
    marginTop: 10,
    color: '#000',
  },
  starRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 10,
  },
  star: {
    fontSize: 32,
    marginHorizontal: 4,
    textShadowColor: '#FF8419',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  reviewInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    width: '90%',
    height: 80,
    textAlignVertical: 'top',
    fontFamily: 'PoppinsRegular',
    marginBottom: 10,
  },
  imageUploadContainer: {
    width: '90%',
  },
  uploadButton: {
    backgroundColor: '#911F1B',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 10,
  },
  uploadButtonText: {
    color: '#fff',
    fontFamily: 'PoppinsRegular',
  },
  imagePreviewContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  imagePreviewWrapper: {
    width: 60,
    height: 60,
    marginRight: 8,
    marginBottom: 8,
    position: 'relative',
  },
  imagePreview: {
    width: '100%',
    height: '100%',
    borderRadius: 4,
  },
  removeImageButton: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: '#911F1B',
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  removeImageText: {
    color: '#fff',
    fontSize: 14,
    lineHeight: 18,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    width: '90%',
    marginTop: 10,
  },
  closeButton: {
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 100,
    marginRight: 10,
  },
  closeButtonText: {
    color: '#911F1B',
    fontFamily: 'PoppinsMedium',
  },
  submitButton: {
    backgroundColor: '#911F1B',
    paddingVertical: 5,
    paddingHorizontal: 20,
    borderRadius: 100,
  },
  submitButtonText: {
    color: '#fff',
    fontFamily: 'PoppinsMedium',
  },
  reviewCardContainer: {
    marginHorizontal: 16,
    marginVertical: 10,
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 15,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 3,
    elevation: 2,
  },
  reviewUserRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },
  reviewUserImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  reviewUsername: {
    fontFamily: 'PoppinsMedium',
    fontSize: 14
  },
  reviewTimestamp: {
    fontSize: 12,
    color: "#888",
    fontFamily: 'PoppinsRegular'
  },
  reviewRatingRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 5,
  },
  reviewRatingText: {
    marginLeft: 5,
    color: "#555",
    fontFamily: 'PoppinsRegular',
    fontSize: 10
  },
  reviewTextContent: {
    marginBottom: 10,
    fontSize: 13,
    fontFamily: 'PoppinsRegular',
  },
  reviewImageGallery: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 5,
  },
  reviewImage: {
    width: 100,
    height: 100,
    borderRadius: 6,
    marginRight: 5,
  },
});
