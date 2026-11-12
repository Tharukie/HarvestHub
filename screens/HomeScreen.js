
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
} from 'react-native';

export default function HomeScreen() {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.logo}>🌱 HarvestHub</Text>
        <Text style={styles.subtitle}>Smart Farm Management</Text>
      </View>

      <View style={styles.content}>
        <Text style={styles.welcome}>Welcome to HarvestHub!</Text>
        <Text style={styles.description}>
          Manage your farm easily in one place.
        </Text>

        <View style={styles.card}>
          <Text style={styles.icon}>🌾</Text>
          <Text style={styles.title}>My Crops</Text>
          <Text style={styles.number}>0</Text>
          <Text style={styles.info}>Total Crops</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.icon}>🚜</Text>
          <Text style={styles.title}>Farm Fields</Text>
          <Text style={styles.number}>0</Text>
          <Text style={styles.info}>Total Fields</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.icon}>📅</Text>
          <Text style={styles.title}>Farm Activities</Text>
          <Text style={styles.number}>0</Text>
          <Text style={styles.info}>Upcoming Tasks</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.icon}>📦</Text>
          <Text style={styles.title}>Harvest Records</Text>
          <Text style={styles.number}>0</Text>
          <Text style={styles.info}>Total Harvests</Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F1F8E9',
  },
  header: {
    backgroundColor: '#1B5E20',
    padding: 25,
    paddingTop: 40,
  },
  logo: {
    color: 'white',
    fontSize: 27,
    fontWeight: 'bold',
  },
  subtitle: {
    color: '#E8F5E9',
    fontSize: 14,
    marginTop: 5,
  },
  content: {
    padding: 18,
  },
  welcome: {
    fontSize: 23,
    fontWeight: 'bold',
    color: '#1B5E20',
    marginTop: 10,
  },
  description: {
    fontSize: 15,
    color: '#555',
    marginTop: 7,
    marginBottom: 20,
  },
  card: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 12,
    marginBottom: 15,
    elevation: 3,
  },
  icon: {
    fontSize: 30,
  },
  title: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#2E7D32',
    marginTop: 8,
  },
  number: {
    fontSize: 25,
    fontWeight: 'bold',
    color: '#1B5E20',
    marginTop: 5,
  },
  info: {
    fontSize: 13,
    color: '#777',
  },
});
