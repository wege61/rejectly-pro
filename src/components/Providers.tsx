'use client';

import { ThemeProvider } from 'styled-components';
import { theme } from '@/styles/theme';
import { GlobalStyle } from '@/styles/GlobalStyle';
import { ToastProvider } from '@/contexts/ToastContext';
import { ToastList } from '@/components/ui/Toast';

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider theme={theme}>
      <GlobalStyle />
      <ToastProvider>
        {children}
        <ToastList />
      </ToastProvider>
    </ThemeProvider>
  );
}