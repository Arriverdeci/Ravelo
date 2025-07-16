import React, { useContext, useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { AuthContext } from '../context/AuthContext';
import { API_BASE_URL } from '../../api';
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';
import * as Notifications from 'expo-notifications'; // ✅ Tambah ini
import * as Device from 'expo-device';

const NotificationScreen = () => {
  const navigation = useNavigation();
  const { username } = useContext(AuthContext);
  const [notifications, setNotifications] = useState([]);
  const client = useRef(null);

  useEffect(() => {
    if (username) {
      fetchNotifications();
      setupNotificationPermission(); // ✅ minta izin push notification

      const socket = new SockJS(`${API_BASE_URL}/ws`);
      client.current = new Client({
        webSocketFactory: () => socket,
        onConnect: () => {
          client.current.subscribe(`/topic/notifications/${username}`, (message) => {
            const notif = JSON.parse(message.body);
            setNotifications((prev) => [notif, ...prev]);

            // ✅ Tampilkan push notification
            Notifications.scheduleNotificationAsync({
              content: {
                title: notif.title || 'Notifikasi Baru',
                body: notif.message || 'Anda memiliki pesan baru',
                sound: 'default',
              },
              trigger: null, // tampilkan langsung
            });
          });
        },
      });

      client.current.activate();

      return () => {
        if (client.current) {
          client.current.deactivate();
        }
      };
    }
  }, [username]);

  // ✅ Minta izin push notification dari pengguna
  const setupNotificationPermission = async () => {
    if (Device.isDevice) {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      if (finalStatus !== 'granted') {
        alert('Izin notifikasi tidak diberikan.');
        return;
      }
    }
  };

  const fetchNotifications = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/notifications/${username}`);
      if (!response.ok) {
        throw new Error('Gagal mengambil data notifikasi');
      }
      const data = await response.json();
      setNotifications(data);
    } catch (error) {
      console.error('Error fetching notifications:', error.message);
    }
  };

  const markAsRead = async (id) => {
    try {
      await fetch(`${API_BASE_URL}/api/notifications/${id}/read`, {
        method: 'PUT',
      });
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, read: true } : n))
      );
    } catch (error) {
      console.error('Failed to mark as read:', error);
    }
  };

  const handleNotificationPress = (notification) => {
    if (!notification || !notification.id) return;
    markAsRead(notification.id);
  };

  const renderNotificationItem = (item, index) => {
    return (
      <TouchableOpacity
        key={index}
        style={[styles.notificationItem, !item.read && styles.unreadNotification]}
        onPress={() => handleNotificationPress(item)}
      >
        <View style={styles.notificationContent}>
          <View style={styles.iconContainer}>
            <Ionicons
              name={'notifications-outline'}
              size={20}
              color={!item.read ? '#911F1B' : '#666666'}
            />
          </View>
          <View style={styles.textContainer}>
            <Text style={[styles.notificationTitle, !item.read && styles.unreadTitle]}>
              {item.title}
            </Text>
            <Text style={styles.notificationMessage} numberOfLines={2}>
              {item.message}
            </Text>
          </View>
          <View style={styles.timeContainer}>
            <Text style={styles.timeText}>
              {new Date(item.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#1A1A1A" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Notifikasi</Text>
        <View style={{ width: 24 }} />
      </View>
      <ScrollView style={styles.scrollView}>
        {notifications.length === 0 ? (
          <Text style={{ textAlign: 'center', marginTop: 30, color: '#999' }}>
            Tidak ada notifikasi.
          </Text>
        ) : (
          notifications.map((item, index) => renderNotificationItem(item, index))
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: '#911F1B' },
  scrollView: { flex: 1, padding: 10 },
  notificationItem: {
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderBottomColor: '#EEE',
    padding: 12,
    borderRadius: 6,
    marginBottom: 8,
  },
  unreadNotification: { backgroundColor: '#FFF8F8' },
  notificationContent: { flexDirection: 'row', alignItems: 'center' },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F0F0F0',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  textContainer: { flex: 1 },
  notificationTitle: { fontSize: 14, fontWeight: 'bold', color: '#1A1A1A' },
  unreadTitle: { color: '#911F1B' },
  notificationMessage: { fontSize: 12, color: '#666' },
  timeContainer: { marginLeft: 10 },
  timeText: { fontSize: 11, color: '#999' },
});

export default NotificationScreen;
