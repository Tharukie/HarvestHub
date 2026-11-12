
import React from 'react';
import { Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

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
          tabBarInactiveTintColor: '#888',
          tabBarStyle: {
            height: 65,
            paddingBottom: 8,
            paddingTop: 5,
          },
          tabBarLabelStyle: {
            fontSize: 11,
          },
        }}
      >
        <Tab.Screen
          name="Home"
          component={HomeScreen}
          options={{
            tabBarIcon: () => <Text>🏠</Text>,
          }}
        />

        <Tab.Screen
          name="Crops"
          component={CropsScreen}
          options={{
            tabBarIcon: () => <Text>🌾</Text>,
          }}
        />

        <Tab.Screen
          name="Fields"
          component={FieldsScreen}
          options={{
            tabBarIcon: () => <Text>🚜</Text>,
          }}
        />

        <Tab.Screen
          name="Activities"
          component={ActivitiesScreen}
          options={{
            tabBarIcon: () => <Text>📅</Text>,
          }}
        />

        <Tab.Screen
          name="Harvest"
          component={HarvestScreen}
          options={{
            tabBarIcon: () => <Text>📦</Text>,
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
