import React, { useContext } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import { NotificationContext } from '../context/NotificationContext';

// Import screen components
import HomePage from '../Home/HomePage';
import HiddenGems from '../Home/HiddenGems';
import TasteBuds from '../Home/TasteBuds';
import DetailHiddenGems from '../Home/DetailHiddenGems';

import Culinary from '../Culinary/Culinary';
import AddCulinary from '../Culinary/AddCulinary';
import DetailCulinary from '../Culinary/DetailCulinary';

import AddRestoran from '../Restoran/Add';
import PickLocation from '../LocationMaps/PickLocation';

import Community from '../Community/Community';

import Profile from '../Profile/Profile';
import DetailProfile from '../Profile/DetailProfile';
import HiddenGems from '../Home/HiddenGems';
import DetailHiddenGems from '../Home/DetailHiddenGems';
import MyFavorites from '../Culinary/MyFavorites';
import PickLocation from '../LocationMaps/PickLocation';
import TasteBuds from '../Home/TasteBuds';
import CreatePost from '../Community/CreatePost';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

// --- Home Stack ---
function HomeStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="HomePage" component={HomePage} />
      <Stack.Screen name="HiddenGems" component={HiddenGems} />
      <Stack.Screen name="TasteBuds" component={TasteBuds} />
      <Stack.Screen name="DetailHiddenGems" component={DetailHiddenGems} />
    </Stack.Navigator>
  );
}

// --- Culinary Stack ---
function CulinaryStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Culinary" component={Culinary} />
      <Stack.Screen name='AddCulinary' component={AddCulinary}/>
      <Stack.Screen name='DetailCulinary' component={DetailCulinary}/>
      <Stack.Screen name='PickLocation' component={PickLocation}/>
      <Stack.Screen name="TasteBuds" component={TasteBuds} />
      <Stack.Screen name="MyFavorites" component={MyFavorites} />
    </Stack.Navigator>
  );
}

// --- Community Stack ---
function CommunityStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="CommunityTab" component={Community} />
      <Stack.Screen name="CreatePost" component={CreatePost} />
    </Stack.Navigator>
  );
}

// --- Profile Stack ---
function ProfileStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="ProfileMain" component={Profile} />
      <Stack.Screen name="DetailProfile" component={DetailProfile} />
    </Stack.Navigator>
  );
}

// --- Main Tab Navigation ---
export default function MenuTab() {
  const { chatCount, reviewCount, accountNotification } = useContext(NotificationContext);

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
        tabBarActiveTintColor: '#911F1B',
        tabBarInactiveTintColor: 'gray',
        headerShown: false,
      })}
    >
      <Tab.Screen name="Home" component={HomeStack} />
      <Tab.Screen
        name="Culinary"
        component={CulinaryStack}
        options={{
          tabBarBadge: reviewCount > 0 ? reviewCount : null,
        }}
      />
      <Tab.Screen
        name="Community"
        component={CommunityStack}
        options={{
          tabBarBadge: chatCount > 0 ? chatCount : null,
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileStack}
        options={{
          tabBarBadge: accountNotification ? '!' : null,
        }}
      />
    </Tab.Navigator>
  );
}
