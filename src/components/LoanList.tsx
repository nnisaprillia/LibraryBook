import React from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { useLoans } from '@/context/LoanContext';
import { useTheme } from '@/context/ThemeContext';
import LoanItem from '@/components/LoanItem';

export default function LoanList() {
  const { filteredLoans } = useLoans();
  const { colors } = useTheme();

  if (filteredLoans.length === 0) {
    return (
      <View style={[styles.empty, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <Text style={[styles.emptyTitle, { color: colors.text }]}>Tidak ada data peminjaman</Text>
        <Text style={[styles.emptySub, { color: colors.subtext }]}>
          Tambah peminjaman baru atau ubah filter untuk melihat data.
        </Text>
      </View>
    );
  }

  return (
    <FlatList
      data={filteredLoans}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => <LoanItem loan={item} />}
      contentContainerStyle={styles.list}
      scrollEnabled={false}
    />
  );
}

const styles = StyleSheet.create({
  list: {
    gap: 10,
  },
  empty: {
    borderWidth: 1,
    borderStyle: 'dashed',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    gap: 4,
  },
  emptyTitle: {
    fontSize: 15,
    fontWeight: '600',
  },
  emptySub: {
    fontSize: 13,
    textAlign: 'center',
  },
});
