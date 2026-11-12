
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
  getAllFields,
  addField,
  updateField,
  deleteField,
} from '../database/database';

export default function FieldsScreen() {

  // State variables
  const [fields, setFields] = useState([]);
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [size, setSize] = useState('');
  const [soilType, setSoilType] = useState('');
  const [search, setSearch] = useState('');
  const [editId, setEditId] = useState(null);

  // Load saved fields
  const loadFields = useCallback(() => {
    setFields(getAllFields());
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadFields();
    }, [loadFields])
  );

  // Clear form
  const clearForm = () => {
    setName('');
    setLocation('');
    setSize('');
    setSoilType('');
    setEditId(null);
  };

  // Show messages on web and mobile
  const showMessage = (title, message) => {
    if (Platform.OS === 'web') {
      window.alert(message);
    } else {
      Alert.alert(title, message);
    }
  };

  // CREATE and UPDATE
  const handleSave = () => {

    if (
      !name.trim() ||
      !location.trim() ||
      !size.trim() ||
      !soilType.trim()
    ) {
      showMessage('Error', 'Please fill all fields.');
      return;
    }

    if (editId !== null) {
      updateField(
        editId,
        name.trim(),
        location.trim(),
        size.trim(),
        soilType.trim()
      );

      showMessage('Success', 'Field updated successfully!');
    } else {
      addField(
        name.trim(),
        location.trim(),
        size.trim(),
        soilType.trim()
      );

      showMessage('Success', 'Field added successfully!');
    }

    clearForm();
    loadFields();
  };

  // EDIT
  const handleEdit = (field) => {
    setName(field.name);
    setLocation(field.location);
    setSize(field.size);
    setSoilType(field.soilType);
    setEditId(field.id);
  };

  // DELETE
  const handleDelete = (id) => {

    if (Platform.OS === 'web') {
      const confirmed = window.confirm(
        'Are you sure you want to delete this field?'
      );

      if (confirmed) {
        deleteField(id);
        if (editId === id) clearForm();
        loadFields();
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
            onPress: () => {
              deleteField(id);
              if (editId === id) clearForm();
              loadFields();
            },
          },
        ]
      );
    }
  };

  // SEARCH
  const filteredFields = fields.filter((field) => {
    const keyword = search.toLowerCase().trim();

    return (
      field.name.toLowerCase().includes(keyword) ||
      field.location.toLowerCase().includes(keyword) ||
      field.soilType.toLowerCase().includes(keyword)
    );
  });

  return (
    <View style={styles.container}>

      <FlatList
        data={filteredFields}
        keyExtractor={(item) => String(item.id)}
        keyboardShouldPersistTaps="handled"

        ListHeaderComponent={
          <View>

            <Text style={styles.title}>
              Farm Fields
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

              <TextInput
                style={styles.input}
                placeholder="Field Name"
                value={name}
                onChangeText={setName}
              />

              <TextInput
                style={styles.input}
                placeholder="Location"
                value={location}
                onChangeText={setLocation}
              />

              <TextInput
                style={styles.input}
                placeholder="Field Size (e.g. 2 acres)"
                value={size}
                onChangeText={setSize}
              />

              <TextInput
                style={styles.input}
                placeholder="Soil Type (e.g. Clay)"
                value={soilType}
                onChangeText={setSoilType}
              />

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

            {/* SEARCH */}
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
              {item.name}
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
            No matching fields found.
          </Text>
        }

        contentContainerStyle={styles.listContent}
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

});
