import React, { useEffect, useState } from 'react';
import { useNavigation, useFocusEffect  } from '@react-navigation/native';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Image,
  SafeAreaView,
  ActivityIndicator,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { API_BASE_URL } from '../../api';
import i18n from '../i18n';

const Community = () => {
  const navigation = useNavigation();
  const [activeTab, setActiveTab] = useState('foryou');
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    React.useCallback(() => {
      fetchPosts();
    }, [])
  );

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      fetchPosts();
    });

    return unsubscribe;
  }, [navigation]);


  const fetchPosts = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/community/posts`);
      const data = await res.json();
      setPosts(data);
    } catch (err) {
      console.error('❌ Error fetching posts:', err);
    } finally {
      setLoading(false);
    }
  };


  const getTimeAgo = (isoDate) => {
  const now = new Date();
  const date = new Date(isoDate);
  const diffInMs = now - date; // selisih dalam milidetik
  const diffInSec = Math.floor(diffInMs / 1000); // konversi ke detik
  const diffInMin = Math.floor(diffInSec / 60); // konversi ke menit

  if (diffInSec < 5) {
    return `${i18n.t('justNow')}`;
  }
  if (diffInSec < 60) {
    return `${diffInSec} ${i18n.t('seconds')}`;
  }
  if (diffInMin < 60) {
    return `${diffInMin} ${i18n.t('minutes')}`;
  }
  if (diffInMin < 1440) {
    return `${Math.floor(diffInMin / 60)} ${i18n.t('hours')}`;
  }
  return `${Math.floor(diffInMin / 1440)} ${i18n.t('days')}`;
};

  const renderPost = ({ item }) => (
    <View style={styles.postContainer}>
      <View style={styles.row}>
        <Image
          source={{ uri: `${API_BASE_URL}/community/uploads/${item.user.avatar}` }}
          style={styles.avatar}
        />
        <Text style={styles.name}>{item.user.name}</Text>

        <View style={styles.textContainer}>
          <Text style={styles.name}>{item.user}</Text>
          <Text style={styles.time}>{getTimeAgo(item.createdAt)}</Text>
        </View>
      </View>

      <Text style={styles.content}>{item.content}</Text>

      {item.images?.length > 0 && (
        <View style={styles.imageRow}>
          {item.images.map((img, idx) => (
            <Image
              key={idx}
              source={{ uri: `${API_BASE_URL}${img}` }}
              style={styles.postImage}
            />
          ))}
        </View>
      )}
    </View>
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.headerWrapper}>
          <Image
            source={require('../../assets/ic_maskot.png')}
            style={styles.maskotIcon}
          />
          <Text style={styles.headerTitle}>{i18n.t('communityTitle')}</Text>
        </View>

        <View style={styles.tabContainer}></View>
        {loading ? (
          <ActivityIndicator size="large" color="#E95322" style={{ marginTop: 40 }} />
        ) : (
          <FlatList
            data={posts}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderPost}
            showsVerticalScrollIndicator={false}
          />
        )}

        {/* FAB */}
        <TouchableOpacity
          style={styles.fab}
          onPress={() => navigation.navigate('CreatePost')}
        >
          <Icon name="edit" size={20} color="#fff" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default Community;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 16,
  },
  headerWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
  },
  maskotIcon: {
    width: 24,
    height: 24,
    marginRight: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'red',
    alignSelf: 'center',
    marginVertical: 12,
  },
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    borderBottomWidth: 1,
    borderColor: '#ccc',
    marginBottom: 8,
  },
  tabText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#aaa',
    marginHorizontal: 16,
    paddingVertical: 8,
  },
  activeTabText: {
    color: 'red',
    borderBottomWidth: 2,
    borderBottomColor: 'red',
  },
  postContainer: {
    marginBottom: 20,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderColor: '#eee',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 38,
    height: 38,
    borderRadius: 19,
    marginRight: 10,
  },
  textContainer: {
    flex: 1,
  },
  name: {
    fontWeight: 'bold',
    fontSize: 14,
  },
  time: {
    fontSize: 12,
    color: '#888',
  },
  content: {
    marginTop: 8,
    fontSize: 14,
    lineHeight: 20,
  },
  imageRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 8,
  },
  postImage: {
    width: 100,
    height: 100,
    borderRadius: 8,
    marginRight: 8,
    marginBottom: 8,
  },
  footer: {
    marginTop: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  footerText: {
    fontSize: 13,
    color: '#666',
  },
  fab: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#E95322',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
  },
});
