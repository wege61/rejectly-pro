'use client';

import { ThemeProvider } from '@/contexts/ThemeContext';
import { GlobalStyle } from '@/styles/GlobalStyle';
import { ToastProvider } from '@/contexts/ToastContext';
import { ToastList } from '@/components/ui/Toast';

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <GlobalStyle />
      <ToastProvider>
        {children}
        <ToastList />
      </ToastProvider>
    </ThemeProvider>
  );
}