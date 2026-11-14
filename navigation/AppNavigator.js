
import React from 'react';

import {
  Text,
  Platform,
} from 'react-native';

import {
  NavigationContainer,
} from '@react-navigation/native';

import {
  createBottomTabNavigator,
} from '@react-navigation/bottom-tabs';

import HomeScreen from '../screens/HomeScreen';
import CropsScreen from '../screens/CropsScreen';
import FieldsScreen from '../screens/FieldsScreen';
import ActivitiesScreen from '../screens/ActivitiesScreen';
import HarvestScreen from '../screens/HarvestScreen';

const Tab = createBottomTabNavigator();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={{
          headerShown: false,

          tabBarActiveTintColor: '#1B5E20',
          tabBarInactiveTintColor: '#888888',

          tabBarStyle: {
            backgroundColor: '#FFFFFF',
            borderTopColor: '#E0E0E0',
            borderTopWidth: 1,

            // Extra room for Android system navigation
            height: Platform.OS === 'android' ? 90 : 65,

            paddingTop: 8,
            paddingBottom:
              Platform.OS === 'android' ? 30 : 8,
          },

          tabBarLabelStyle: {
            fontSize: 11,
            fontWeight: '600',
          },

          tabBarIconStyle: {
            marginBottom: 2,
          },
        }}
      >
        <Tab.Screen
          name="Home"
          component={HomeScreen}
          options={{
            tabBarIcon: () => (
              <Text style={{ fontSize: 21 }}>🏠</Text>
            ),
          }}
        />

        <Tab.Screen
          name="Crops"
          component={CropsScreen}
          options={{
            tabBarIcon: () => (
              <Text style={{ fontSize: 21 }}>🌾</Text>
            ),
          }}
        />

        <Tab.Screen
          name="Fields"
          component={FieldsScreen}
          options={{
            tabBarIcon: () => (
              <Text style={{ fontSize: 21 }}>🚜</Text>
            ),
          }}
        />

        <Tab.Screen
          name="Activities"
          component={ActivitiesScreen}
          options={{
            tabBarIcon: () => (
              <Text style={{ fontSize: 21 }}>📅</Text>
            ),
          }}
        />

        <Tab.Screen
          name="Harvest"
          component={HarvestScreen}
          options={{
            tabBarIcon: () => (
              <Text style={{ fontSize: 21 }}>📦</Text>
            ),
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
