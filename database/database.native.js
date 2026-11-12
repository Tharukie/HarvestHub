
import * as SQLite from 'expo-sqlite';

// Open local SQLite database
const db = SQLite.openDatabaseSync('harvesthub.db');

// Initialize all database tables
export function initializeDatabase() {

  // Crops Table
  db.execSync(`
    CREATE TABLE IF NOT EXISTS crops (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      type TEXT NOT NULL,
      plantingDate TEXT NOT NULL,
      quantity TEXT NOT NULL
    );
  `);

  // Farm Fields Table
  db.execSync(`
    CREATE TABLE IF NOT EXISTS fields (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      location TEXT NOT NULL,
      size TEXT NOT NULL,
      soilType TEXT NOT NULL
    );
  `);
}

// =====================================
// CROP MANAGEMENT - CRUD OPERATIONS
// =====================================

// READ - Get all crops
export function getAllCrops() {
  return db.getAllSync(
    'SELECT * FROM crops ORDER BY id DESC'
  );
}

// CREATE - Add new crop
export function addCrop(name, type, plantingDate, quantity) {
  return db.runSync(
    `INSERT INTO crops
     (name, type, plantingDate, quantity)
     VALUES (?, ?, ?, ?)`,
    [name, type, plantingDate, quantity]
  );
}

// UPDATE - Edit crop
export function updateCrop(id, name, type, plantingDate, quantity) {
  return db.runSync(
    `UPDATE crops
     SET name = ?, type = ?, plantingDate = ?, quantity = ?
     WHERE id = ?`,
    [name, type, plantingDate, quantity, id]
  );
}

// DELETE - Remove crop
export function deleteCrop(id) {
  return db.runSync(
    'DELETE FROM crops WHERE id = ?',
    [id]
  );
}

// =====================================
// FARM FIELDS MANAGEMENT - CRUD
// =====================================

// READ - Get all farm fields
export function getAllFields() {
  return db.getAllSync(
    'SELECT * FROM fields ORDER BY id DESC'
  );
}

// CREATE - Add new farm field
export function addField(name, location, size, soilType) {
  return db.runSync(
    `INSERT INTO fields
     (name, location, size, soilType)
     VALUES (?, ?, ?, ?)`,
    [name, location, size, soilType]
  );
}

// UPDATE - Edit farm field
export function updateField(id, name, location, size, soilType) {
  return db.runSync(
    `UPDATE fields
     SET name = ?, location = ?, size = ?, soilType = ?
     WHERE id = ?`,
    [name, location, size, soilType, id]
  );
}

// DELETE - Remove farm field
export function deleteField(id) {
  return db.runSync(
    'DELETE FROM fields WHERE id = ?',
    [id]
  );
}
