'use client';
import { ThemeProvider, type ThemeMode } from '@repo/design-system';
import enUS from 'antd/locale/en_US';
import { useCallback } from 'react';

const ONE_YEAR = 60 * 60 * 24 * 365;

/**
 * Client providers wrapper. Seeds the ThemeProvider with the mode resolved on
 * the server (from the cookie) so the first paint matches — no light→dark
 * flash — and persists toggles back to the cookie.
 */
export function Providers({
  children,
  initialMode,
}: {
  children: React.ReactNode;
  initialMode: ThemeMode;
}) {
  const persist = useCallback((mode: ThemeMode) => {
    document.cookie = `theme=${mode}; path=/; max-age=${ONE_YEAR}; samesite=lax`;
  }, []);

  return (
    <ThemeProvider defaultMode={initialMode} onModeChange={persist} locale={enUS}>
      {children}
    </ThemeProvider>
  );
}
