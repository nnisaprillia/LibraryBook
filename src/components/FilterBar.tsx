import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useLoans } from '@/context/LoanContext';
import { useTheme } from '@/context/ThemeContext';
import { LoanFilter } from '@/types';

const filters: { key: LoanFilter; label: string }[] = [
  { key: 'all', label: 'Semua' },
  { key: 'borrowed', label: 'Belum Dikembalikan' },
  { key: 'returned', label: 'Sudah Dikembalikan' },
];

export default function FilterBar() {
  const { state, dispatch } = useLoans();
  const { colors } = useTheme();

  return (
    <View style={styles.container}>
      {filters.map((f) => {
        const active = state.filter === f.key;
        return (
          <Pressable
            key={f.key}
            onPress={() => dispatch({ type: 'SET_FILTER', payload: f.key })}
            style={[
              styles.chip,
              {
                backgroundColor: active ? colors.primary : colors.card,
                borderColor: active ? colors.primary : colors.border,
              },
            ]}
          >
            <Text style={[styles.chipText, { color: active ? colors.chipActiveText : colors.text }]}>
              {f.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    borderWidth: 1,
  },
  chipText: {
    fontSize: 13,
    fontWeight: '600',
  },
});
