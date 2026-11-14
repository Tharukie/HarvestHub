import React, { useCallback, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { getAllCrops, getAllFields, getAllActivities, getAllHarvests } from '../database/database';

const GREEN = '#1B5E20';
const DAY_MS = 86400000;

// Compare calendar days rather than hours, avoiding timezone and DST surprises.
function dateNumber(value) {
  const match = String(value || '').match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!match) return null;
  const y = Number(match[1]);
  const m = Number(match[2]);
  const d = Number(match[3]);
  const date = new Date(y, m - 1, d);
  if (date.getFullYear() !== y || date.getMonth() !== m - 1 || date.getDate() !== d) return null;
  return Math.floor(Date.UTC(y, m - 1, d) / DAY_MS);
}

function todayNumber() {
  const now = new Date();
  return Math.floor(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate()) / DAY_MS);
}

function clean(value) {
  return String(value ?? '').trim();
}

function insightCard(title, detail, tone = 'neutral', key) {
  return { title, detail, tone, key: key || title };
}

function createInsights(crops, fields, activities, harvests) {
  const today = todayNumber();
  const cropInsights = [];
  const waterInsights = [];
  const recentHarvests = harvests.filter((h) => {
    const day = dateNumber(h.harvestDate);
    return day !== null && day <= today && today - day <= 30;
  });

  // Planting date alone cannot determine biological harvest readiness.
  crops.forEach((crop) => {
    const name = clean(crop.name) || 'Unnamed crop';
    const planted = dateNumber(crop.plantingDate);
    if (planted === null) {
      cropInsights.push(insightCard(`🌱 ${name}`, 'Planting date is missing or invalid. Update the crop record to track its age.', 'warning', `crop-${crop.id}`));
    } else if (planted > today) {
      cropInsights.push(insightCard(`🌱 ${name}`, 'Planting date is in the future. Check this record.', 'warning', `crop-${crop.id}`));
    } else {
      const age = today - planted;
      cropInsights.push(insightCard(`🌱 ${name}`, `Planted ${age} day${age === 1 ? '' : 's'} ago. Review the crop's variety and local growing conditions to plan harvest timing.`, 'neutral', `crop-${crop.id}`));
    }
  });

  // A simple follow-up reminder, not a sensor-based irrigation prescription.
  fields.forEach((field) => {
    const fieldName = clean(field.name);
    if (!fieldName) return;
    const watering = activities
      .filter((activity) => clean(activity.fieldName).toLowerCase() === fieldName.toLowerCase() && clean(activity.name).toLowerCase() === 'watering')
      .map((activity) => dateNumber(activity.activityDate))
      .filter((day) => day !== null && day <= today)
      .sort((a, b) => b - a);

    if (watering.length === 0) {
      waterInsights.push(insightCard(`💧 ${fieldName}`, 'No past watering activity recorded. Check the field and log watering when completed.', 'warning', `water-${field.id}`));
    } else {
      const elapsed = today - watering[0];
      waterInsights.push(insightCard(`💧 ${fieldName}`, elapsed >= 3
        ? `Last recorded watering: ${elapsed} days ago. Check soil moisture and weather before deciding whether to water.`
        : `Last recorded watering: ${elapsed === 0 ? 'today' : `${elapsed} day${elapsed === 1 ? '' : 's'} ago`}. Keep monitoring soil moisture.`,
      elapsed >= 3 ? 'warning' : 'success', `water-${field.id}`));
    }
  });

  return { cropInsights, waterInsights, recentHarvests, today };
}

function InsightSection({ title, items, emptyMessage }) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {items.length === 0 ? <Text style={styles.empty}>{emptyMessage}</Text> : items.map((item) => (
        <View key={item.key} style={[styles.card, item.tone === 'warning' && styles.warningCard, item.tone === 'success' && styles.successCard]}>
          <Text style={styles.cardTitle}>{item.title}</Text>
          <Text style={styles.cardDetail}>{item.detail}</Text>
        </View>
      ))}
    </View>
  );
}

