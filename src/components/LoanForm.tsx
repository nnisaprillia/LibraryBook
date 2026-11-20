import React, { useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { useLoans } from '@/context/LoanContext';
import { useTheme } from '@/context/ThemeContext';

function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

export default function LoanForm() {
  const { dispatch } = useLoans();
  const { colors } = useTheme();
  const [borrowerName, setBorrowerName] = useState('');
  const [bookTitle, setBookTitle] = useState('');
  const [borrowDate, setBorrowDate] = useState(todayISO());
  const [error, setError] = useState('');

  const inputStyle = useMemo(
    () => [
      styles.input,
      { backgroundColor: colors.inputBg, borderColor: colors.border, color: colors.text },
    ],
    [colors]
  );

  const onSubmit = () => {
    if (!borrowerName.trim() || !bookTitle.trim() || !borrowDate.trim()) {
      setError('Semua field wajib diisi.');
      return;
    }
    dispatch({
      type: 'ADD_LOAN',
      payload: {
        borrowerName: borrowerName.trim(),
        bookTitle: bookTitle.trim(),
        borrowDate: borrowDate.trim(),
      },
    });
    setBorrowerName('');
    setBookTitle('');
    setBorrowDate(todayISO());
    setError('');
  };

  return (
    <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
      <Text style={[styles.title, { color: colors.text }]}>Tambah Peminjaman</Text>
      <View style={styles.field}>
        <Text style={[styles.label, { color: colors.subtext }]}>Nama Peminjam</Text>
        <TextInput
          value={borrowerName}
          onChangeText={setBorrowerName}
          placeholder="Contoh: Andi Pratama"
          placeholderTextColor={colors.subtext}
          style={inputStyle}
        />
      </View>
      <View style={styles.field}>
        <Text style={[styles.label, { color: colors.subtext }]}>Judul Buku</Text>
        <TextInput
          value={bookTitle}
          onChangeText={setBookTitle}
          placeholder="Contoh: Laskar Pelangi"
          placeholderTextColor={colors.subtext}
          style={inputStyle}
        />
      </View>
      <View style={styles.field}>
        <Text style={[styles.label, { color: colors.subtext }]}>Tanggal Peminjaman (YYYY-MM-DD)</Text>
        <TextInput
          value={borrowDate}
          onChangeText={setBorrowDate}
          placeholder="YYYY-MM-DD"
          placeholderTextColor={colors.subtext}
          style={inputStyle}
          autoCapitalize="none"
        />
      </View>
      {error ? <Text style={[styles.error, { color: colors.danger }]}>{error}</Text> : null}
      <Pressable onPress={onSubmit} style={[styles.submit, { backgroundColor: colors.primary }]}>
        <Text style={styles.submitText}>Tambah</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 14,
    gap: 10,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
  },
  field: {
    gap: 4,
  },
  label: {
    fontSize: 13,
    fontWeight: '500',
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
  },
  error: {
    fontSize: 13,
    fontWeight: '500',
  },
  submit: {
    marginTop: 2,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  submitText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 15,
  },
});
