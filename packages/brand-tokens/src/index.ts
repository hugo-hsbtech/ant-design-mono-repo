import type { ThemeConfig } from 'antd';
import { lightTheme } from './__generated__/theme.light';
import { darkTheme } from './__generated__/theme.dark';

export { lightTheme } from './__generated__/theme.light';
export { darkTheme } from './__generated__/theme.dark';
export { tokens, type TokenName } from './__generated__/tokens';

export type ThemeMode = 'light' | 'dark';

/** Map of mode → antd ThemeConfig, both derived from the DTCG token source. */
export const themes: Record<ThemeMode, ThemeConfig> = {
  light: lightTheme,
  dark: darkTheme,
};

/** Resolve the antd ThemeConfig for a given mode. */
export const themeFor = (mode: ThemeMode): ThemeConfig => themes[mode];

/** Path to the published CSS custom properties (for marketing / non-antd usage). */
export const brandCssPath = '@repo/brand-tokens/css';
