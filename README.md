# 🌱 HarvestHub – Smart Farm Management

**A cross-platform farm management application built with React Native and Expo.**

HarvestHub helps farmers organize crop records, farm fields, daily activities, and harvests in one application. Its **Smart Farm Decision Assistant** turns saved farm records into practical, rule-based insights.

> **Platforms:** Android (Expo Go) and Web Browser  
> **Storage:** SQLite on Android; browser localStorage on Web  
> **Repository:** [github.com/Tharukie/HarvestHub](https://github.com/Tharukie/HarvestHub)

## 📌 Project Overview

Farmers often manage planting details, field information, activities, and harvest records separately. HarvestHub brings these tasks together in a mobile-friendly application with local data storage.

### Objectives

- Organize crop, field, activity, and harvest records.
- Support create, read, update, and delete (CRUD) operations.
- Provide an interface for Android and the Web.
- Present helpful insights based on saved farm records.
- Store records locally without requiring a cloud backend.

## ✨ Key Features

| Module | Functionality |
| --- | --- |
| **Home Dashboard** | Overview of farm records and access to the Smart Farm Assistant |
| **Crop Management** | Add, view, edit, delete, and search crops; record type, planting date, and quantity |
| **Field Management** | Manage field names, locations, sizes, and soil types |
| **Activity Management** | Record activities and their dates, fields, and descriptions |
| **Harvest Management** | Maintain harvest records including crop, field, date, quantity, and notes |
| **Smart Farm Decision Assistant** | Crop-age insights, harvest-planning guidance, watering follow-ups, farm statistics, and recent harvest information |
| **Input Improvements** | Date/time selection, dropdown controls, and numeric entry where implemented |

### 🌟 Unique Feature: Smart Farm Decision Assistant

The assistant uses existing farm records to show:

- **Crop age and planning insights** based on saved planting dates.
- **Watering follow-ups** informed by recorded watering activities.
- **Farm summaries** of crops, fields, activities, and harvests.
- **Recent harvest information** from saved harvest records.

> **Scope:** These are rule-based planning aids, not live sensor readings, crop-health diagnoses, or guaranteed harvest predictions. The crop records do not include a verified expected harvest date.

## 🛠️ Technology Stack

- **React Native** – Cross-platform user interface
- **Expo** – Development and testing
- **JavaScript** – Application logic
- **React Navigation** – Navigation between screens
- **expo-sqlite** – Android local database
- **Browser localStorage** – Web local data storage
- **Git and GitHub** – Version control and pull requests

## 🗃️ Data Storage Architecture

```text
                    HarvestHub UI
                         |
                  Database API calls
                         |
               +---------+---------+
               |                   |
            Android                Web
               |                   |
      database.native.js    database.web.js
               |                   |
         SQLite database     Browser localStorage
```

Android and Web use **separate local data stores**. Records are not automatically synchronized between platforms or devices.

## 📱 Android Application Screenshots

*Captured from HarvestHub running on an Android phone using Expo Go. All image paths below refer to actual `.jpeg` files in `screenshots/android/`.*

### Home Dashboard

| Dashboard view 1 | Dashboard view 2 |
| --- | --- |
| ![Android Home Dashboard 1](screenshots/android/Home1.jpeg) | ![Android Home Dashboard 2](screenshots/android/Home2.jpeg) |

### Crop Management

| Crop screen 1 | Crop screen 2 |
| --- | --- |
| ![Android Crops 1](screenshots/android/Crops1.jpeg) | ![Android Crops 2](screenshots/android/Crops2.jpeg) |

### Field Management

| Field screen 1 | Field screen 2 |
| --- | --- |
| ![Android Fields 1](screenshots/android/Field1.jpeg) | ![Android Fields 2](screenshots/android/Field2.jpeg) |

### Activity Management

| Activity screen 1 | Activity screen 2 |
| --- | --- |
| ![Android Activities 1](screenshots/android/Activities1.jpeg) | ![Android Activities 2](screenshots/android/Activities2.jpeg) |

### Harvest Management

| Harvest screen 1 | Harvest screen 2 |
| --- | --- |
| ![Android Harvest 1](screenshots/android/Harvest1.jpeg) | ![Android Harvest 2](screenshots/android/Harvest2.jpeg) |

### 🌟 Smart Farm Decision Assistant

| Assistant view 1 | Assistant view 2 | Assistant view 3 |
| --- | --- | --- |
| ![Smart Assistant 1](screenshots/android/smart%20assistant1.jpeg) | ![Smart Assistant 2](screenshots/android/smart%20assistant2.jpeg) | ![Smart Assistant 3](screenshots/android/smart%20assistant3.jpeg) |

### 🎛️ Input Improvements: Date/Time Pickers and Dropdowns

These screenshots demonstrate the input controls implemented in the Android application.

**Date/time selection**

| Crop date/time picker | Activity date/time picker | Harvest date/time picker |
| --- | --- | --- |
| ![Crop date time picker](screenshots/android/Crops%20Date%20time%20picker.jpeg) | ![Activity date time picker](screenshots/android/Activities%20datetime%20Picker.jpeg) | ![Harvest date time picker](screenshots/android/Harvest%20Date%20Time%20picker.jpeg) |

**Dropdown selection**

| Crop dropdown | Activity dropdown 1 | Activity dropdown 2 |
| --- | --- | --- |
| ![Crop dropdown](screenshots/android/Crops%20Dropdown.jpeg) | ![Activity dropdown 1](screenshots/android/Activities%20DropDown1.jpeg) | ![Activity dropdown 2](screenshots/android/Activities%20DropDown2.jpeg) |

| Field dropdown 1 | Field dropdown 2 |
| --- | --- |
| ![Field dropdown 1](screenshots/android/Field%20DropDown1.jpeg) | ![Field dropdown 2](screenshots/android/Field%20DropDown2.jpeg) |

| Harvest dropdown 1 | Harvest dropdown 2 |
| --- | --- |
| ![Harvest dropdown 1](screenshots/android/Harvest%20DropDown1.jpeg) | ![Harvest dropdown 2](screenshots/android/Harvest%20DropDown2.jpeg) |

> **Numeric input evidence:** Crop quantity, field size, and harvest quantity are examples of numeric data fields. Add a separate screenshot here if you capture the numeric keyboard/input validation; no numeric-input screenshot was included in the current Android file list.

## 🌐 Web Browser Application Screenshots

The following screenshots document HarvestHub running in a Web browser, including its main management screens, date/time pickers, dropdown controls, and record-operation alerts.

### Home Dashboard

| Dashboard view 1 | Dashboard view 2 |
| --- | --- |
| ![Web Dashboard view 1](screenshots/web/Home1.png) | ![Web Dashboard view 2](screenshots/web/Home2.png) |

### Crop Management

| Crop screen 1 | Crop screen 2 |
| --- | --- |
| ![Web Crop screen 1](screenshots/web/Crops1.png) | ![Web Crop screen 2](screenshots/web/Crops2.png) |

### Field Management

| Field screen 1 | Field screen 2 |
| --- | --- |
| ![Web Field screen 1](screenshots/web/Fields1.png) | ![Web Field screen 2](screenshots/web/Fields2.png) |

### Activity Management

| Activity screen 1 | Activity screen 2 |
| --- | --- |
| ![Web Activity screen 1](screenshots/web/Activities1.png) | ![Web Activity screen 2](screenshots/web/Activities2.png) |

### Harvest Management

| Harvest screen 1 | Harvest screen 2 |
| --- | --- |
| ![Web Harvest screen 1](screenshots/web/Harvest1.png) | ![Web Harvest screen 2](screenshots/web/Harvest2.png) |

### Date/Time Picker Inputs

| Crop date/time picker | Activity date/time picker | Harvest date/time picker |
| --- | --- | --- |
| ![Web Crop date/time picker](screenshots/web/Crops%20DateTimePiccker.png) | ![Web Activity date/time picker](screenshots/web/Activities%20DateTime%20Picker.png) | ![Web Harvest date/time picker](screenshots/web/Harvest%20DateTime%20Picker.png) |

### Dropdown Inputs – Crops and Activities

| Crop dropdown | Activity dropdown 1 | Activity dropdown 2 |
| --- | --- | --- |
| ![Web Crop dropdown](screenshots/web/Crops%20DropDown.png) | ![Web Activity dropdown 1](screenshots/web/Activities%20DropDown1.png) | ![Web Activity dropdown 2](screenshots/web/Activities%20DropDown2.png) |

### Dropdown Inputs – Fields

| Field dropdown 1 | Field dropdown 2 |
| --- | --- |
| ![Web Field dropdown 1](screenshots/web/FieldsDropDown1.png) | ![Web Field dropdown 2](screenshots/web/FieldsDropDown2.png) |

### Dropdown Inputs – Harvest

| Harvest dropdown 1 | Harvest dropdown 2 |
| --- | --- |
| ![Web Harvest dropdown 1](screenshots/web/Harvest%20DropDown1.png) | ![Web Harvest dropdown 2](screenshots/web/Harvest%20DropDown2.png) |

### CRUD Operation Alerts

| Add record alert | Update record alert | Delete record alert |
| --- | --- | --- |
| ![Web Add record alert](screenshots/web/Adding%20alert.png) | ![Web Update record alert](screenshots/web/Update%20alert.png) | ![Web Delete record alert](screenshots/web/Delete%20Alert.png) |

The Web screenshots supplied here do not include a Smart Farm Decision Assistant view or a dedicated numeric-input screenshot. The Android Smart Farm Decision Assistant screenshots remain available in the Android section above.
## 🚀 Getting Started

### Prerequisites

- Node.js and npm
- Git
- VS Code or another code editor
- Expo Go on an Android phone for mobile testing

### 1. Clone the repository

```bash
git clone https://github.com/Tharukie/HarvestHub.git
cd HarvestHub
```

### 2. Install dependencies

```bash
npm install
```

### 3. Start the Expo development server

```bash
npx expo start
```

### 4. Run on Android

1. Install and open **Expo Go** on the Android phone.
2. Connect the phone and computer to a network that allows access to the development server.
3. Scan the QR code shown by Expo.
4. Wait for HarvestHub to load, then explore the tabs and Smart Farm Assistant.

If the phone cannot connect over the local network, try:

```bash
npx expo start --tunnel
```

### 5. Run in a Web browser

From the Expo terminal, press `w`, or start Web directly:

```bash
npx expo start --web
```

Follow any dependency or SDK compatibility instructions shown in the terminal.

## 🧪 Testing and Validation

The following results were reported during development:

| Test area | Result |
| --- | --- |
| Core CRUD functionality on Android | 10/10 checks passed |
| Browser core functionality | 8/8 checks passed |
| Smart Farm Assistant on Android | 8/8 checks passed |
| Smart Farm Assistant in browser | Completed successfully |
| Android SQLite persistence | Manually verified |
| Android navigation and layout | Manually verified |

**Testing method:** Manual functional testing on Android and Web. These results do not represent an automated test suite.

### Suggested Demonstration Flow

1. Open the Home Dashboard.
2. Add a crop and confirm it appears in the crop list.
3. Add a field and a watering activity.
4. Open **Smart Farm Assistant** to inspect the updated insights.
5. Add a harvest record and review the farm summary.
6. Restart the application and verify that locally stored records persist.
7. Demonstrate the available date/time pickers and dropdown controls.

## 📁 Project Structure

```text
HarvestHub/
├── App.js
├── app.json
├── package.json
├── README.md
├── navigation/
│   └── AppNavigator.js
├── screens/
│   ├── HomeScreen.js
│   ├── CropsScreen.js
│   ├── FieldsScreen.js
│   ├── ActivitiesScreen.js
│   ├── HarvestScreen.js
│   └── SmartAssistantScreen.js
├── database/
│   ├── database.native.js
│   └── database.web.js
├── docs/
│   └── ANDROID_INTEGRATION.md
└── screenshots/
    ├── android/                 # 23 captured Android JPEG screenshots
    └── web/                     # 23 captured Web PNG screenshots
```

This tree highlights the main project files and omits generated folders such as `node_modules` and `.expo`.

## 🔀 Version Control and Collaboration

Development used feature branches, commits, and GitHub pull requests. Completed modules and improvements were merged into `main`, including the Smart Farm Decision Assistant.

For Android database implementation and testing details, see [Android Integration Documentation](docs/ANDROID_INTEGRATION.md).

## 🔮 Future Enhancements

- Optional cloud backup and synchronization
- Crop-specific harvest-date estimates based on verified crop requirements
- Weather-data integration with location-aware recommendations
- Notifications and configurable watering schedules

## 📄 Academic Project

HarvestHub was developed as an academic React Native project demonstrating cross-platform application development, local data persistence, CRUD operations, and rule-based decision support.
