import React from 'react';
import {
  View,
  Image,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Text,
} from 'react-native';
import i18n from '../i18n';

const HeaderBar = ({
  searchValue,
  onChangeSearch,
  onPressProfile,
  onPressNotif,
  onPressLanguage,
  unreadCount = 0, // badge count
}) => {
  return (
    <View style={styles.wrapper}>
      {/* Header */}
      <View style={styles.header}>
        <Image
          source={require('../../assets/OnBoarding/logo_atas_ravelo.png')}
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
          {unreadCount > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>
                {unreadCount > 9 ? '9+' : unreadCount}
              </Text>
            </View>
          )}
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
            placeholder={i18n.t('searchPlaceholder')}
            placeholderTextColor="#9E9E9E"
            value={searchValue}
            onChangeText={onChangeSearch}
          />
        </View>
        <TouchableOpacity style={styles.filterButton} onPress={onPressLanguage}>
          <Image
            source={require('../../assets/ic_language.png')}
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
    position: 'relative',
  },
  notifIcon: {
    width: 20,
    height: 20,
    tintColor: 'white',
  },
  badge: {
    position: 'absolute',
    top: -4,
    right: -4,
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
    borderWidth: 1,
    borderColor: '#E6020B',
  },
  badgeText: {
    color: '#E6020B',
    fontSize: 10,
    fontWeight: 'bold',
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
    marginRight: 6,
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