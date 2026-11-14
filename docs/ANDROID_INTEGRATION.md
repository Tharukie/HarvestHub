
# HarvestHub – Android SQLite Integration

## 1. Overview

HarvestHub is a React Native application developed
using Expo for smart farm management.

The application supports Android and Web platforms.

## 2. Database Integration

HarvestHub uses platform-specific database implementations.

### Android

Database file:
`database/database.native.js`

Technology:
Expo SQLite

SQLite is used to store farm management records
locally on the Android device.

### Web

Database file:
`database/database.web.js`

Technology:
Browser localStorage

Web records are stored separately from Android records.

## 3. Database Initialization

The application initializes the database before
displaying the main navigation interface.

This prevents screens from accessing database
tables before initialization is complete.

## 4. Main Features

HarvestHub provides five main screens:

- Home – Farm management dashboard
- Crops – Crop management
- Fields – Field management
- Activities – Farm activity management
- Harvest – Harvest record management

## 5. CRUD Operations

The Android application supports:

- Create new records
- Read saved records
- Update existing records
- Delete records

These operations were tested on the Android device.

## 6. Data Persistence

Android records are stored locally using SQLite.

Saved records remain available after closing
and reopening the application.

Web records are stored separately using localStorage.

## 7. Android UI Integration

The Android layout includes safe area handling
to prevent overlap with system status and
navigation bars.

The following were verified:

- Top status bar does not overlap app content
- Bottom navigation tabs are visible
- All five screens open correctly

## 8. Testing Results

| Test | Result |
|------|--------|
| Android UI layout | Passed |
| Home dashboard | Passed |
| Crops CRUD | Passed |
| Fields CRUD | Passed |
| Activities CRUD | Passed |
| Harvest CRUD | Passed |
| Input validation | Passed |
| SQLite data persistence | Passed |
| Dashboard updates | Passed |
| Android overall tests | 10/10 Passed |
| Browser overall tests | 8/8 Passed |

## 9. Running on Android

1. Install project dependencies:

   npm install

2. Start the Expo development server:

   npx expo start

3. Open Expo Go on an Android device.

4. Scan the QR code displayed by Expo.

5. Test the HarvestHub application.

## 10. Conclusion

HarvestHub Android integration was verified
successfully using Expo Go.

SQLite CRUD operations, local data persistence,
navigation, and Android safe area layout
were tested successfully.
