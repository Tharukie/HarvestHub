
/*
  HarvestHub Web Database
  Browser localStorage
*/

const CROPS_KEY = 'harvesthub_crops';
const FIELDS_KEY = 'harvesthub_fields';
const ACTIVITIES_KEY = 'harvesthub_activities';
const HARVESTS_KEY = 'harvesthub_harvests';

// General storage helpers
function getRecords(key) {
  return JSON.parse(localStorage.getItem(key) || '[]');
}

function saveRecords(key, records) {
  localStorage.setItem(key, JSON.stringify(records));
}

// Generate unique record IDs
function newId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

// Initialize database
export function initializeDatabase() {
  [CROPS_KEY, FIELDS_KEY, ACTIVITIES_KEY, HARVESTS_KEY].forEach(
    (key) => {
      if (localStorage.getItem(key) === null) {
        saveRecords(key, []);
      }
    }
  );
}

// ==============================
// CROPS MANAGEMENT
// ==============================

export function getAllCrops() {
  return getRecords(CROPS_KEY);
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

  saveRecords(CROPS_KEY, crops);
}

export function updateCrop(id, name, type, plantingDate, quantity) {
  const updated = getAllCrops().map((crop) =>
    crop.id === id
      ? { ...crop, name, type, plantingDate, quantity }
      : crop
  );

  saveRecords(CROPS_KEY, updated);
}

export function deleteCrop(id) {
  saveRecords(
    CROPS_KEY,
    getAllCrops().filter((crop) => crop.id !== id)
  );
}

// ==============================
// FIELDS MANAGEMENT
// ==============================

export function getAllFields() {
  return getRecords(FIELDS_KEY);
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

  saveRecords(FIELDS_KEY, fields);
}

export function updateField(id, name, location, size, soilType) {
  const updated = getAllFields().map((field) =>
    field.id === id
      ? { ...field, name, location, size, soilType }
      : field
  );

  saveRecords(FIELDS_KEY, updated);
}

export function deleteField(id) {
  saveRecords(
    FIELDS_KEY,
    getAllFields().filter((field) => field.id !== id)
  );
}

// ==============================
// ACTIVITIES MANAGEMENT
// ==============================

export function getAllActivities() {
  return getRecords(ACTIVITIES_KEY);
}

export function addActivity(
  name,
  fieldName,
  activityDate,
  description
) {
  const activities = getAllActivities();

  activities.push({
    id: Date.now(),
    name,
    fieldName,
    activityDate,
    description,
  });

  saveRecords(ACTIVITIES_KEY, activities);
}

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

  saveRecords(ACTIVITIES_KEY, updated);
}

export function deleteActivity(id) {
  saveRecords(
    ACTIVITIES_KEY,
    getAllActivities().filter((activity) => activity.id !== id)
  );
}

// ==============================
// HARVEST MANAGEMENT
// ==============================

// READ
export function getAllHarvests() {
  return getRecords(HARVESTS_KEY);
}

// CREATE
export function addHarvest(
  cropName,
  fieldName,
  harvestDate,
  quantity,
  notes
) {
  const harvests = getAllHarvests();

  harvests.push({
    id: newId(),
    cropName,
    fieldName,
    harvestDate,
    quantity,
    notes,
  });

  saveRecords(HARVESTS_KEY, harvests);
}

// UPDATE
export function updateHarvest(
  id,
  cropName,
  fieldName,
  harvestDate,
  quantity,
  notes
) {
  const updated = getAllHarvests().map((harvest) =>
    harvest.id === id
      ? {
          ...harvest,
          cropName,
          fieldName,
          harvestDate,
          quantity,
          notes,
        }
      : harvest
  );

  saveRecords(HARVESTS_KEY, updated);
}

// DELETE
export function deleteHarvest(id) {
  saveRecords(
    HARVESTS_KEY,
    getAllHarvests().filter((harvest) => harvest.id !== id)
  );
}
