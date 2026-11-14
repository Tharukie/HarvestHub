
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
  getAllHarvests,
  addHarvest,
  updateHarvest,
  deleteHarvest,
  getAllCrops,
  getAllFields,
} from '../database/database';

const WEEK_DAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

function showMessage(title, message) {
  if (Platform.OS === 'web') {
    window.alert(`${title}\n${message}`);
  } else {
    Alert.alert(title, message);
  }
}

function formatDate(year, month, day) {
  return (
    `${year}-${String(month + 1).padStart(2, '0')}-` +
    String(day).padStart(2, '0')
  );
}

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

// Dropdown for saved crops and fields
function DropdownField({
  label,
  value,
  options,
  placeholder,
  emptyMessage,
  onSelect,
}) {
  const [visible, setVisible] = useState(false);

  // Keep older saved values available when editing
  const availableOptions = [
    ...new Set([...options, ...(value ? [value] : [])]),
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
            value ? styles.selectedText : styles.placeholderText
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
                  {emptyMessage}
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

export default function HarvestScreen() {
  // Saved data
  const [harvests, setHarvests] = useState([]);
  const [crops, setCrops] = useState([]);
  const [fields, setFields] = useState([]);

  // Form values
  const [cropName, setCropName] = useState('');
  const [fieldName, setFieldName] = useState('');
  const [harvestDate, setHarvestDate] = useState('');
  const [quantity, setQuantity] = useState('');
  const [notes, setNotes] = useState('');

  // Search and edit
  const [search, setSearch] = useState('');
  const [editId, setEditId] = useState(null);

  // Calendar
  const [calendarVisible, setCalendarVisible] = useState(false);
  const [calendarMonth, setCalendarMonth] = useState(new Date());

  // Load all saved data
  const loadData = useCallback(() => {
    try {
      setHarvests(getAllHarvests());
      setCrops(getAllCrops());
      setFields(getAllFields());
    } catch (error) {
      console.log(error);
      showMessage('Error', 'Unable to load harvest data.');
    }
  }, []);

  // Refresh whenever Harvest tab opens
  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [loadData])
  );

  // Clear the form
  function clearForm() {
    setCropName('');
    setFieldName('');
    setHarvestDate('');
    setQuantity('');
    setNotes('');
    setEditId(null);
  }

  // Create or update harvest
  function handleSave() {
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
        'Missing Information',
        'Please select a crop, field, date and quantity.'
      );
      return;
    }

    if (!parseDate(cleanDate)) {
      showMessage(
        'Invalid Date',
        'Please select a valid harvest date.'
      );
      return;
    }

    const quantityNumber = Number(cleanQuantity);

    if (
      !/^\d+(\.\d+)?$/.test(cleanQuantity) ||
      !Number.isFinite(quantityNumber) ||
      quantityNumber <= 0
    ) {
      showMessage(
        'Invalid Quantity',
        'Enter a positive quantity in kg, e.g. 150.5.'
      );
      return;
    }

    try {
      if (editId !== null) {
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
      loadData();
    } catch (error) {
      console.log(error);
      showMessage('Error', 'Unable to save harvest.');
    }
  }

  // Edit saved harvest
  function handleEdit(harvest) {
    setEditId(harvest.id);
    setCropName(String(harvest.cropName ?? ''));
    setFieldName(String(harvest.fieldName ?? ''));
    setHarvestDate(String(harvest.harvestDate ?? ''));
    setQuantity(String(harvest.quantity ?? ''));
    setNotes(String(harvest.notes ?? ''));
  }

  // Delete harvest after confirmation
  function handleDelete(id) {
    const performDelete = () => {
      try {
        deleteHarvest(id);

        if (editId === id) {
          clearForm();
        }

        loadData();
      } catch (error) {
        console.log(error);
        showMessage('Error', 'Unable to delete harvest.');
      }
    };

    if (Platform.OS === 'web') {
      if (
        window.confirm(
          'Are you sure you want to delete this harvest record?'
        )
      ) {
        performDelete();
      }
    } else {
      Alert.alert(
        'Delete Harvest',
        'Are you sure you want to delete this harvest record?',
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Delete',
            style: 'destructive',
            onPress: performDelete,
          },
        ]
      );
    }
  }

  // Open calendar
  function openCalendar() {
    setCalendarMonth(
      parseDate(harvestDate) || new Date()
    );
    setCalendarVisible(true);
  }

  // Previous or next month
  function changeMonth(amount) {
    setCalendarMonth((current) => {
      return new Date(
        current.getFullYear(),
        current.getMonth() + amount,
        1
      );
    });
  }

  // Select date
  function selectDate(day) {
    const selectedDate = formatDate(
      calendarMonth.getFullYear(),
      calendarMonth.getMonth(),
      day
    );

    setHarvestDate(selectedDate);
    setCalendarVisible(false);
  }

  // Build calendar grid
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

    for (let i = 0; i < firstDay; i++) {
      cells.push(
        <View
          key={`empty-${i}`}
          style={styles.calendarDay}
        />
      );
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const dateValue = formatDate(year, month, day);
      const selected = dateValue === harvestDate;

      cells.push(
        <TouchableOpacity
          key={dateValue}
          style={[
            styles.calendarDay,
            selected && styles.selectedDay,
          ]}
          onPress={() => selectDate(day)}
        >
          <Text
            style={[
              styles.calendarDayText,
              selected && styles.selectedDayText,
            ]}
          >
            {day}
          </Text>
        </TouchableOpacity>
      );
    }

    return cells;
  }

  // Names from existing Crops and Fields
  const cropOptions = [
    ...new Set(
      crops
        .map((crop) => String(crop.name ?? '').trim())
        .filter(Boolean)
    ),
  ];

  const fieldOptions = [
    ...new Set(
      fields
        .map((field) => String(field.name ?? '').trim())
        .filter(Boolean)
    ),
  ];

  // Search harvest records
  const filteredHarvests = harvests.filter((harvest) => {
    const keyword = search.toLowerCase().trim();

    return (
      String(harvest.cropName ?? '')
        .toLowerCase().includes(keyword) ||
      String(harvest.fieldName ?? '')
        .toLowerCase().includes(keyword) ||
      String(harvest.harvestDate ?? '')
        .toLowerCase().includes(keyword) ||
      String(harvest.quantity ?? '')
        .includes(keyword) ||
      String(harvest.notes ?? '')
        .toLowerCase().includes(keyword)
    );
  });

  // Total quantity of all saved harvests
  const totalQuantity = harvests.reduce((sum, harvest) => {
    const value = Number(harvest.quantity);
    return sum + (Number.isFinite(value) ? value : 0);
  }, 0);

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
              🌾 Harvest Management
            </Text>

            <Text style={styles.subtitle}>
              Track and manage your farm harvests
            </Text>

            {/* Harvest Summary */}
            <View style={styles.summaryBox}>
              <Text style={styles.summaryText}>
                Total Harvest Records: {harvests.length}
              </Text>

              <Text style={styles.summaryText}>
                Total Harvest Quantity: {totalQuantity} kg
              </Text>
            </View>

            {/* Add / Edit Form */}
            <View style={styles.form}>
              <Text style={styles.heading}>
                {editId !== null
                  ? 'Edit Harvest Record'
                  : 'Add New Harvest'}
              </Text>

              {/* Crop Dropdown */}
              <DropdownField
                label="Crop Name"
                value={cropName}
                options={cropOptions}
                placeholder="Select Saved Crop"
                emptyMessage="No crops found. Add a crop in the Crops tab first."
                onSelect={setCropName}
              />

              {/* Field Dropdown */}
              <DropdownField
                label="Field Name"
                value={fieldName}
                options={fieldOptions}
                placeholder="Select Saved Field"
                emptyMessage="No fields found. Add a field in the Fields tab first."
                onSelect={setFieldName}
              />

              {/* Harvest Date */}
              <Text style={styles.label}>
                Harvest Date
              </Text>

              <TouchableOpacity
                style={styles.input}
                onPress={openCalendar}
              >
                <Text
                  style={
                    harvestDate
                      ? styles.selectedText
                      : styles.placeholderText
                  }
                >
                  {harvestDate || '📅 Select Harvest Date'}
                </Text>
              </TouchableOpacity>

              {/* Quantity */}
              <Text style={styles.label}>
                Quantity (kg)
              </Text>

              <TextInput
                style={styles.input}
                placeholder="e.g. 150.5"
                value={quantity}
                keyboardType="decimal-pad"
                onChangeText={(value) => {
                  const cleaned = value.replace(/[^0-9.]/g, '');

                  if (cleaned.split('.').length <= 2) {
                    setQuantity(cleaned);
                  }
                }}
              />

              {/* Notes */}
              <Text style={styles.label}>
                Notes (Optional)
              </Text>

              <TextInput
                style={[styles.input, styles.notesInput]}
                placeholder="Enter harvest notes..."
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

            {/* Search */}
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
              🌱 {item.cropName}
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
            {search
              ? 'No matching harvest records found.'
              : 'No harvest records added yet.'}
          </Text>
        }
      />

      {/* Calendar Modal */}
      <Modal
        visible={calendarVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setCalendarVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.heading}>
              Select Harvest Date
            </Text>

            <View style={styles.monthNavigation}>
              <TouchableOpacity
                style={styles.monthButton}
                onPress={() => changeMonth(-1)}
              >
                <Text style={styles.monthArrow}>‹</Text>
              </TouchableOpacity>

              <Text style={styles.monthTitle}>
                {calendarMonth.toLocaleDateString('en-US', {
                  month: 'long',
                  year: 'numeric',
                })}
              </Text>

              <TouchableOpacity
                style={styles.monthButton}
                onPress={() => changeMonth(1)}
              >
                <Text style={styles.monthArrow}>›</Text>
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
              onPress={() => setCalendarVisible(false)}
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
  notesInput: {
    minHeight: 85,
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
