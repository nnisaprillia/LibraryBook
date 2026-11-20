import React, { createContext, useContext, useMemo, useState, ReactNode } from 'react';
import { useColorScheme } from 'react-native';
import { darkColors, lightColors, ThemeColors } from '@/theme/colors';

type Mode = 'light' | 'dark';

interface ThemeValue {
  mode: Mode;
  colors: ThemeColors;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeValue | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const system = useColorScheme();
  const [mode, setMode] = useState<Mode>(system === 'dark' ? 'dark' : 'light');

  const value = useMemo(() => {
    const toggleTheme = () => setMode((m) => (m === 'light' ? 'dark' : 'light'));
    const colors = mode === 'light' ? lightColors : darkColors;
    return { mode, colors, toggleTheme };
  }, [mode]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useThemeContext() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme harus dipakai di dalam ThemeProvider');
  return ctx;
}

export function useTheme() {
  return useThemeContext();
}
