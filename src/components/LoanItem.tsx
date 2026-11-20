import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useLoans } from '@/context/LoanContext';
import { useTheme } from '@/context/ThemeContext';
import { Loan } from '@/types';

interface Props {
  loan: Loan;
}

export default function LoanItem({ loan }: Props) {
  const { dispatch } = useLoans();
  const { colors } = useTheme();
  const statusColor = loan.isReturned ? colors.success : colors.warning;

  return (
    <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
      <View style={styles.headerRow}>
        <Text style={[styles.title, { color: colors.text }]} numberOfLines={2}>
          {loan.bookTitle}
        </Text>
        <View style={[styles.badge, { backgroundColor: statusColor + '22', borderColor: statusColor }]}>
          <Text style={[styles.badgeText, { color: statusColor }]}>
            {loan.isReturned ? 'Sudah Dikembalikan' : 'Belum Dikembalikan'}
          </Text>
        </View>
      </View>
      <Text style={[styles.meta, { color: colors.subtext }]}>Peminjam: {loan.borrowerName}</Text>
      <Text style={[styles.meta, { color: colors.subtext }]}>Tanggal pinjam: {loan.borrowDate}</Text>
      <Pressable
        onPress={() => dispatch({ type: 'TOGGLE_RETURN', payload: { id: loan.id } })}
        style={[styles.button, { borderColor: colors.primary }]}
      >
        <Text style={[styles.buttonText, { color: colors.primary }]}>
          {loan.isReturned ? 'Tandai Belum Dikembalikan' : 'Tandai Sudah Dikembalikan'}
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
    gap: 6,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 8,
  },
  title: {
    flex: 1,
    fontSize: 16,
    fontWeight: '700',
  },
  badge: {
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '700',
  },
  meta: {
    fontSize: 13,
  },
  button: {
    marginTop: 4,
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
  },
  buttonText: {
    fontSize: 13,
    fontWeight: '600',
  },
});
