
import React, { useEffect, useState } from 'react';

import {
  View,
  Text,
  ActivityIndicator,
  StyleSheet,
  StatusBar,
} from 'react-native';

import {
  SafeAreaProvider,
  SafeAreaView,
} from 'react-native-safe-area-context';

import AppNavigator from './navigation/AppNavigator';
import { initializeDatabase } from './database/database';

export default function App() {
  const [databaseReady, setDatabaseReady] = useState(false);
  const [databaseError, setDatabaseError] = useState(null);

  useEffect(() => {
    try {
      // Initialize SQLite on Android
      // Initialize local storage on Web
      initializeDatabase();

      // Show navigation only after database is ready
      setDatabaseReady(true);
    } catch (error) {
      console.error(
        'Database initialization failed:',
        error
      );

      setDatabaseError(
        error.message || 'Unknown database error'
      );
    }
  }, []);

  let content;

  if (databaseError) {
    content = (
      <View style={styles.center}>
        <Text style={styles.errorTitle}>
          Database Initialization Failed
        </Text>

        <Text style={styles.errorText}>
          {databaseError}
        </Text>
      </View>
    );
  } else if (!databaseReady) {
    content = (
      <View style={styles.center}>
        <ActivityIndicator
          size="large"
          color="#2E7D32"
        />

        <Text style={styles.loadingText}>
          Preparing HarvestHub Database...
        </Text>
      </View>
    );
  } else {
    content = <AppNavigator />;
  }

  return (
    <SafeAreaProvider>
      <StatusBar
        barStyle="dark-content"
        backgroundColor="#F1F8E9"
      />

      <SafeAreaView
        style={styles.safeArea}
        edges={['top']}
      >
        {content}
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F1F8E9',
  },

  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },

  loadingText: {
    marginTop: 15,
    fontSize: 16,
    color: '#1B5E20',
    textAlign: 'center',
  },

  errorTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#D32F2F',
    marginBottom: 12,
    textAlign: 'center',
  },

  errorText: {
    fontSize: 14,
    color: '#555555',
    textAlign: 'center',
  },
});
