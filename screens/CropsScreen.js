
import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Alert,
  Modal,
  Platform,
  ScrollView,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';

import {
  getAllCrops,
  addCrop,
  updateCrop,
  deleteCrop,
} from '../database/database';

// Crop categories shown in the dropdown
const CROP_TYPES = [
  'Vegetable',
  'Fruit',
  'Grain',
  'Legume',
  'Spice',
  'Other',
];

const WEEK_DAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

// Convert a date to YYYY-MM-DD
function formatDate(year, month, day) {
  return (
    `${year}-${String(month + 1).padStart(2, '0')}-` +
    String(day).padStart(2, '0')
  );
}

// Check whether a saved date is valid
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

// Show messages on both Web and Android
function showMessage(title, message) {
  if (Platform.OS === 'web') {
    window.alert(`${title}\n${message}`);
  } else {
    Alert.alert(title, message);
  }
}

export default function CropsScreen() {
  const [crops, setCrops] = useState([]);

  // Form inputs
  const [name, setName] = useState('');
  const [type, setType] = useState('');
  const [plantingDate, setPlantingDate] = useState('');
  const [quantity, setQuantity] = useState('');

  // Edit and search
  const [editingId, setEditingId] = useState(null);
  const [search, setSearch] = useState('');

  // Dropdown and calendar visibility
  const [typeDropdownVisible, setTypeDropdownVisible] = useState(false);
  const [calendarVisible, setCalendarVisible] = useState(false);

  // Calendar month being displayed
  const [calendarMonth, setCalendarMonth] = useState(new Date());

  // Load crops from Web localStorage or Android SQLite
  const loadCrops = useCallback(() => {
    try {
      const savedCrops = getAllCrops();
      setCrops(savedCrops);
    } catch (error) {
      console.log(error);
      showMessage('Error', 'Unable to load crops.');
    }
  }, []);

  // Refresh when Crops tab is opened
  useFocusEffect(
    useCallback(() => {
      loadCrops();
    }, [loadCrops])
  );

  // Clear the form
  function clearForm() {
    setName('');
    setType('');
    setPlantingDate('');
    setQuantity('');
    setEditingId(null);
  }

  // Save or update a crop
  function handleSave() {
    const cleanName = name.trim();
    const cleanType = type.trim();
    const cleanQuantity = quantity.trim();

    if (
      !cleanName ||
      !cleanType ||
      !plantingDate ||
      !cleanQuantity
    ) {
      showMessage(
        'Missing Information',
        'Please fill all fields.'
      );
      return;
    }

    if (!parseDate(plantingDate)) {
      showMessage(
        'Invalid Date',
        'Please select a valid planting date.'
      );
      return;
    }

    // Quantity must be a positive whole number
    if (
      !/^\d+$/.test(cleanQuantity) ||
      Number(cleanQuantity) <= 0 ||
      !Number.isSafeInteger(Number(cleanQuantity))
    ) {
      showMessage(
        'Invalid Quantity',
        'Enter a positive whole number, e.g. 100.'
      );
      return;
    }

    try {
      if (editingId !== null) {
        updateCrop(
          editingId,
          cleanName,
          cleanType,
          plantingDate,
          cleanQuantity
        );

        showMessage(
          'Success',
          'Crop updated successfully.'
        );
      } else {
        addCrop(
          cleanName,
          cleanType,
          plantingDate,
          cleanQuantity
        );

        showMessage(
          'Success',
          'Crop added successfully.'
        );
      }

      clearForm();
      loadCrops();
    } catch (error) {
      console.log(error);
      showMessage('Error', 'Unable to save crop.');
    }
  }

  // Fill the form with an existing crop
  function handleEdit(item) {
    setEditingId(item.id);
    setName(String(item.name ?? ''));
    setType(String(item.type ?? ''));
    setPlantingDate(String(item.plantingDate ?? ''));

    // Support older records such as "100 plants"
    const oldQuantity = String(item.quantity ?? '').trim();
    const match = oldQuantity.match(/^(\d+)\s*plants?$/i);

    setQuantity(match ? match[1] : oldQuantity);
  }

  // Delete a crop after confirmation
  function handleDelete(id) {
    const removeCrop = () => {
      try {
        deleteCrop(id);
        loadCrops();
      } catch (error) {
        console.log(error);
        showMessage('Error', 'Unable to delete crop.');
      }
    };

    if (Platform.OS === 'web') {
      if (
        window.confirm(
          'Are you sure you want to delete this crop?'
        )
      ) {
        removeCrop();
      }
    } else {
      Alert.alert(
        'Delete Crop',
        'Are you sure you want to delete this crop?',
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Delete',
            style: 'destructive',
            onPress: removeCrop,
          },
        ]
      );
    }
  }

  // Open calendar at selected date or current month
  function openCalendar() {
    const selectedDate = parseDate(plantingDate);
    setCalendarMonth(selectedDate || new Date());
    setCalendarVisible(true);
  }

  // Navigate to previous or next month
  function changeMonth(amount) {
    setCalendarMonth((current) => {
      return new Date(
        current.getFullYear(),
        current.getMonth() + amount,
        1
      );
    });
  }

  // Select a date from the calendar
  function selectDate(day) {
    const selected = formatDate(
      calendarMonth.getFullYear(),
      calendarMonth.getMonth(),
      day
    );

    setPlantingDate(selected);
    setCalendarVisible(false);
  }

  // Generate the calendar grid
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

    // Empty spaces before the first day
    for (let i = 0; i < firstDay; i++) {
      cells.push(
        <View
          key={`empty-${i}`}
          style={styles.calendarDay}
        />
      );
    }

    // Actual dates
    for (let day = 1; day <= daysInMonth; day++) {
      const dateValue = formatDate(year, month, day);
      const isSelected = dateValue === plantingDate;

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

  // Include a saved custom category when editing
  const availableTypes = [
    ...new Set([
      ...CROP_TYPES,
      ...(type ? [type] : []),
    ]),
  ];

  // Search crops by name or category
  const filteredCrops = crops.filter((item) => {
    const keyword = search.toLowerCase();

    return (
      String(item.name ?? '')
        .toLowerCase()
        .includes(keyword) ||
      String(item.type ?? '')
        .toLowerCase()
        .includes(keyword)
    );
  });

  return (
    <View style={styles.container}>
      <FlatList
        contentContainerStyle={styles.content}
        data={filteredCrops}
        keyExtractor={(item) => String(item.id)}
        keyboardShouldPersistTaps="handled"
        ListHeaderComponent={
          <View>
            <Text style={styles.heading}>
              🌾 Crop Management
            </Text>

            <Text style={styles.subtitle}>
              Add and manage your farm crops
            </Text>

            <View style={styles.form}>
              <Text style={styles.formTitle}>
                {editingId !== null
                  ? 'Edit Crop'
                  : 'Add New Crop'}
              </Text>

              {/* Crop Name */}
              <Text style={styles.fieldLabel}>
                Crop Name
              </Text>

              <TextInput
                style={styles.input}
                placeholder="e.g. Rice"
                value={name}
                onChangeText={setName}
              />

              {/* Crop Type Dropdown */}
              <Text style={styles.fieldLabel}>
                Crop Type
              </Text>

              <TouchableOpacity
                style={styles.input}
                onPress={() =>
                  setTypeDropdownVisible(true)
                }
              >
                <Text
                  style={
                    type
                      ? styles.selectedInputText
                      : styles.placeholderText
                  }
                >
                  {type || 'Select Crop Type ▼'}
                </Text>
              </TouchableOpacity>

              {/* Planting Date Calendar */}
              <Text style={styles.fieldLabel}>
                Planting Date
              </Text>

              <TouchableOpacity
                style={styles.input}
                onPress={openCalendar}
              >
                <Text
                  style={
                    plantingDate
                      ? styles.selectedInputText
                      : styles.placeholderText
                  }
                >
                  {plantingDate ||
                    '📅 Select Planting Date'}
                </Text>
              </TouchableOpacity>

              {/* Numeric Quantity */}
              <Text style={styles.fieldLabel}>
                Quantity (Number of Plants)
              </Text>

              <TextInput
                style={styles.input}
                placeholder="e.g. 100"
                value={quantity}
                onChangeText={(value) => {
                  // Allow digits only
                  setQuantity(
                    value.replace(/[^0-9]/g, '')
                  );
                }}
                keyboardType="number-pad"
              />

              <TouchableOpacity
                style={styles.saveButton}
                onPress={handleSave}
              >
                <Text style={styles.buttonText}>
                  {editingId !== null
                    ? 'Update Crop'
                    : 'Add Crop'}
                </Text>
              </TouchableOpacity>

              {editingId !== null && (
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

            <Text style={styles.listTitle}>
              My Crops ({crops.length})
            </Text>

            <TextInput
              style={styles.input}
              placeholder="Search crops by name or type..."
              value={search}
              onChangeText={setSearch}
            />
          </View>
        }
        renderItem={({ item }) => (
          <View style={styles.cropCard}>
            <Text style={styles.cropName}>
              🌱 {item.name}
            </Text>

            <Text style={styles.cropInfo}>
              Type: {item.type}
            </Text>

            <Text style={styles.cropInfo}>
              Planting Date: {item.plantingDate}
            </Text>

            <Text style={styles.cropInfo}>
              Quantity: {item.quantity}
            </Text>

            <View style={styles.actions}>
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
          <Text style={styles.empty}>
            {search
              ? 'No matching crops found.'
              : 'No crops added yet.'}
          </Text>
        }
      />

      {/* Crop Type Dropdown Modal */}
      <Modal
        visible={typeDropdownVisible}
        transparent
        animationType="fade"
        onRequestClose={() =>
          setTypeDropdownVisible(false)
        }
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.formTitle}>
              Select Crop Type
            </Text>

            <ScrollView style={styles.optionsList}>
              {availableTypes.map((option) => (
                <TouchableOpacity
                  key={option}
                  style={styles.dropdownOption}
                  onPress={() => {
                    setType(option);
                    setTypeDropdownVisible(false);
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
              onPress={() =>
                setTypeDropdownVisible(false)
              }
            >
              <Text style={styles.buttonText}>
                Cancel
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Cross-platform Calendar Modal */}
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
            <Text style={styles.formTitle}>
              Select Planting Date
            </Text>

            <View style={styles.monthNavigation}>
              <TouchableOpacity
                onPress={() => changeMonth(-1)}
                style={styles.monthButton}
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
                onPress={() => changeMonth(1)}
                style={styles.monthButton}
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
  },
  content: {
    padding: 18,
    paddingBottom: 30,
  },
  heading: {
    fontSize: 25,
    fontWeight: 'bold',
    color: '#1B5E20',
    marginTop: 15,
  },
  subtitle: {
    color: '#666',
    marginTop: 6,
    marginBottom: 18,
  },
  form: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    marginBottom: 22,
    elevation: 2,
  },
  formTitle: {
    fontSize: 19,
    fontWeight: 'bold',
    color: '#1B5E20',
    marginBottom: 12,
  },
  fieldLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 6,
  },
  input: {
    backgroundColor: '#F5F5F5',
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    fontSize: 15,
    minHeight: 48,
    justifyContent: 'center',
  },
  selectedInputText: {
    color: '#222',
    fontSize: 15,
  },
  placeholderText: {
    color: '#777',
    fontSize: 15,
  },
  saveButton: {
    backgroundColor: '#1B5E20',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#757575',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  listTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1B5E20',
    marginBottom: 12,
  },
  cropCard: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 10,
    marginBottom: 12,
    elevation: 2,
  },
  cropName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1B5E20',
    marginBottom: 8,
  },
  cropInfo: {
    fontSize: 14,
    color: '#555',
    marginBottom: 4,
  },
  actions: {
    flexDirection: 'row',
    marginTop: 12,
    gap: 10,
  },
  editButton: {
    flex: 1,
    backgroundColor: '#388E3C',
    padding: 10,
    borderRadius: 7,
    alignItems: 'center',
  },
  deleteButton: {
    flex: 1,
    backgroundColor: '#C62828',
    padding: 10,
    borderRadius: 7,
    alignItems: 'center',
  },
  empty: {
    textAlign: 'center',
    color: '#777',
    padding: 20,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 12,
    maxHeight: '85%',
  },
  optionsList: {
    maxHeight: 280,
  },
  dropdownOption: {
    padding: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#EEE',
  },
  optionText: {
    fontSize: 16,
    color: '#333',
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
    color: '#333',
  },
  weekDayText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#666',
  },
  selectedDay: {
    backgroundColor: '#2E7D32',
    borderRadius: 8,
  },
  selectedDayText: {
    color: 'white',
    fontWeight: 'bold',
  },
});
