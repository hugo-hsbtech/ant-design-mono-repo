'use client';
import { ThemeProvider } from '@repo/design-system';

export function Providers({ children }: { children: React.ReactNode }) {
  return <ThemeProvider defaultMode="light">{children}</ThemeProvider>;
}
