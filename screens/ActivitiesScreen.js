
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
  getAllActivities,
  addActivity,
  updateActivity,
  deleteActivity,
  getAllFields,
} from '../database/database';

// Activity types for dropdown
const ACTIVITY_TYPES = [
  'Watering',
  'Fertilizing',
  'Weeding',
  'Planting',
  'Harvesting',
  'Pest Control',
  'Other',
];

const WEEK_DAYS = [
  'Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa',
];

// Show alerts on Web and Android
function showMessage(title, message) {
  if (Platform.OS === 'web') {
    window.alert(`${title}\n${message}`);
  } else {
    Alert.alert(title, message);
  }
}

// Format date as YYYY-MM-DD
function formatDate(year, month, day) {
  return (
    `${year}-${String(month + 1).padStart(2, '0')}-` +
    String(day).padStart(2, '0')
  );
}

// Validate a YYYY-MM-DD date
function parseDate(value) {
  const match = String(value || '').match(
    /^(\d{4})-(\d{2})-(\d{2})$/
  );

  if (!match) return null;

  const year = Number(match[1]);
  const month = Number(match[2]) - 1;
  const day = Number(match[3]);

  const date = new Date(year, month, day);

  if (
    date.getFullYear() !== year ||
    date.getMonth() !== month ||
    date.getDate() !== day
  ) {
    return null;
  }

  return date;
}

