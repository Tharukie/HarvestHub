
/*
  HarvestHub Web Database
  Storage: Browser localStorage
  Modules: Crops, Fields, Activities
*/

const CROPS_STORAGE_KEY = 'harvesthub_crops';
const FIELDS_STORAGE_KEY = 'harvesthub_fields';
const ACTIVITIES_STORAGE_KEY = 'harvesthub_activities';

// Initialize storage
export function initializeDatabase() {
  const keys = [
    CROPS_STORAGE_KEY,
    FIELDS_STORAGE_KEY,
    ACTIVITIES_STORAGE_KEY,
  ];

  keys.forEach((key) => {
    if (localStorage.getItem(key) === null) {
      localStorage.setItem(key, JSON.stringify([]));
    }
  });
}

// =====================================
// CROPS MANAGEMENT
// =====================================

export function getAllCrops() {
  return JSON.parse(
    localStorage.getItem(CROPS_STORAGE_KEY) || '[]'
  );
}

export function addCrop(name, type, plantingDate, quantity) {
  const crops = getAllCrops();

  crops.push({
    id: Date.now(),
    name,
    type,
    plantingDate,
    quantity,
  });

  localStorage.setItem(
    CROPS_STORAGE_KEY,
    JSON.stringify(crops)
  );
}

export function updateCrop(id, name, type, plantingDate, quantity) {
  const updated = getAllCrops().map((crop) =>
    crop.id === id
      ? { ...crop, name, type, plantingDate, quantity }
      : crop
  );

  localStorage.setItem(
    CROPS_STORAGE_KEY,
    JSON.stringify(updated)
  );
}

export function deleteCrop(id) {
  const updated = getAllCrops().filter(
    (crop) => crop.id !== id
  );

  localStorage.setItem(
    CROPS_STORAGE_KEY,
    JSON.stringify(updated)
  );
}

// =====================================
// FARM FIELDS MANAGEMENT
// =====================================

export function getAllFields() {
  return JSON.parse(
    localStorage.getItem(FIELDS_STORAGE_KEY) || '[]'
  );
}

export function addField(name, location, size, soilType) {
  const fields = getAllFields();

  fields.push({
    id: Date.now(),
    name,
    location,
    size,
    soilType,
  });

  localStorage.setItem(
    FIELDS_STORAGE_KEY,
    JSON.stringify(fields)
  );
}

export function updateField(id, name, location, size, soilType) {
  const updated = getAllFields().map((field) =>
    field.id === id
      ? { ...field, name, location, size, soilType }
      : field
  );

  localStorage.setItem(
    FIELDS_STORAGE_KEY,
    JSON.stringify(updated)
  );
}

export function deleteField(id) {
  const updated = getAllFields().filter(
    (field) => field.id !== id
  );

  localStorage.setItem(
    FIELDS_STORAGE_KEY,
    JSON.stringify(updated)
  );
}

// =====================================
// FARM ACTIVITIES MANAGEMENT
// =====================================

// READ
export function getAllActivities() {
  return JSON.parse(
    localStorage.getItem(ACTIVITIES_STORAGE_KEY) || '[]'
  );
}

// CREATE
export function addActivity(name, fieldName, activityDate, description) {
  const activities = getAllActivities();

  activities.push({
    id: Date.now(),
    name,
    fieldName,
    activityDate,
    description,
  });

  localStorage.setItem(
    ACTIVITIES_STORAGE_KEY,
    JSON.stringify(activities)
  );
}

// UPDATE
export function updateActivity(
  id,
  name,
  fieldName,
  activityDate,
  description
) {
  const updated = getAllActivities().map((activity) =>
    activity.id === id
      ? {
          ...activity,
          name,
          fieldName,
          activityDate,
          description,
        }
      : activity
  );

  localStorage.setItem(
    ACTIVITIES_STORAGE_KEY,
    JSON.stringify(updated)
  );
}

// DELETE
export function deleteActivity(id) {
  const updated = getAllActivities().filter(
    (activity) => activity.id !== id
  );

  localStorage.setItem(
    ACTIVITIES_STORAGE_KEY,
    JSON.stringify(updated)
  );
}