export default function SmartAssistantScreen() {
  const [data, setData] = useState({ crops: [], fields: [], activities: [], harvests: [] });
  const [error, setError] = useState('');
  const refresh = useCallback(() => {
    try {
      setData({
        crops: getAllCrops(),
        fields: getAllFields(),
        activities: getAllActivities(),
        harvests: getAllHarvests(),
      });
      setError('');
    } catch (e) {
      console.error('Smart assistant failed to load:', e);
      setError('Unable to load farm records. Please try again.');
    }
  }, []);

  useFocusEffect(useCallback(() => { refresh(); }, [refresh]));
  const insights = createInsights(data.crops, data.fields, data.activities, data.harvests);
  const summary = [
    { title: 'Crops', value: data.crops.length },
    { title: 'Fields', value: data.fields.length },
    { title: 'Activities', value: data.activities.length },
    { title: 'Harvests', value: data.harvests.length },
  ];

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.hero}>
        <Text style={styles.heroTitle}>🌿 Smart Farm Assistant</Text>
        <Text style={styles.heroText}>Practical insights from your saved farm records</Text>
      </View>
      <TouchableOpacity style={styles.refresh} onPress={refresh} accessibilityRole="button">
        <Text style={styles.refreshText}>↻ Refresh Insights</Text>
      </TouchableOpacity>
      {!!error && <Text style={styles.error}>{error}</Text>}
      <View style={styles.stats}>
        {summary.map((item) => (
          <View key={item.title} style={styles.stat}>
            <Text style={styles.statValue}>{item.value}</Text>
            <Text style={styles.statLabel}>{item.title}</Text>
          </View>
        ))}
      </View>
      <InsightSection title="🌱 Crop Age & Harvest Planning" items={insights.cropInsights} emptyMessage="No crops yet. Add crops to see planting-age insights." />
      <InsightSection title="💧 Watering Follow-up" items={insights.waterInsights} emptyMessage="No fields yet. Add a field to see watering reminders." />
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>📦 Recent Harvest Activity</Text>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>{insights.recentHarvests.length} harvest record(s) in the past 30 days</Text>
          <Text style={styles.cardDetail}>Based on recorded harvest dates. Open the Harvest tab to view details.</Text>
        </View>
      </View>
      <Text style={styles.disclaimer}>Decision-support reminders only. They do not measure soil moisture, predict actual harvest readiness, or replace local agricultural advice. The 3-day watering follow-up threshold is illustrative.</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F1F8E9' },
  content: { padding: 16, paddingBottom: 32 },
  hero: { backgroundColor: GREEN, borderRadius: 18, padding: 20, marginBottom: 12 },
  heroTitle: { color: '#fff', fontSize: 24, fontWeight: '800' },
  heroText: { color: '#DFF5E2', fontSize: 14, marginTop: 7 },
  refresh: { alignSelf: 'flex-end', paddingVertical: 10, paddingHorizontal: 14, borderRadius: 9, backgroundColor: '#DCEEDC', marginBottom: 12 },
  refreshText: { color: GREEN, fontWeight: '700' },
  stats: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', marginBottom: 12 },
  stat: { backgroundColor: '#fff', width: '48%', padding: 14, marginBottom: 10, borderRadius: 12, alignItems: 'center' },
  statValue: { color: GREEN, fontSize: 26, fontWeight: '800' },
  statLabel: { color: '#53615A', fontSize: 13 },
  section: { marginBottom: 12 },
  sectionTitle: { color: GREEN, fontSize: 19, fontWeight: '800', marginBottom: 10 },
  card: { backgroundColor: '#fff', borderRadius: 12, padding: 15, marginBottom: 10, borderLeftWidth: 4, borderLeftColor: '#A5D6A7' },
  warningCard: { borderLeftColor: '#E6A23C' },
  successCard: { borderLeftColor: '#43A047' },
  cardTitle: { color: '#1E3F26', fontSize: 16, fontWeight: '700', marginBottom: 6 },
  cardDetail: { color: '#4B5B50', fontSize: 14, lineHeight: 21 },
  empty: { color: '#68796A', padding: 16, backgroundColor: '#fff', borderRadius: 10 },
  error: { color: '#B71C1C', marginBottom: 10 },
  disclaimer: { color: '#69786B', fontSize: 12, lineHeight: 18, marginTop: 8 },
});
