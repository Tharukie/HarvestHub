
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
  getAllActivities,
  addActivity,
  updateActivity,
  deleteActivity,
} from '../database/database';

export default function ActivitiesScreen() {

  const [activities, setActivities] = useState([]);

  const [name, setName] = useState('');
  const [fieldName, setFieldName] = useState('');
  const [activityDate, setActivityDate] = useState('');
  const [description, setDescription] = useState('');

  const [search, setSearch] = useState('');
  const [editId, setEditId] = useState(null);

  // Load activities
  const loadActivities = useCallback(() => {
    setActivities(getAllActivities());
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadActivities();
    }, [loadActivities])
  );

  // Show alert on web and mobile
  const showMessage = (title, message) => {
    if (Platform.OS === 'web') {
      window.alert(message);
    } else {
      Alert.alert(title, message);
    }
  };

  // Clear form
  const clearForm = () => {
    setName('');
    setFieldName('');
    setActivityDate('');
    setDescription('');
    setEditId(null);
  };

  // CREATE / UPDATE
  const handleSave = () => {

    if (
      !name.trim() ||
      !fieldName.trim() ||
      !activityDate.trim() ||
      !description.trim()
    ) {
      showMessage('Error', 'Please fill all fields.');
      return;
    }

    if (editId !== null) {

      updateActivity(
        editId,
        name.trim(),
        fieldName.trim(),
        activityDate.trim(),
        description.trim()
      );

      showMessage(
        'Success',
        'Activity updated successfully!'
      );

    } else {

      addActivity(
        name.trim(),
        fieldName.trim(),
        activityDate.trim(),
        description.trim()
      );

      showMessage(
        'Success',
        'Activity added successfully!'
      );
    }

    clearForm();
    loadActivities();
  };

  // EDIT
  const handleEdit = (activity) => {
    setName(activity.name);
    setFieldName(activity.fieldName);
    setActivityDate(activity.activityDate);
    setDescription(activity.description);
    setEditId(activity.id);
  };

  // DELETE
  const handleDelete = (id) => {

    if (Platform.OS === 'web') {

      const confirmed = window.confirm(
        'Are you sure you want to delete this activity?'
      );

      if (confirmed) {
        deleteActivity(id);
        if (editId === id) clearForm();
        loadActivities();
      }

    } else {

      Alert.alert(
        'Delete Activity',
        'Are you sure you want to delete this activity?',
        [
          {
            text: 'Cancel',
            style: 'cancel',
          },
          {
            text: 'Delete',
            style: 'destructive',
            onPress: () => {
              deleteActivity(id);
              if (editId === id) clearForm();
              loadActivities();
            },
          },
        ]
      );
    }
  };

  // SEARCH
  const filteredActivities = activities.filter((activity) => {

    const keyword = search.toLowerCase().trim();

    return (
      activity.name.toLowerCase().includes(keyword) ||
      activity.fieldName.toLowerCase().includes(keyword) ||
      activity.description.toLowerCase().includes(keyword) ||
      activity.activityDate.toLowerCase().includes(keyword)
    );
  });

  return (
    <View style={styles.container}>

      <FlatList
        data={filteredActivities}
        keyExtractor={(item) => String(item.id)}
        keyboardShouldPersistTaps="handled"

        ListHeaderComponent={
          <View>

            <Text style={styles.title}>
              Farm Activities
            </Text>

            <Text style={styles.subtitle}>
              Manage your daily farming activities
            </Text>

            {/* ADD / EDIT FORM */}
            <View style={styles.form}>

              <Text style={styles.heading}>
                {editId !== null
                  ? 'Edit Farm Activity'
                  : 'Add New Activity'}
              </Text>

              <TextInput
                style={styles.input}
                placeholder="Activity Name (e.g. Watering)"
                value={name}
                onChangeText={setName}
              />

              <TextInput
                style={styles.input}
                placeholder="Field Name (e.g. South Field)"
                value={fieldName}
                onChangeText={setFieldName}
              />

              <TextInput
                style={styles.input}
                placeholder="Activity Date (YYYY-MM-DD)"
                value={activityDate}
                onChangeText={setActivityDate}
              />

              <TextInput
                style={[styles.input, styles.descriptionInput]}
                placeholder="Description"
                value={description}
                onChangeText={setDescription}
                multiline
              />

              <TouchableOpacity
                style={styles.saveButton}
                onPress={handleSave}
              >
                <Text style={styles.buttonText}>
                  {editId !== null
                    ? 'Update Activity'
                    : 'Add Activity'}
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
              placeholder="Search activities..."
              value={search}
              onChangeText={setSearch}
            />

            <Text style={styles.heading}>
              My Activities ({activities.length})
            </Text>

          </View>
        }

        renderItem={({ item }) => (
          <View style={styles.card}>

            <Text style={styles.activityName}>
              {item.name}
            </Text>

            <Text style={styles.detail}>
              Field: {item.fieldName}
            </Text>

            <Text style={styles.detail}>
              Date: {item.activityDate}
            </Text>

            <Text style={styles.detail}>
              Description: {item.description}
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
            No matching activities found.
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

  descriptionInput: {
    minHeight: 80,
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

  activityName: {
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
