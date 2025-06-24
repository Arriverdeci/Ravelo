
import React from 'react';
import {
  View,
  Image,
  TextInput,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';

const HeaderBar = ({
  searchValue,
  onChangeSearch,
  onPressProfile,
  onPressNotif,
  onPressFilter,
}) => {
  return (
    <View style={styles.wrapper}>
      {/* Header */}
      <View style={styles.header}>
        <Image
          source={require('../../assets/logo_atas_ravelo.png')}
          style={styles.logo}
          resizeMode="contain"
        />
        <View style={{ flex: 1 }} />
        <TouchableOpacity onPress={onPressProfile}>
          <Image
            source={require('../../assets/profile.png')}
            style={styles.profileIcon}
          />
        </TouchableOpacity>
        <TouchableOpacity style={styles.notifContainer} onPress={onPressNotif}>
          <Image
            source={require('../../assets/ic_notif.png')}
            style={styles.notifIcon}
          />
        </TouchableOpacity>
      </View>

      {/* Search & Filter */}
      <View style={styles.searchFilter}>
        <View style={styles.searchBar}>
          <Image
            source={require('../../assets/ic_search.png')}
            style={styles.searchIcon}
          />
          <TextInput
            style={styles.searchInput}
            placeholder="Search Food/Restaurant"
            placeholderTextColor="#9E9E9E"
            value={searchValue}
            onChangeText={onChangeSearch}
          />
        </View>
        <TouchableOpacity style={styles.filterButton} onPress={onPressFilter}>
          <Image
            source={require('../../assets/ic_filter.png')}
            style={styles.filterIcon}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default HeaderBar;

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: '#911F1B',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 24,
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  logo: {
    width: 150,
    height: 55,
  },
  profileIcon: {
    width: 47,
    height: 50,
    marginRight: 10,
    resizeMode: 'contain',
  },
  notifContainer: {
    width: 48,
    height: 42,
    backgroundColor: '#E6020B',
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notifIcon: {
    width: 20,
    height: 20,
    tintColor: 'white',
  },
  searchFilter: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 10,
    paddingHorizontal: 16,
  },
  searchBar: {
    flex: 1,
    height: 37,
    backgroundColor: '#FFF',
    borderRadius: 20,
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 10,
  },
  searchIcon: {
    width: 16,
    height: 16,
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: '100%',
    color: '#000',
    fontFamily: 'PoppinsLight',
    fontSize: 14,
  },
  filterButton: {
    width: 47,
    height: 40,
    backgroundColor: '#E6020B',
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  filterIcon: {
    width: 20,
    height: 20,
    tintColor: '#fff',
  },
});
