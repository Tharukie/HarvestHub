
/*
  HarvestHub - Web Database
  Offline Storage using localStorage
  Modules: Crops and Farm Fields
*/

// =====================================
// STORAGE KEYS
// =====================================

const CROPS_STORAGE_KEY = 'harvesthub_crops';
const FIELDS_STORAGE_KEY = 'harvesthub_fields';

// =====================================
// INITIALIZE DATABASE
// =====================================

export function initializeDatabase() {
  if (!localStorage.getItem(CROPS_STORAGE_KEY)) {
    localStorage.setItem(
      CROPS_STORAGE_KEY,
      JSON.stringify([])
    );
  }

  if (!localStorage.getItem(FIELDS_STORAGE_KEY)) {
    localStorage.setItem(
      FIELDS_STORAGE_KEY,
      JSON.stringify([])
    );
  }
}

// =====================================
// CROP MANAGEMENT - CRUD
// =====================================

// READ - Get all crops
export function getAllCrops() {
  return JSON.parse(
    localStorage.getItem(CROPS_STORAGE_KEY) || '[]'
  );
}

// CREATE - Add new crop
export function addCrop(name, type, plantingDate, quantity) {
  const crops = getAllCrops();

  const newCrop = {
    id: Date.now(),
    name,
    type,
    plantingDate,
    quantity,
  };

  crops.push(newCrop);

  localStorage.setItem(
    CROPS_STORAGE_KEY,
    JSON.stringify(crops)
  );
}

// UPDATE - Edit crop
export function updateCrop(id, name, type, plantingDate, quantity) {
  const crops = getAllCrops();

  const updatedCrops = crops.map((crop) =>
    crop.id === id
      ? {
          ...crop,
          name,
          type,
          plantingDate,
          quantity,
        }
      : crop
  );

  localStorage.setItem(
    CROPS_STORAGE_KEY,
    JSON.stringify(updatedCrops)
  );
}

// DELETE - Remove crop
export function deleteCrop(id) {
  const crops = getAllCrops();

  const updatedCrops = crops.filter(
    (crop) => crop.id !== id
  );

  localStorage.setItem(
    CROPS_STORAGE_KEY,
    JSON.stringify(updatedCrops)
  );
}

// =====================================
// FARM FIELDS MANAGEMENT - CRUD
// =====================================

// READ - Get all farm fields
export function getAllFields() {
  return JSON.parse(
    localStorage.getItem(FIELDS_STORAGE_KEY) || '[]'
  );
}

// CREATE - Add new farm field
export function addField(name, location, size, soilType) {
  const fields = getAllFields();

  const newField = {
    id: Date.now(),
    name,
    location,
    size,
    soilType,
  };

  fields.push(newField);

  localStorage.setItem(
    FIELDS_STORAGE_KEY,
    JSON.stringify(fields)
  );
}

// UPDATE - Edit farm field
export function updateField(id, name, location, size, soilType) {
  const fields = getAllFields();

  const updatedFields = fields.map((field) =>
    field.id === id
      ? {
          ...field,
          name,
          location,
          size,
          soilType,
        }
      : field
  );

  localStorage.setItem(
    FIELDS_STORAGE_KEY,
    JSON.stringify(updatedFields)
  );
}

// DELETE - Remove farm field
export function deleteField(id) {
  const fields = getAllFields();

  const updatedFields = fields.filter(
    (field) => field.id !== id
  );

  localStorage.setItem(
    FIELDS_STORAGE_KEY,
    JSON.stringify(updatedFields)
  );
}
