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
  ScrollView,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import Icon from 'react-native-vector-icons/Feather';
import { API_BASE_URL } from '../../api';
import i18n from '../i18n';

const CreatePost = ({ navigation }) => {
  const [postText, setPostText] = useState('');
  const [images, setImages] = useState([]);

  const handleOpenPicker = () => {
    Alert.alert(`${i18n.t('chooseImage')}`, `${i18n.t('chooseImageQuestion')}`, [
      { text: `${i18n.t('buttonCamera')}`, onPress: handlePickFromCamera },
      { text: `${i18n.t('buttonGallery')}`, onPress: handlePickFromGallery },
      { text: `${i18n.t('buttonCancel')}`, style: 'cancel' },
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
      allowsMultipleSelection: true,
      quality: 1,
      selectionLimit: 5,
    });

    if (!result.canceled) {
      const newImages = result.assets.map((asset) => asset.uri);
      setImages((prevImages) => [...prevImages, ...newImages]);
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
      quality: 1,
    });

    if (!result.canceled) {
      setImages((prevImages) => [...prevImages, result.assets[0].uri]);
    }
  };

  const removeImage = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

    const handleSubmit = async () => {
        if (!postText && images.length === 0) {
            alert(`${i18n.t('emptyAlert')}`);
            return;
        }

        try {
            let imageUrls = [];

          
            if (images.length > 0) {
            const formData = new FormData();
            images.forEach((uri, index) => {
                const filename = uri.split('/').pop();
                const match = /\.(\w+)$/.exec(filename);
                const type = match ? `image/${match[1]}` : `image`;

                formData.append('images', {
                uri,
                name: filename || `image${index}.jpg`,
                type,
                });
            });

            const uploadResponse = await fetch(`${API_BASE_URL}/community/upload`, {
                method: 'POST',
                body: formData,
            });

            const uploadResult = await uploadResponse.json();
            if (!Array.isArray(uploadResult)) {
                throw new Error('Upload gagal atau format respons salah');
            }

            imageUrls = uploadResult.map(item => item.url);
            }

            const postData = {
            userId: 1,
            content: postText,
            imageUrls: imageUrls,
            };

            const postResponse = await fetch(`${API_BASE_URL}/community/create`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(postData),
            });

            const postResult = await postResponse.json();
            if (postResult.status === 200) {
              navigation.navigate('CommunityTab');
            }
            else {
              alert('Gagal: ' + postResult.message);
            }

        } catch (error) {
            console.error('Submit error:', error);
            alert('Terjadi kesalahan saat membuat post');
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
          <Text style={styles.headerTitle}>{i18n.t('postTitle')}</Text>
          <TouchableOpacity onPress={handleSubmit}>
            <Text style={styles.sendButton}>{i18n.t('buttonSend')}</Text>
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
            placeholder={i18n.t('postPlaceHolder')}
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

          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {images.map((uri, index) => (
              <TouchableOpacity key={index} onPress={() => removeImage(index)}>
                <Image source={{ uri }} style={styles.foodImage} />
              </TouchableOpacity>
            ))}
          </ScrollView>
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
    width: 100,
    height: 100,
    borderRadius: 12,
    marginRight: 10,
  },
});
