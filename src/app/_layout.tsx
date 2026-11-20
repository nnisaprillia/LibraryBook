import { Stack } from 'expo-router';
import { ThemeProvider } from '@/context/ThemeContext';
import { LoanProvider } from '@/context/LoanContext';

export default function RootLayout() {
  return (
    <ThemeProvider>
      <LoanProvider>
        <Stack screenOptions={{ headerShown: false }} />
      </LoanProvider>
    </ThemeProvider>
  );
}