// Reusable dropdown
function DropdownField({
  label,
  value,
  options,
  placeholder,
  onSelect,
  emptyMessage,
}) {
  const [visible, setVisible] = useState(false);

  // Preserve older saved values
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
              {availableOptions.length === 0 ? (
                <Text style={styles.emptyText}>
                  {emptyMessage || 'No options available.'}
                </Text>
              ) : (
                availableOptions.map((option) => (
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
                ))
              )}
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

export default function ActivitiesScreen() {
  // Saved activities
  const [activities, setActivities] = useState([]);

  // Saved fields for dropdown
  const [fields, setFields] = useState([]);

  // Form values
  const [name, setName] = useState('');
  const [fieldName, setFieldName] = useState('');
  const [activityDate, setActivityDate] = useState('');
  const [description, setDescription] = useState('');

  // Search and editing
  const [search, setSearch] = useState('');
  const [editId, setEditId] = useState(null);

  // Calendar
  const [calendarVisible, setCalendarVisible] = useState(false);
  const [calendarMonth, setCalendarMonth] = useState(new Date());

  // Load activities and fields
  const loadData = useCallback(() => {
    try {
      setActivities(getAllActivities());
      setFields(getAllFields());
    } catch (error) {
      console.log(error);
      showMessage(
        'Error',
        'Unable to load activities or fields.'
      );
    }
  }, []);

  // Refresh data when Activities tab opens
  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [loadData])
  );

  // Reset form
  function clearForm() {
    setName('');
    setFieldName('');
    setActivityDate('');
    setDescription('');
    setEditId(null);
  }

  // Add or update activity
  function handleSave() {
    const cleanName = name.trim();
    const cleanFieldName = fieldName.trim();
    const cleanDescription = description.trim();

    if (
      !cleanName ||
      !cleanFieldName ||
      !activityDate ||
      !cleanDescription
    ) {
      showMessage(
        'Missing Information',
        'Please fill all fields.'
      );
      return;
    }

    if (!parseDate(activityDate)) {
      showMessage(
        'Invalid Date',
        'Please select a valid activity date.'
      );
      return;
    }

    try {
      if (editId !== null) {
        updateActivity(
          editId,
          cleanName,
          cleanFieldName,
          activityDate,
          cleanDescription
        );

        showMessage(
          'Success',
          'Activity updated successfully!'
        );
      } else {
        addActivity(
          cleanName,
          cleanFieldName,
          activityDate,
          cleanDescription
        );

        showMessage(
          'Success',
          'Activity added successfully!'
        );
      }

      clearForm();
      loadData();
    } catch (error) {
      console.log(error);
      showMessage(
        'Error',
        'Unable to save activity.'
      );
    }
  }

  // Edit an existing activity
  function handleEdit(activity) {
    setEditId(activity.id);
    setName(String(activity.name ?? ''));
    setFieldName(String(activity.fieldName ?? ''));
    setActivityDate(String(activity.activityDate ?? ''));
    setDescription(String(activity.description ?? ''));
  }

  // Delete activity
  function handleDelete(id) {
    const removeActivity = () => {
      try {
        deleteActivity(id);

        if (editId === id) {
          clearForm();
        }

        loadData();
      } catch (error) {
        console.log(error);
        showMessage(
          'Error',
          'Unable to delete activity.'
        );
      }
    };

    if (Platform.OS === 'web') {
      if (
        window.confirm(
          'Are you sure you want to delete this activity?'
        )
      ) {
        removeActivity();
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
            onPress: removeActivity,
          },
        ]
      );
    }
  }

  // Open calendar at selected date
  function openCalendar() {
    setCalendarMonth(
      parseDate(activityDate) || new Date()
    );
    setCalendarVisible(true);
  }

  // Change calendar month
  function changeMonth(amount) {
    setCalendarMonth((current) => {
      return new Date(
        current.getFullYear(),
        current.getMonth() + amount,
        1
      );
    });
  }

  // Select calendar date
  function selectDate(day) {
    const selectedDate = formatDate(
      calendarMonth.getFullYear(),
      calendarMonth.getMonth(),
      day
    );

    setActivityDate(selectedDate);
    setCalendarVisible(false);
  }

  // Create calendar grid
  function renderCalendarDays() {
    const year = calendarMonth.getFullYear();
    const month = calendarMonth.getMonth();

    const firstDay = new Date(year, month, 1).getDay();

    const daysInMonth = new Date(
      year,
      month + 1,
      0
    ).getDate();

    const cells = [];

    // Empty cells before first day
    for (let i = 0; i < firstDay; i++) {
      cells.push(
        <View
          key={`empty-${i}`}
          style={styles.calendarDay}
        />
      );
    }

    // Actual calendar days
    for (let day = 1; day <= daysInMonth; day++) {
      const dateValue = formatDate(year, month, day);
      const isSelected = dateValue === activityDate;

      cells.push(
        <TouchableOpacity
          key={dateValue}
          style={[
            styles.calendarDay,
            isSelected && styles.selectedDay,
          ]}
          onPress={() => selectDate(day)}
        >
          <Text
            style={[
              styles.calendarDayText,
              isSelected && styles.selectedDayText,
            ]}
          >
            {day}
          </Text>
        </TouchableOpacity>
      );
    }

    return cells;
  }

  // Field dropdown options
  const fieldOptions = [
    ...new Set(
      fields
        .map((field) => String(field.name ?? '').trim())
        .filter(Boolean)
    ),
  ];

  // Search activities
  const filteredActivities = activities.filter((activity) => {
    const keyword = search.toLowerCase().trim();

    return (
      String(activity.name ?? '')
        .toLowerCase()
        .includes(keyword) ||
      String(activity.fieldName ?? '')
        .toLowerCase()
        .includes(keyword) ||
      String(activity.description ?? '')
        .toLowerCase()
        .includes(keyword) ||
      String(activity.activityDate ?? '')
        .toLowerCase()
        .includes(keyword)
    );
  });

  return (
    <View style={styles.container}>
      <FlatList
        data={filteredActivities}
        keyExtractor={(item) => String(item.id)}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={
          <View>
            <Text style={styles.title}>
              🌾 Farm Activities
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

              {/* Activity Name Dropdown */}
              <DropdownField
                label="Activity Name"
                value={name}
                options={ACTIVITY_TYPES}
                placeholder="Select Activity Type"
                onSelect={setName}
              />

              {/* Field Dropdown */}
              <DropdownField
                label="Field Name"
                value={fieldName}
                options={fieldOptions}
                placeholder="Select Farm Field"
                onSelect={setFieldName}
                emptyMessage="No fields found. Add a field in the Fields tab first."
              />

              {/* Calendar Date Picker */}
              <Text style={styles.label}>
                Activity Date
              </Text>

              <TouchableOpacity
                style={styles.input}
                onPress={openCalendar}
              >
                <Text
                  style={
                    activityDate
                      ? styles.selectedText
                      : styles.placeholderText
                  }
                >
                  {activityDate ||
                    '📅 Select Activity Date'}
                </Text>
              </TouchableOpacity>

              {/* Description */}
              <Text style={styles.label}>
                Description
              </Text>

              <TextInput
                style={[
                  styles.input,
                  styles.descriptionInput,
                ]}
                placeholder="Describe the activity..."
                value={description}
                onChangeText={setDescription}
                multiline
              />

              {/* Save Button */}
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

            {/* Search */}
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
              🌱 {item.name}
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
            {search
              ? 'No matching activities found.'
              : 'No activities added yet.'}
          </Text>
        }
      />

      {/* Calendar Modal */}
      <Modal
        visible={calendarVisible}
        transparent
        animationType="fade"
        onRequestClose={() =>
          setCalendarVisible(false)
        }
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.heading}>
              Select Activity Date
            </Text>

            <View style={styles.monthNavigation}>
              <TouchableOpacity
                style={styles.monthButton}
                onPress={() => changeMonth(-1)}
              >
                <Text style={styles.monthArrow}>
                  ‹
                </Text>
              </TouchableOpacity>

              <Text style={styles.monthTitle}>
                {calendarMonth.toLocaleDateString(
                  'en-US',
                  {
                    month: 'long',
                    year: 'numeric',
                  }
                )}
              </Text>

              <TouchableOpacity
                style={styles.monthButton}
                onPress={() => changeMonth(1)}
              >
                <Text style={styles.monthArrow}>
                  ›
                </Text>
              </TouchableOpacity>
            </View>

            <View style={styles.calendarGrid}>
              {WEEK_DAYS.map((day, index) => (
                <View
                  key={`${day}-${index}`}
                  style={styles.calendarDay}
                >
                  <Text style={styles.weekDayText}>
                    {day}
                  </Text>
                </View>
              ))}

              {renderCalendarDays()}
            </View>

            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() =>
                setCalendarVisible(false)
              }
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
    fontSize: 15,
    color: '#222222',
  },
  placeholderText: {
    fontSize: 15,
    color: '#777777',
  },
  descriptionInput: {
    minHeight: 90,
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
    maxHeight: '85%',
  },
  optionsList: {
    maxHeight: 280,
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
  monthNavigation: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  monthButton: {
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  monthArrow: {
    fontSize: 30,
    color: '#1B5E20',
  },
  monthTitle: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#1B5E20',
  },
  calendarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 10,
  },
  calendarDay: {
    width: '14.2857%',
    height: 42,
    justifyContent: 'center',
    alignItems: 'center',
  },
  calendarDayText: {
    fontSize: 15,
    color: '#333333',
  },
  weekDayText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#666666',
  },
  selectedDay: {
    backgroundColor: '#2E7D32',
    borderRadius: 8,
  },
  selectedDayText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
});
