
import React, { useState, useCallback } from 'react';

import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Alert,
  Platform,
  Modal,
  ScrollView,
} from 'react-native';

import { useFocusEffect } from '@react-navigation/native';

import {
  getAllFields,
  addField,
  updateField,
  deleteField,
} from '../database/database';

// Options for dropdown fields
const SIZE_UNITS = ['Acres', 'Hectares', 'Perches'];

const SOIL_TYPES = [
  'Clay',
  'Sandy',
  'Loamy',
  'Silty',
  'Peaty',
  'Chalky',
  'Other',
];

// Show messages on both browser and Android
function showMessage(title, message) {
  if (Platform.OS === 'web') {
    window.alert(`${title}\n${message}`);
  } else {
    Alert.alert(title, message);
  }
}

// Reusable dropdown component
function DropdownField({
  label,
  value,
  options,
  placeholder,
  onSelect,
}) {
  const [visible, setVisible] = useState(false);

  // Include old saved values that may not be in options
  const availableOptions = [
    ...new Set([
      ...options,
      ...(value ? [value] : []),
    ]),
  ];

  return (
    <View>
      <Text style={styles.label}>{label}</Text>

      <TouchableOpacity
        style={styles.input}
        onPress={() => setVisible(true)}
      >
        <Text
          style={
            value
              ? styles.selectedText
              : styles.placeholderText
          }
        >
          {value || placeholder} ▼
        </Text>
      </TouchableOpacity>

      <Modal
        visible={visible}
        transparent
        animationType="fade"
        onRequestClose={() => setVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.heading}>
              Select {label}
            </Text>

            <ScrollView style={styles.optionsList}>
              {availableOptions.map((option) => (
                <TouchableOpacity
                  key={option}
                  style={styles.option}
                  onPress={() => {
                    onSelect(option);
                    setVisible(false);
                  }}
                >
                  <Text style={styles.optionText}>
                    {option}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => setVisible(false)}
            >
              <Text style={styles.buttonText}>
                Cancel
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

export default function FieldsScreen() {
  // Saved fields
  const [fields, setFields] = useState([]);

  // Form states
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [size, setSize] = useState('');
  const [sizeUnit, setSizeUnit] = useState('Acres');
  const [soilType, setSoilType] = useState('');

  // Search and edit states
  const [search, setSearch] = useState('');
  const [editId, setEditId] = useState(null);

  // Load saved fields
  const loadFields = useCallback(() => {
    try {
      setFields(getAllFields());
    } catch (error) {
      console.log(error);
      showMessage('Error', 'Unable to load fields.');
    }
  }, []);

  // Refresh when Fields tab is opened
  useFocusEffect(
    useCallback(() => {
      loadFields();
    }, [loadFields])
  );

  // Reset form
  function clearForm() {
    setName('');
    setLocation('');
    setSize('');
    setSizeUnit('Acres');
    setSoilType('');
    setEditId(null);
  }

  // Add or update a field
  function handleSave() {
    const cleanName = name.trim();
    const cleanLocation = location.trim();
    const cleanSize = size.trim();
    const cleanSoilType = soilType.trim();

    // Required field validation
    if (
      !cleanName ||
      !cleanLocation ||
      !cleanSize ||
      !sizeUnit ||
      !cleanSoilType
    ) {
      showMessage(
        'Missing Information',
        'Please fill all fields.'
      );
      return;
    }

    // Numeric validation
    const numericSize = Number(cleanSize);

    if (
      !/^\d+(\.\d+)?$/.test(cleanSize) ||
      !Number.isFinite(numericSize) ||
      numericSize <= 0
    ) {
      showMessage(
        'Invalid Field Size',
        'Please enter a positive number, e.g. 2.5.'
      );
      return;
    }

    // Keep the existing database format
    // Example: "2.5 acres"
    const formattedSize =
      `${cleanSize} ${sizeUnit.toLowerCase()}`;

    try {
      if (editId !== null) {
        updateField(
          editId,
          cleanName,
          cleanLocation,
          formattedSize,
          cleanSoilType
        );

        showMessage(
          'Success',
          'Field updated successfully!'
        );
      } else {
        addField(
          cleanName,
          cleanLocation,
          formattedSize,
          cleanSoilType
        );

        showMessage(
          'Success',
          'Field added successfully!'
        );
      }

      clearForm();
      loadFields();
    } catch (error) {
      console.log(error);
      showMessage(
        'Error',
        'Unable to save field.'
      );
    }
  }

  // Load selected field into the edit form
  function handleEdit(field) {
    setEditId(field.id);
    setName(String(field.name ?? ''));
    setLocation(String(field.location ?? ''));
    setSoilType(String(field.soilType ?? ''));

    // Support old records such as "2 acres"
    const oldSize = String(field.size ?? '').trim();

    const match = oldSize.match(
      /^(\d+(?:\.\d+)?)\s*(acres?|hectares?|perches?)$/i
    );

    if (match) {
      setSize(match[1]);

      const unit = match[2].toLowerCase();

      if (unit.startsWith('acre')) {
        setSizeUnit('Acres');
      } else if (unit.startsWith('hectare')) {
        setSizeUnit('Hectares');
      } else {
        setSizeUnit('Perches');
      }
    } else {
      // Keep an old numeric-only value editable
      setSize(oldSize);
      setSizeUnit('Acres');
    }
  }

  // Delete a field
  function handleDelete(id) {
    const removeField = () => {
      try {
        deleteField(id);

        if (editId === id) {
          clearForm();
        }

        loadFields();
      } catch (error) {
        console.log(error);
        showMessage(
          'Error',
          'Unable to delete field.'
        );
      }
    };

    if (Platform.OS === 'web') {
      const confirmed = window.confirm(
        'Are you sure you want to delete this field?'
      );

      if (confirmed) {
        removeField();
      }
    } else {
      Alert.alert(
        'Delete Field',
        'Are you sure you want to delete this field?',
        [
          {
            text: 'Cancel',
            style: 'cancel',
          },
          {
            text: 'Delete',
            style: 'destructive',
            onPress: removeField,
          },
        ]
      );
    }
  }

  // Search by name, location or soil type
  const filteredFields = fields.filter((field) => {
    const keyword = search.toLowerCase().trim();

    return (
      String(field.name ?? '')
        .toLowerCase()
        .includes(keyword) ||
      String(field.location ?? '')
        .toLowerCase()
        .includes(keyword) ||
      String(field.soilType ?? '')
        .toLowerCase()
        .includes(keyword)
    );
  });

  return (
    <View style={styles.container}>
      <FlatList
        data={filteredFields}
        keyExtractor={(item) => String(item.id)}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={styles.listContent}

        ListHeaderComponent={
          <View>
            <Text style={styles.title}>
              🌿 Farm Fields
            </Text>

            <Text style={styles.subtitle}>
              Manage your farm fields easily
            </Text>

            {/* ADD / EDIT FORM */}
            <View style={styles.form}>
              <Text style={styles.heading}>
                {editId !== null
                  ? 'Edit Farm Field'
                  : 'Add New Field'}
              </Text>

              {/* Field Name */}
              <Text style={styles.label}>
                Field Name
              </Text>

              <TextInput
                style={styles.input}
                placeholder="e.g. South Field"
                value={name}
                onChangeText={setName}
              />

              {/* Location */}
              <Text style={styles.label}>
                Location
              </Text>

              <TextInput
                style={styles.input}
                placeholder="e.g. Ratnapura"
                value={location}
                onChangeText={setLocation}
              />

              {/* Numeric Field Size */}
              <Text style={styles.label}>
                Field Size
              </Text>

              <TextInput
                style={styles.input}
                placeholder="e.g. 2.5"
                value={size}
                keyboardType="decimal-pad"
                onChangeText={(value) => {
                  // Allow digits and one decimal point
                  const cleaned = value.replace(
                    /[^0-9.]/g,
                    ''
                  );

                  const parts = cleaned.split('.');

                  if (parts.length <= 2) {
                    setSize(cleaned);
                  }
                }}
              />

              {/* Size Unit Dropdown */}
              <DropdownField
                label="Size Unit"
                value={sizeUnit}
                options={SIZE_UNITS}
                placeholder="Select Size Unit"
                onSelect={setSizeUnit}
              />

              {/* Soil Type Dropdown */}
              <DropdownField
                label="Soil Type"
                value={soilType}
                options={SOIL_TYPES}
                placeholder="Select Soil Type"
                onSelect={setSoilType}
              />

              {/* Save Button */}
              <TouchableOpacity
                style={styles.saveButton}
                onPress={handleSave}
              >
                <Text style={styles.buttonText}>
                  {editId !== null
                    ? 'Update Field'
                    : 'Add Field'}
                </Text>
              </TouchableOpacity>

              {editId !== null && (
                <TouchableOpacity
                  style={styles.cancelButton}
                  onPress={clearForm}
                >
                  <Text style={styles.buttonText}>
                    Cancel Edit
                  </Text>
                </TouchableOpacity>
              )}
            </View>

            {/* Search */}
            <TextInput
              style={styles.searchInput}
              placeholder="Search by name, location or soil type..."
              value={search}
              onChangeText={setSearch}
            />

            <Text style={styles.heading}>
              My Fields ({fields.length})
            </Text>
          </View>
        }

        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.fieldName}>
              🌱 {item.name}
            </Text>

            <Text style={styles.detail}>
              Location: {item.location}
            </Text>

            <Text style={styles.detail}>
              Size: {item.size}
            </Text>

            <Text style={styles.detail}>
              Soil Type: {item.soilType}
            </Text>

            <View style={styles.buttonRow}>
              <TouchableOpacity
                style={styles.editButton}
                onPress={() => handleEdit(item)}
              >
                <Text style={styles.buttonText}>
                  Edit
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.deleteButton}
                onPress={() =>
                  handleDelete(item.id)
                }
              >
                <Text style={styles.buttonText}>
                  Delete
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        ListEmptyComponent={
          <Text style={styles.emptyText}>
            {search
              ? 'No matching fields found.'
              : 'No fields added yet.'}
          </Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F1F8E9',
    padding: 16,
  },
  listContent: {
    paddingBottom: 30,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#1B5E20',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 14,
    color: '#555555',
    marginBottom: 20,
  },
  form: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
    elevation: 2,
  },
  heading: {
    fontSize: 19,
    fontWeight: 'bold',
    color: '#2E7D32',
    marginBottom: 12,
  },
  label: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 6,
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#C8E6C9',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    fontSize: 15,
    color: '#222222',
    minHeight: 48,
    justifyContent: 'center',
  },
  selectedText: {
    color: '#222222',
    fontSize: 15,
  },
  placeholderText: {
    color: '#777777',
    fontSize: 15,
  },
  searchInput: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#C8E6C9',
    borderRadius: 8,
    padding: 12,
    marginBottom: 18,
    fontSize: 14,
  },
  saveButton: {
    backgroundColor: '#2E7D32',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#757575',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 14,
  },
  card: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    elevation: 2,
  },
  fieldName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1B5E20',
    marginBottom: 8,
  },
  detail: {
    fontSize: 14,
    color: '#444444',
    marginBottom: 5,
  },
  buttonRow: {
    flexDirection: 'row',
    marginTop: 12,
    gap: 10,
  },
  editButton: {
    backgroundColor: '#1976D2',
    padding: 11,
    borderRadius: 8,
    flex: 1,
    alignItems: 'center',
  },
  deleteButton: {
    backgroundColor: '#D32F2F',
    padding: 11,
    borderRadius: 8,
    flex: 1,
    alignItems: 'center',
  },
  emptyText: {
    color: '#777777',
    textAlign: 'center',
    marginTop: 20,
    fontSize: 15,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 12,
    maxHeight: '80%',
  },
  optionsList: {
    maxHeight: 300,
  },
  option: {
    padding: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },
  optionText: {
    fontSize: 16,
    color: '#333333',
  },
});
