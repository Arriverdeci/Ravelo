import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';

import HomePage from '../Home/HomePage';
import Culinary from '../Culinary/Culinary';
import Community from '../Community/Community';
import Profile from '../Profile/Profile';
import HiddenGems from '../Home/HiddenGems';
import DetailHiddenGems from '../Home/DetailHiddenGems';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

// Stack Navigator untuk Home tab (termasuk HiddenGems)
function HomeStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="HomePage" component={HomePage} />
      <Stack.Screen name="HiddenGems" component={HiddenGems} />
      <Stack.Screen name="DetailHiddenGems" component={DetailHiddenGems} />
    </Stack.Navigator>
  );
}

// Stack Navigator untuk Culinary tab (jika ada sub-pages)
function CulinaryStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Culinary" component={Culinary} />
      {/* Tambahkan screen lain untuk Culinary jika diperlukan */}
    </Stack.Navigator>
  );
}

// Stack Navigator untuk Community tab (jika ada sub-pages)
function CommunityStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Community" component={Community} />
      {/* Tambahkan screen lain untuk Community jika diperlukan */}
    </Stack.Navigator>
  );
}

// Stack Navigator untuk Profile tab (jika ada sub-pages)
function ProfileStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Profile" component={Profile} />
      {/* Tambahkan screen lain untuk Profile jika diperlukan */}
    </Stack.Navigator>
  );
}

export default function MenuTab() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size, focused }) => {
          let iconName;

          if (route.name === 'HomePage') {
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
      <Tab.Screen name="HomePage" component={HomeStack} />
      <Tab.Screen name="Culinary" component={CulinaryStack} />
      <Tab.Screen name="Community" component={CommunityStack} />
      <Tab.Screen name="Profile" component={ProfileStack} />
    </Tab.Navigator>
  );
}