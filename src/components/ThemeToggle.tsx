import React from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';
import { useTheme } from '@/context/ThemeContext';

export default function ThemeToggle() {
  const { mode, colors, toggleTheme } = useTheme();
  return (
    <Pressable
      onPress={toggleTheme}
      accessibilityRole="button"
      style={[styles.button, { backgroundColor: colors.card, borderColor: colors.border }]}
    >
      <Text style={[styles.text, { color: colors.text }]}>{mode === 'light' ? '🌙 Gelap' : '☀️ Terang'}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    borderWidth: 1,
  },
  text: {
    fontSize: 13,
    fontWeight: '600',
  },
});
