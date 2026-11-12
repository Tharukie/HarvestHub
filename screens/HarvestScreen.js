
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
} from 'react-native';

import { useFocusEffect } from '@react-navigation/native';

import {
  getAllHarvests,
  addHarvest,
  updateHarvest,
  deleteHarvest,
} from '../database/database';

export default function HarvestScreen() {
  // Saved harvest records
  const [harvests, setHarvests] = useState([]);

  // Form values
  const [cropName, setCropName] = useState('');
  const [fieldName, setFieldName] = useState('');
  const [harvestDate, setHarvestDate] = useState('');
  const [quantity, setQuantity] = useState('');
  const [notes, setNotes] = useState('');

  // Search and edit
  const [search, setSearch] = useState('');
  const [editId, setEditId] = useState(null);

  // Load saved harvest records
  const loadHarvests = useCallback(() => {
    setHarvests(getAllHarvests());
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadHarvests();
    }, [loadHarvests])
  );

  // Display messages
  const showMessage = (title, message) => {
    if (Platform.OS === 'web') {
      window.alert(message);
    } else {
      Alert.alert(title, message);
    }
  };

  // Clear form
  const clearForm = () => {
    setCropName('');
    setFieldName('');
    setHarvestDate('');
    setQuantity('');
    setNotes('');
    setEditId(null);
  };

  // Validate YYYY-MM-DD date
  const isValidDate = (value) => {
    const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);

    if (!match) return false;

    const year = Number(match[1]);
    const month = Number(match[2]);
    const day = Number(match[3]);

    const date = new Date(Date.UTC(year, month - 1, day));

    return (
      date.getUTCFullYear() === year &&
      date.getUTCMonth() === month - 1 &&
      date.getUTCDate() === day
    );
  };

  // CREATE / UPDATE
  const handleSave = () => {
    const cleanCrop = cropName.trim();
    const cleanField = fieldName.trim();
    const cleanDate = harvestDate.trim();
    const cleanQuantity = quantity.trim();
    const cleanNotes = notes.trim();

    if (
      !cleanCrop ||
      !cleanField ||
      !cleanDate ||
      !cleanQuantity
    ) {
      showMessage(
        'Error',
        'Please fill Crop Name, Field Name, Harvest Date and Quantity.'
      );
      return;
    }

    if (!isValidDate(cleanDate)) {
      showMessage(
        'Error',
        'Enter a valid date in YYYY-MM-DD format.'
      );
      return;
    }

    const quantityNumber = Number(cleanQuantity);

    if (
      !Number.isFinite(quantityNumber) ||
      quantityNumber <= 0
    ) {
      showMessage(
        'Error',
        'Quantity must be greater than zero.'
      );
      return;
    }

    if (editId !== null) {
      // UPDATE
      updateHarvest(
        editId,
        cleanCrop,
        cleanField,
        cleanDate,
        String(quantityNumber),
        cleanNotes
      );

      showMessage(
        'Success',
        'Harvest updated successfully!'
      );
    } else {
      // CREATE
      addHarvest(
        cleanCrop,
        cleanField,
        cleanDate,
        String(quantityNumber),
        cleanNotes
      );

      showMessage(
        'Success',
        'Harvest added successfully!'
      );
    }

    clearForm();
    loadHarvests();
  };

  // EDIT
  const handleEdit = (harvest) => {
    setCropName(harvest.cropName);
    setFieldName(harvest.fieldName);
    setHarvestDate(harvest.harvestDate);
    setQuantity(String(harvest.quantity));
    setNotes(harvest.notes || '');
    setEditId(harvest.id);
  };

  // DELETE
  const handleDelete = (id) => {
    const performDelete = () => {
      deleteHarvest(id);

      if (editId === id) {
        clearForm();
      }

      loadHarvests();
    };

    if (Platform.OS === 'web') {
      const confirmed = window.confirm(
        'Are you sure you want to delete this harvest record?'
      );

      if (confirmed) {
        performDelete();
      }
    } else {
      Alert.alert(
        'Delete Harvest',
        'Are you sure you want to delete this harvest record?',
        [
          {
            text: 'Cancel',
            style: 'cancel',
          },
          {
            text: 'Delete',
            style: 'destructive',
            onPress: performDelete,
          },
        ]
      );
    }
  };

  // SEARCH
  const filteredHarvests = harvests.filter((harvest) => {
    const keyword = search.toLowerCase().trim();

    return (
      harvest.cropName.toLowerCase().includes(keyword) ||
      harvest.fieldName.toLowerCase().includes(keyword) ||
      harvest.harvestDate.toLowerCase().includes(keyword) ||
      String(harvest.quantity).includes(keyword) ||
      (harvest.notes || '').toLowerCase().includes(keyword)
    );
  });

  // Total harvested quantity
  const totalQuantity = harvests.reduce(
    (sum, harvest) => sum + Number(harvest.quantity || 0),
    0
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={filteredHarvests}
        keyExtractor={(item) => String(item.id)}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={styles.listContent}

        ListHeaderComponent={
          <View>
            <Text style={styles.title}>
              Harvest Management
            </Text>

            <Text style={styles.subtitle}>
              Track and manage your farm harvests
            </Text>

            {/* SUMMARY */}
            <View style={styles.summaryBox}>
              <Text style={styles.summaryText}>
                Total Harvest Records: {harvests.length}
              </Text>

              <Text style={styles.summaryText}>
                Total Harvest Quantity: {totalQuantity} kg
              </Text>
            </View>

            {/* FORM */}
            <View style={styles.form}>
              <Text style={styles.heading}>
                {editId !== null
                  ? 'Edit Harvest Record'
                  : 'Add New Harvest'}
              </Text>

              <TextInput
                style={styles.input}
                placeholder="Crop Name (e.g. Rice)"
                value={cropName}
                onChangeText={setCropName}
              />

              <TextInput
                style={styles.input}
                placeholder="Field Name (e.g. South Field)"
                value={fieldName}
                onChangeText={setFieldName}
              />

              <TextInput
                style={styles.input}
                placeholder="Harvest Date (YYYY-MM-DD)"
                value={harvestDate}
                onChangeText={setHarvestDate}
              />

              <TextInput
                style={styles.input}
                placeholder="Quantity in kg (e.g. 250)"
                value={quantity}
                onChangeText={setQuantity}
                keyboardType="numeric"
              />

              <TextInput
                style={[styles.input, styles.notesInput]}
                placeholder="Notes (optional)"
                value={notes}
                onChangeText={setNotes}
                multiline
              />

              <TouchableOpacity
                style={styles.saveButton}
                onPress={handleSave}
              >
                <Text style={styles.buttonText}>
                  {editId !== null
                    ? 'Update Harvest'
                    : 'Add Harvest'}
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

            {/* SEARCH */}
            <TextInput
              style={styles.searchInput}
              placeholder="Search harvest records..."
              value={search}
              onChangeText={setSearch}
            />

            <Text style={styles.heading}>
              My Harvests ({harvests.length})
            </Text>
          </View>
        }

        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.cropTitle}>
              {item.cropName}
            </Text>

            <Text style={styles.detail}>
              Field: {item.fieldName}
            </Text>

            <Text style={styles.detail}>
              Harvest Date: {item.harvestDate}
            </Text>

            <Text style={styles.detail}>
              Quantity: {item.quantity} kg
            </Text>

            <Text style={styles.detail}>
              Notes: {item.notes || 'No notes'}
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
                onPress={() => handleDelete(item.id)}
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
            No matching harvest records found.
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
    marginBottom: 18,
  },

  summaryBox: {
    backgroundColor: '#C8E6C9',
    padding: 16,
    borderRadius: 12,
    marginBottom: 18,
  },

  summaryText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1B5E20',
    marginBottom: 5,
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

  input: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#C8E6C9',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    fontSize: 15,
    color: '#222222',
  },

  notesInput: {
    minHeight: 75,
    textAlignVertical: 'top',
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

  cropTitle: {
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
});
