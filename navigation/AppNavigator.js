import React from 'react';
import { Text, Platform, TouchableOpacity } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../screens/HomeScreen';
import CropsScreen from '../screens/CropsScreen';
import FieldsScreen from '../screens/FieldsScreen';
import ActivitiesScreen from '../screens/ActivitiesScreen';
import HarvestScreen from '../screens/HarvestScreen';
import SmartAssistantScreen from '../screens/SmartAssistantScreen';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function HomeStack() {
  return (
    <Stack.Navigator screenOptions={{ headerTintColor: '#1B5E20', headerStyle: { backgroundColor: '#F1F8E9' } }}>
      <Stack.Screen
        name="Dashboard"
        component={HomeScreen}
        options={({ navigation }) => ({
          headerShown: true,
          title: 'HarvestHub',
          headerRight: () => (
            <TouchableOpacity onPress={() => navigation.navigate('SmartAssistant')} accessibilityRole="button" style={{ padding: 8 }}>
              <Text style={{ color: '#1B5E20', fontWeight: '700', fontSize: 14 }}>🌿 Insights</Text>
            </TouchableOpacity>
          ),
        })}
      />
      <Stack.Screen name="SmartAssistant" component={SmartAssistantScreen} options={{ title: 'Smart Farm Assistant' }} />
    </Stack.Navigator>
  );
}

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
            height: Platform.OS === 'android' ? 90 : 65,
            paddingTop: 8,
            paddingBottom: Platform.OS === 'android' ? 30 : 8,
          },
          tabBarLabelStyle: { fontSize: 11, fontWeight: '600' },
          tabBarIconStyle: { marginBottom: 2 },
        }}
      >
        <Tab.Screen name="Home" component={HomeStack} options={{ tabBarIcon: () => <Text style={{ fontSize: 21 }}>🏠</Text> }} />
        <Tab.Screen name="Crops" component={CropsScreen} options={{ tabBarIcon: () => <Text style={{ fontSize: 21 }}>🌾</Text> }} />
        <Tab.Screen name="Fields" component={FieldsScreen} options={{ tabBarIcon: () => <Text style={{ fontSize: 21 }}>🚜</Text> }} />
        <Tab.Screen name="Activities" component={ActivitiesScreen} options={{ tabBarIcon: () => <Text style={{ fontSize: 21 }}>📅</Text> }} />
        <Tab.Screen name="Harvest" component={HarvestScreen} options={{ tabBarIcon: () => <Text style={{ fontSize: 21 }}>📦</Text> }} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
