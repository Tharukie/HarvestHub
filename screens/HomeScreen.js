
import React, { useState, useCallback } from 'react';

import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';

import { useFocusEffect } from '@react-navigation/native';

import {
  getAllCrops,
  getAllFields,
  getAllActivities,
  getAllHarvests,
} from '../database/database';

export default function HomeScreen({ navigation }) {

  // Dashboard data
  const [totalCrops, setTotalCrops] = useState(0);
  const [totalFields, setTotalFields] = useState(0);
  const [totalActivities, setTotalActivities] = useState(0);
  const [totalHarvests, setTotalHarvests] = useState(0);
  const [totalQuantity, setTotalQuantity] = useState(0);

  // Load latest records from local database
  const loadDashboard = useCallback(() => {

    const crops = getAllCrops();
    const fields = getAllFields();
    const activities = getAllActivities();
    const harvests = getAllHarvests();

    // Count records
    setTotalCrops(crops.length);
    setTotalFields(fields.length);
    setTotalActivities(activities.length);
    setTotalHarvests(harvests.length);

    // Calculate total harvested quantity
    const quantity = harvests.reduce(
      (sum, harvest) =>
        sum + Number(harvest.quantity || 0),
      0
    );

    setTotalQuantity(quantity);

  }, []);

  // Automatically refresh when Home tab opens
  useFocusEffect(
    useCallback(() => {
      loadDashboard();
    }, [loadDashboard])
  );

  // Dashboard summary card
  const DashboardCard = ({
    title,
    value,
    icon,
    color,
    onPress,
  }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <View
        style={[
          styles.iconContainer,
          { backgroundColor: color + '20' },
        ]}
      >
        <Ionicons
          name={icon}
          size={27}
          color={color}
        />
      </View>

      <Text style={styles.cardValue}>
        {value}
      </Text>

      <Text style={styles.cardTitle}>
        {title}
      </Text>
    </TouchableOpacity>
  );

  // Navigation shortcut
  const QuickAction = ({ title, icon, screen }) => (
    <TouchableOpacity
      style={styles.actionButton}
      onPress={() => navigation.navigate(screen)}
    >
      <Ionicons
        name={icon}
        size={22}
        color="#2E7D32"
      />

      <Text style={styles.actionText}>
        {title}
      </Text>

      <Ionicons
        name="chevron-forward"
        size={18}
        color="#777777"
      />
    </TouchableOpacity>
  );

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
    >

      {/* HEADER */}
      <View style={styles.header}>
        <View>
          <Text style={styles.welcome}>
            Welcome to HarvestHub!
          </Text>

          <Text style={styles.subtitle}>
            Your Smart Farm Management Dashboard
          </Text>
        </View>

        <Ionicons
          name="leaf"
          size={38}
          color="#FFFFFF"
        />
      </View>

      {/* SECTION TITLE */}
      <Text style={styles.sectionTitle}>
        Farm Overview
      </Text>

      {/* DASHBOARD CARDS */}
      <View style={styles.cardGrid}>

        <DashboardCard
          title="Total Crops"
          value={totalCrops}
          icon="leaf-outline"
          color="#2E7D32"
          onPress={() => navigation.navigate('Crops')}
        />

        <DashboardCard
          title="Total Fields"
          value={totalFields}
          icon="map-outline"
          color="#1976D2"
          onPress={() => navigation.navigate('Fields')}
        />

        <DashboardCard
          title="Farm Activities"
          value={totalActivities}
          icon="clipboard-outline"
          color="#EF6C00"
          onPress={() => navigation.navigate('Activities')}
        />

        <DashboardCard
          title="Harvest Records"
          value={totalHarvests}
          icon="basket-outline"
          color="#8E24AA"
          onPress={() => navigation.navigate('Harvest')}
        />

      </View>

      {/* HARVEST SUMMARY */}
      <View style={styles.harvestSummary}>

        <View style={styles.harvestHeader}>
          <Ionicons
            name="trending-up"
            size={26}
            color="#FFFFFF"
          />

          <Text style={styles.harvestTitle}>
            Total Harvest Quantity
          </Text>
        </View>

        <Text style={styles.harvestValue}>
          {totalQuantity} kg
        </Text>

        <Text style={styles.harvestDescription}>
          Total quantity from all saved harvest records
        </Text>

      </View>

      {/* QUICK ACTIONS */}
      <Text style={styles.sectionTitle}>
        Quick Actions
      </Text>

      <QuickAction
        title="Manage Crops"
        icon="leaf-outline"
        screen="Crops"
      />

      <QuickAction
        title="Manage Fields"
        icon="map-outline"
        screen="Fields"
      />

      <QuickAction
        title="Manage Activities"
        icon="clipboard-outline"
        screen="Activities"
      />

      <QuickAction
        title="Manage Harvests"
        icon="basket-outline"
        screen="Harvest"
      />

      {/* FOOTER */}
      <Text style={styles.footer}>
        HarvestHub | Smart Farm Management
      </Text>

    </ScrollView>
  );
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: '#F1F8E9',
  },

  content: {
    padding: 16,
    paddingBottom: 35,
  },

  header: {
    backgroundColor: '#2E7D32',
    padding: 22,
    borderRadius: 16,
    marginBottom: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  welcome: {
    color: '#FFFFFF',
    fontSize: 23,
    fontWeight: 'bold',
    marginBottom: 7,
  },

  subtitle: {
    color: '#E8F5E9',
    fontSize: 13,
  },

  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1B5E20',
    marginBottom: 15,
  },

  cardGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 12,
  },

  card: {
    backgroundColor: '#FFFFFF',
    width: '48%',
    padding: 18,
    borderRadius: 14,
    marginBottom: 14,
    alignItems: 'flex-start',
    elevation: 3,
  },

  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  },

  cardValue: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#222222',
    marginBottom: 5,
  },

  cardTitle: {
    fontSize: 13,
    color: '#666666',
    fontWeight: '500',
  },

  harvestSummary: {
    backgroundColor: '#388E3C',
    padding: 22,
    borderRadius: 16,
    marginBottom: 28,
  },

  harvestHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },

  harvestTitle: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: 'bold',
    marginLeft: 10,
  },

  harvestValue: {
    color: '#FFFFFF',
    fontSize: 35,
    fontWeight: 'bold',
    marginBottom: 8,
  },

  harvestDescription: {
    color: '#E8F5E9',
    fontSize: 13,
  },

  actionButton: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 2,
  },

  actionText: {
    flex: 1,
    fontSize: 15,
    fontWeight: '600',
    color: '#333333',
    marginLeft: 14,
  },

  footer: {
    textAlign: 'center',
    color: '#888888',
    fontSize: 12,
    marginTop: 24,
  },

});
