'use client';
import { App, ConfigProvider, type ConfigProviderProps } from 'antd';
import { themeFor, type ThemeMode } from '@repo/brand-tokens';
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react';

type Locale = ConfigProviderProps['locale'];

export interface ThemeModeContextValue {
  mode: ThemeMode;
  setMode: (mode: ThemeMode) => void;
  toggle: () => void;
}

const ThemeModeContext = createContext<ThemeModeContextValue | null>(null);

export interface ThemeProviderProps {
  children: ReactNode;
  /** Initial mode when uncontrolled. */
  defaultMode?: ThemeMode;
  /** Controlled mode — pass together with `onModeChange` (e.g. SSR via cookie). */
  mode?: ThemeMode;
  /** Notified whenever the mode changes (persist to cookie/DB here). */
  onModeChange?: (mode: ThemeMode) => void;
  /** antd locale (i18n) forwarded to ConfigProvider. */
  locale?: Locale;
}

/**
 * Single entry point for theming. Wraps antd's `ConfigProvider` with the
 * brand `ThemeConfig` (light/dark) and the antd `App` component — the latter is
 * required so `message`, `notification` and `Modal.confirm` inherit the theme
 * (they do NOT read ConfigProvider on their own).
 */
export function ThemeProvider({
  children,
  defaultMode = 'light',
  mode: controlledMode,
  onModeChange,
  locale,
}: ThemeProviderProps) {
  const [internalMode, setInternalMode] = useState<ThemeMode>(defaultMode);
  const mode = controlledMode ?? internalMode;

  const setMode = useCallback(
    (next: ThemeMode) => {
      if (controlledMode === undefined) setInternalMode(next);
      onModeChange?.(next);
    },
    [controlledMode, onModeChange],
  );

  const toggle = useCallback(
    () => setMode(mode === 'light' ? 'dark' : 'light'),
    [mode, setMode],
  );

  const ctx = useMemo<ThemeModeContextValue>(
    () => ({ mode, setMode, toggle }),
    [mode, setMode, toggle],
  );

  return (
    <ThemeModeContext.Provider value={ctx}>
      <ConfigProvider theme={themeFor(mode)} locale={locale}>
        <App>{children}</App>
      </ConfigProvider>
    </ThemeModeContext.Provider>
  );
}

/** Access the current theme mode and toggles. Must be used under ThemeProvider. */
export function useThemeMode(): ThemeModeContextValue {
  const ctx = useContext(ThemeModeContext);
  if (!ctx) {
    throw new Error('useThemeMode must be used within a <ThemeProvider>');
  }
  return ctx;
}
