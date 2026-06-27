'use client';
import { ThemeProvider } from '@repo/design-system';

/** Marketing fronts render in the brand's light theme by default. */
export function Providers({ children }: { children: React.ReactNode }) {
  return <ThemeProvider defaultMode="light">{children}</ThemeProvider>;
}
