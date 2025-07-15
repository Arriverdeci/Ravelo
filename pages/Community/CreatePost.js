import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
  SafeAreaView,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import Icon from 'react-native-vector-icons/Feather';

const CreatePost = ({ navigation }) => {
  const [postText, setPostText] = useState('');
  const [imageUri, setImageUri] = useState(null);
  const [images, setImages] = useState([]);

  const handleOpenPicker = () => {
    Alert.alert('Pilih Gambar', 'Ambil gambar dari mana?', [
      { text: 'Kamera', onPress: handlePickFromCamera },
      { text: 'Galeri', onPress: handlePickFromGallery },
      { text: 'Batal', style: 'cancel' },
    ]);
  };

  const handlePickFromGallery = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      alert('Izin akses galeri ditolak');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
    }
  };

  const handlePickFromCamera = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      alert('Izin akses kamera ditolak');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Icon name="arrow-left" size={24} color="#000" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Postingan</Text>
          <TouchableOpacity>
            <Text style={styles.sendButton}>Send</Text>
          </TouchableOpacity>
        </View>

        {/* Input */}
        <View style={styles.inputRow}>
          <Image
            source={{ uri: 'https://randomuser.me/api/portraits/men/32.jpg' }}
            style={styles.avatar}
          />
          <TextInput
            style={styles.input}
            placeholder="Write something..."
            value={postText}
            onChangeText={setPostText}
            multiline
          />
        </View>

        {/* Image Picker */}
        <View style={styles.imageRow}>
          <TouchableOpacity style={styles.cameraButton} onPress={handleOpenPicker}>
            <Icon name="camera" size={24} color="#E95322" />
          </TouchableOpacity>
          {imageUri && (
            <Image source={{ uri: imageUri }} style={styles.foodImage} />
          )}
        </View>
      </View>
    </SafeAreaView>
  );
};

export default CreatePost;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#911F1B',
  },
  sendButton: {
    backgroundColor: '#911F1B',
    color: '#fff',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    fontSize: 14,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: 20,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginRight: 8,
  },
  input: {
    flex: 1,
    minHeight: 60,
    fontSize: 16,
    paddingTop: 8,
  },
  imageRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
  },
  cameraButton: {
    backgroundColor: '#FFE8E5',
    padding: 10,
    borderRadius: 12,
    marginRight: 10,
  },
  foodImage: {
    width: 120,
    height: 120,
    borderRadius: 12,
  },
});
