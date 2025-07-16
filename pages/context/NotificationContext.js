import React, { createContext, useEffect, useState, useContext } from 'react';
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';
import * as Notifications from 'expo-notifications';
import { AuthContext } from './AuthContext';
import { API_BASE_URL } from '../../api';

export const NotificationContext = createContext();

const NotificationProvider = ({ children }) => {
  const { username } = useContext(AuthContext);
  const [chatCount, setChatCount] = useState(0);
  const [reviewCount, setReviewCount] = useState(0);
  const [accountNotification, setAccountNotification] = useState(false);
  const [client, setClient] = useState(null);

  useEffect(() => {
    if (username) {
      connectWebSocket();
      fetchInitialNotifications();
    }

    return () => {
      if (client) client.deactivate();
    };
  }, [username]);

  const connectWebSocket = () => {
    const stompClient = new Client({
      webSocketFactory: () => new SockJS(`${API_BASE_URL}/ws`),
      reconnectDelay: 5000,
      onConnect: () => {
        stompClient.subscribe(`/topic/notifications/${username}`, (message) => {
          const notif = JSON.parse(message.body);
          handleIncomingNotification(notif);
        });
      },
    });

    stompClient.activate();
    setClient(stompClient);
  };

  const handleIncomingNotification = (notif) => {
    Notifications.scheduleNotificationAsync({
      content: {
        title: notif.title || 'Notifikasi Baru',
        body: notif.message || 'Ada pesan baru untukmu!',
        sound: 'default',
      },
      trigger: null,
    });

    if (notif.type === 'chat') {
      setChatCount(prev => prev + 1);
    } else if (notif.type === 'review') {
      setReviewCount(prev => prev + 1);
    } else if (notif.type === 'account') {
      setAccountNotification(true);
    }
  };

  const fetchInitialNotifications = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/notifications/${username}`);
      const data = await res.json();

      setChatCount(data.filter(n => n.type === 'chat' && !n.read).length);
      setReviewCount(data.filter(n => n.type === 'review' && !n.read).length);
      setAccountNotification(data.some(n => n.type === 'account' && !n.read));
    } catch (error) {
      console.error('Failed to fetch notifications:', error.message);
    }
  };

  const resetChatCount = () => setChatCount(0);
  const resetReviewCount = () => setReviewCount(0);
  const resetAccountNotification = () => setAccountNotification(false);

  return (
    <NotificationContext.Provider value={{
      chatCount,
      reviewCount,
      accountNotification,
      setChatCount,
      setReviewCount,
      setAccountNotification,
      resetChatCount,
      resetReviewCount,
      resetAccountNotification
    }}>
      {children}
    </NotificationContext.Provider>
  );
};

export default NotificationProvider;
