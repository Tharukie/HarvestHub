
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
  `);
}

export function getAllCrops() {
  return db.getAllSync(
    'SELECT * FROM crops ORDER BY id DESC'
  );
}

export function addCrop(name, type, plantingDate, quantity) {
  db.runSync(
    'INSERT INTO crops (name, type, plantingDate, quantity) VALUES (?, ?, ?, ?)',
    [name, type, plantingDate, quantity]
  );
}

export function updateCrop(id, name, type, plantingDate, quantity) {
  db.runSync(
    'UPDATE crops SET name = ?, type = ?, plantingDate = ?, quantity = ? WHERE id = ?',
    [name, type, plantingDate, quantity, id]
  );
}

export function deleteCrop(id) {
  db.runSync(
    'DELETE FROM crops WHERE id = ?',
    [id]
  );
}
