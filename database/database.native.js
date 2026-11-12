
import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabaseSync('harvesthub.db');

export function initializeDatabase() {
  db.execSync(`
    CREATE TABLE IF NOT EXISTS crops (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      type TEXT NOT NULL,
      plantingDate TEXT NOT NULL,
      quantity TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS fields (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      location TEXT NOT NULL,
      size TEXT NOT NULL,
      soilType TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS activities (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      fieldName TEXT NOT NULL,
      activityDate TEXT NOT NULL,
      description TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS harvests (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      cropName TEXT NOT NULL,
      fieldName TEXT NOT NULL,
      harvestDate TEXT NOT NULL,
      quantity TEXT NOT NULL,
      notes TEXT NOT NULL
    );
  `);
}

// ==============================
// CROPS MANAGEMENT
// ==============================

export function getAllCrops() {
  return db.getAllSync('SELECT * FROM crops ORDER BY id DESC');
}

export function addCrop(name, type, plantingDate, quantity) {
  return db.runSync(
    'INSERT INTO crops (name, type, plantingDate, quantity) VALUES (?, ?, ?, ?)',
    [name, type, plantingDate, quantity]
  );
}

export function updateCrop(id, name, type, plantingDate, quantity) {
  return db.runSync(
    'UPDATE crops SET name = ?, type = ?, plantingDate = ?, quantity = ? WHERE id = ?',
    [name, type, plantingDate, quantity, id]
  );
}

export function deleteCrop(id) {
  return db.runSync(
    'DELETE FROM crops WHERE id = ?',
    [id]
  );
}

// ==============================
// FIELDS MANAGEMENT
// ==============================

export function getAllFields() {
  return db.getAllSync('SELECT * FROM fields ORDER BY id DESC');
}

export function addField(name, location, size, soilType) {
  return db.runSync(
    'INSERT INTO fields (name, location, size, soilType) VALUES (?, ?, ?, ?)',
    [name, location, size, soilType]
  );
}

export function updateField(id, name, location, size, soilType) {
  return db.runSync(
    'UPDATE fields SET name = ?, location = ?, size = ?, soilType = ? WHERE id = ?',
    [name, location, size, soilType, id]
  );
}

export function deleteField(id) {
  return db.runSync(
    'DELETE FROM fields WHERE id = ?',
    [id]
  );
}

// ==============================
// ACTIVITIES MANAGEMENT
// ==============================

export function getAllActivities() {
  return db.getAllSync(
    'SELECT * FROM activities ORDER BY id DESC'
  );
}

export function addActivity(
  name,
  fieldName,
  activityDate,
  description
) {
  return db.runSync(
    'INSERT INTO activities (name, fieldName, activityDate, description) VALUES (?, ?, ?, ?)',
    [name, fieldName, activityDate, description]
  );
}

export function updateActivity(
  id,
  name,
  fieldName,
  activityDate,
  description
) {
  return db.runSync(
    'UPDATE activities SET name = ?, fieldName = ?, activityDate = ?, description = ? WHERE id = ?',
    [name, fieldName, activityDate, description, id]
  );
}

export function deleteActivity(id) {
  return db.runSync(
    'DELETE FROM activities WHERE id = ?',
    [id]
  );
}

// ==============================
// HARVEST MANAGEMENT
// ==============================

export function getAllHarvests() {
  return db.getAllSync(
    'SELECT * FROM harvests ORDER BY id DESC'
  );
}

export function addHarvest(
  cropName,
  fieldName,
  harvestDate,
  quantity,
  notes
) {
  return db.runSync(
    'INSERT INTO harvests (cropName, fieldName, harvestDate, quantity, notes) VALUES (?, ?, ?, ?, ?)',
    [cropName, fieldName, harvestDate, quantity, notes]
  );
}

export function updateHarvest(
  id,
  cropName,
  fieldName,
  harvestDate,
  quantity,
  notes
) {
  return db.runSync(
    'UPDATE harvests SET cropName = ?, fieldName = ?, harvestDate = ?, quantity = ?, notes = ? WHERE id = ?',
    [cropName, fieldName, harvestDate, quantity, notes, id]
  );
}

export function deleteHarvest(id) {
  return db.runSync(
    'DELETE FROM harvests WHERE id = ?',
    [id]
  );
}
