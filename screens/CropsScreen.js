
import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Alert,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';

import {
  getAllCrops,
  addCrop,
  updateCrop,
  deleteCrop,
} from '../database/database';

export default function CropsScreen() {
  const [crops, setCrops] = useState([]);
  const [name, setName] = useState('');
  const [type, setType] = useState('');
  const [plantingDate, setPlantingDate] = useState('');
  const [quantity, setQuantity] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [search, setSearch] = useState('');

  const loadCrops = useCallback(() => {
    try {
      setCrops(getAllCrops());
    } catch (error) {
      console.log(error);
      Alert.alert('Error', 'Unable to load crops.');
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadCrops();
    }, [loadCrops])
  );

  function clearForm() {
    setName('');
    setType('');
    setPlantingDate('');
    setQuantity('');
    setEditingId(null);
  }

  function handleSave() {
    if (!name.trim() || !type.trim() || !plantingDate.trim() || !quantity.trim()) {
      Alert.alert('Missing Information', 'Please fill all fields.');
      return;
    }

    try {
      if (editingId !== null) {
        updateCrop(editingId, name.trim(), type.trim(), plantingDate.trim(), quantity.trim());
        Alert.alert('Success', 'Crop updated successfully.');
      } else {
        addCrop(name.trim(), type.trim(), plantingDate.trim(), quantity.trim());
        Alert.alert('Success', 'Crop added successfully.');
      }

      clearForm();
      loadCrops();
    } catch (error) {
      console.log(error);
      Alert.alert('Error', 'Unable to save crop.');
    }
  }

  function handleEdit(item) {
    setEditingId(item.id);
    setName(item.name);
    setType(item.type);
    setPlantingDate(item.plantingDate);
    setQuantity(item.quantity);
  }

  function handleDelete(id) {
    const removeCrop = () => {
      try {
        deleteCrop(id);
        loadCrops();
      } catch (error) {
        console.log(error);
        Alert.alert('Error', 'Unable to delete crop.');
      }
    };

    if (typeof window !== 'undefined' && window.confirm) {
      if (window.confirm('Are you sure you want to delete this crop?')) {
        removeCrop();
      }
    } else {
      Alert.alert(
        'Delete Crop',
        'Are you sure you want to delete this crop?',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Delete', style: 'destructive', onPress: removeCrop },
        ]
      );
    }
  }

  const filteredCrops = crops.filter((item) =>
    item.name.toLowerCase().includes(search.toLowerCase()) ||
    item.type.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <FlatList
      style={styles.container}
      contentContainerStyle={styles.content}
      data={filteredCrops}
      keyExtractor={(item) => item.id.toString()}
      ListHeaderComponent={
        <View>
          <Text style={styles.heading}>🌾 Crop Management</Text>
          <Text style={styles.subtitle}>Add and manage your farm crops</Text>

          <View style={styles.form}>
            <Text style={styles.formTitle}>
              {editingId !== null ? 'Edit Crop' : 'Add New Crop'}
            </Text>

            <TextInput
              style={styles.input}
              placeholder="Crop Name (e.g. Rice)"
              value={name}
              onChangeText={setName}
            />

            <TextInput
              style={styles.input}
              placeholder="Crop Type (e.g. Vegetable)"
              value={type}
              onChangeText={setType}
            />

            <TextInput
              style={styles.input}
              placeholder="Planting Date (YYYY-MM-DD)"
              value={plantingDate}
              onChangeText={setPlantingDate}
            />

            <TextInput
              style={styles.input}
              placeholder="Quantity (e.g. 100 plants)"
              value={quantity}
              onChangeText={setQuantity}
            />

            <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
              <Text style={styles.buttonText}>
                {editingId !== null ? 'Update Crop' : 'Add Crop'}
              </Text>
            </TouchableOpacity>

            {editingId !== null && (
              <TouchableOpacity style={styles.cancelButton} onPress={clearForm}>
                <Text style={styles.buttonText}>Cancel Edit</Text>
              </TouchableOpacity>
            )}
          </View>

          <Text style={styles.listTitle}>My Crops ({crops.length})</Text>

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
          <Text style={styles.cropName}>🌱 {item.name}</Text>
          <Text style={styles.cropInfo}>Type: {item.type}</Text>
          <Text style={styles.cropInfo}>Planting Date: {item.plantingDate}</Text>
          <Text style={styles.cropInfo}>Quantity: {item.quantity}</Text>

          <View style={styles.actions}>
            <TouchableOpacity
              style={styles.editButton}
              onPress={() => handleEdit(item)}
            >
              <Text style={styles.buttonText}>Edit</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.deleteButton}
              onPress={() => handleDelete(item.id)}
            >
              <Text style={styles.buttonText}>Delete</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
      ListEmptyComponent={
        <Text style={styles.empty}>
          {search ? 'No matching crops found.' : 'No crops added yet.'}
        </Text>
      }
    />
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
  input: {
    backgroundColor: '#F5F5F5',
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
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
});
