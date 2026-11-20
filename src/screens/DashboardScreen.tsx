import React from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import FilterBar from '@/components/FilterBar';
import LoanForm from '@/components/LoanForm';
import LoanList from '@/components/LoanList';
import SummaryCard from '@/components/SummaryCard';
import ThemeToggle from '@/components/ThemeToggle';
import { useLoans } from '@/context/LoanContext';
import { useTheme } from '@/context/ThemeContext';

export default function DashboardScreen() {
  const { totalLoans, borrowedCount, returnedCount } = useLoans();
  const { colors, mode } = useTheme();

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]} edges={['top', 'left', 'right']}>
      <StatusBar barStyle={mode === 'dark' ? 'light-content' : 'dark-content'} />
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.header}>
            <View style={styles.headerText}>
              <Text style={[styles.title, { color: colors.text }]}>Dashboard Peminjaman Buku</Text>
              <Text style={[styles.subtitle, { color: colors.subtext }]}>Kelola data peminjaman perpustakaan</Text>
            </View>
            <ThemeToggle />
          </View>

          <View style={styles.summaryRow}>
            <SummaryCard label="Total" value={totalLoans} accent={colors.primary} />
            <SummaryCard label="Belum Dikembalikan" value={borrowedCount} accent={colors.warning} />
            <SummaryCard label="Sudah Dikembalikan" value={returnedCount} accent={colors.success} />
          </View>

          <LoanForm />
          <FilterBar />
          <LoanList />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
  },
  flex: {
    flex: 1,
  },
  content: {
    padding: 16,
    gap: 16,
    paddingBottom: 32,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 12,
  },
  headerText: {
    flex: 1,
    gap: 4,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
  },
  subtitle: {
    fontSize: 14,
  },
  summaryRow: {
    flexDirection: 'row',
    gap: 10,
  },
});
