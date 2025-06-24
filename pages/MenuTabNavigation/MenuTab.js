import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

import HomePage from '../Home/HomePage';
import Culinary from '../Culinary/Culinary';
import Community from '../Community/Community';
import Profile from '../Profile/Profile';

import AddRestoran from '../Restoran/Add';

const Tab = createBottomTabNavigator();

export default function MenuTab() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size, focused }) => {
          let iconName;

          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Culinary') {
            iconName = focused ? 'restaurant' : 'restaurant-outline';
          } else if (route.name === 'Community') {
            iconName = focused ? 'chatbubble' : 'chatbubble-outline';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'person' : 'person-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#007AFF',
        tabBarInactiveTintColor: 'gray',
        headerShown: false,
      })}
    >
      <Tab.Screen name="Home" component={HomePage} />
      {/* <Tab.Screen name="Culinary" component={Culinary} /> */}
      <Tab.Screen name='AddRestoran' component={AddRestoran}/>
      <Tab.Screen name="Community" component={Community} />
      <Tab.Screen name="Profile" component={Profile} />
    </Tab.Navigator>
  );
}
