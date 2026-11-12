
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function HarvestScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>📦 Harvest Records</Text>
      <Text style={styles.message}>Your harvest records will appear here.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F1F8E9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#1B5E20',
  },
  message: {
    fontSize: 16,
    marginTop: 12,
    color: '#555',
  },
});
