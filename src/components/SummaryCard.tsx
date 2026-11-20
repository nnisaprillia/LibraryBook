import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useTheme } from '@/context/ThemeContext';

interface Props {
  label: string;
  value: number;
  accent: string;
}

export default function SummaryCard({ label, value, accent }: Props) {
  const { colors } = useTheme();
  return (
    <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
      <View style={[styles.accent, { backgroundColor: accent }]} />
      <Text style={[styles.value, { color: colors.text }]}>{value}</Text>
      <Text style={[styles.label, { color: colors.subtext }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    minWidth: 90,
  },
  accent: {
    width: 28,
    height: 4,
    borderRadius: 2,
    marginBottom: 8,
  },
  value: {
    fontSize: 22,
    fontWeight: '700',
  },
  label: {
    fontSize: 12,
    marginTop: 2,
  },
});
