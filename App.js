
import React, { useEffect } from 'react';

import AppNavigator from './navigation/AppNavigator';

import { initializeDatabase } from './database/database';

export default function App() {

  useEffect(() => {

    // Initialize the database when the app starts
    initializeDatabase();

  }, []);

  return <AppNavigator />;

}
