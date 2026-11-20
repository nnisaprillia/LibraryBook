import React from 'react';
import { ThemeProvider } from './src/context/ThemeContext';
import { LoanProvider } from './src/context/LoanContext';
import DashboardScreen from './src/screens/DashboardScreen';

export default function App() {
  return (
    <ThemeProvider>
      <LoanProvider>
        <DashboardScreen />
      </LoanProvider>
    </ThemeProvider>
  );
}
