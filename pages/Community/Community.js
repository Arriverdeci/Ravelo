import React, { useState } from 'react';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Image,
  SafeAreaView
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

const Community = () => {
  const navigation = useNavigation();
  const [activeTab, setActiveTab] = useState('foryou');

  const posts = [
    {
      id: '1',
      user: 'M Rifqi Alim',
      time: '1 jam yang lalu',
      content: 'Pernah waktu smp aku bingung banget rasanya...',
      likes: '125.000',
      comments: '1.000',
      avatar: require('../../assets/ic_avatar.jpg')
    },
  ];

  const renderPost = ({ item }) => (
    <View style={styles.postContainer}>
      <View style={styles.row}>
        <Image source={item.avatar} style={styles.avatar} />
        <View style={styles.textContainer}>
          <Text style={styles.name}>{item.user}</Text>
          <Text style={styles.time}>{item.time}</Text>
        </View>
      </View>
      <Text style={styles.content}>{item.content}</Text>
    </View>
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      <View style={styles.container}>
        <View style={styles.headerWrapper}>
          <Image 
            source={require('../../assets/ic_maskot.png')}
            style={styles.maskotIcon}
          />
          <Text style={styles.headerTitle}>Community</Text>
        </View>

        {/* Tab */}
        <View style={styles.tabContainer}>
          <TouchableOpacity onPress={() => setActiveTab('foryou')}>
            <Text
              style={[
                styles.tabText,
                activeTab === 'foryou' && styles.activeTabText,
              ]}
            >
              For You
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setActiveTab('recommendation')}>
            <Text
              style={[
                styles.tabText,
                activeTab === 'recommendation' && styles.activeTabText,
              ]}
            >
              Recommendation
            </Text>
          </TouchableOpacity>
        </View>

        <FlatList
          data={posts}
          keyExtractor={(item) => item.id}
          renderItem={renderPost}
          showsVerticalScrollIndicator={false}
        />

        {/* Floating Action Button */}
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
  moreIcon: {
    padding: 6,
  },
  content: {
    marginTop: 8,
    fontSize: 14,
    lineHeight: 20,
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

  headerWrapper: {
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'center', // biar di tengah container
  marginTop: 16,
  },

  maskotIcon: {
    width: 24,
    height: 24,
    marginRight: 8,
  },
});
