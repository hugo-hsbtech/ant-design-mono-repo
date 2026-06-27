// ── Facade over antd ──────────────────────────────────────────────────────
// Apps import all UI from here, never from `antd` directly.
export * from './components';

// ── Own compositions ──────────────────────────────────────────────────────
export * from './patterns';
export * from './marketing';

// ── Theming ───────────────────────────────────────────────────────────────
export * from './providers';
export { useBreakpoint } from './hooks';

// Re-export brand theme helpers so consumers get tokens + themes from one place.
export {
  lightTheme,
  darkTheme,
  themes,
  themeFor,
  tokens,
  brandCssPath,
  type ThemeMode,
  type TokenName,
} from '@repo/brand-tokens';
