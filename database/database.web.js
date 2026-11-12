
const STORAGE_KEY = 'harvesthub_crops';

export function initializeDatabase() {
  if (!localStorage.getItem(STORAGE_KEY)) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([]));
  }
}

export function getAllCrops() {
  return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
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

  localStorage.setItem(STORAGE_KEY, JSON.stringify(crops));
}

export function updateCrop(id, name, type, plantingDate, quantity) {
  const crops = getAllCrops();

  const updated = crops.map((crop) =>
    crop.id === id
      ? { ...crop, name, type, plantingDate, quantity }
      : crop
  );

  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
}

export function deleteCrop(id) {
  const crops = getAllCrops();
  const updated = crops.filter((crop) => crop.id !== id);

  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
}
