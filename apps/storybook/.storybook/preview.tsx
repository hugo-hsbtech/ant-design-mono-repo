import * as React from 'react';
import type { Preview } from '@storybook/nextjs-vite';
import { ThemeProvider, theme as antdTheme } from '@repo/design-system';
import type { ThemeMode } from '@repo/design-system';
import '@repo/brand-tokens/css';

function ThemedSurface({ mode, children }: { mode: ThemeMode; children: React.ReactNode }) {
  const { token } = antdTheme.useToken();
  return (
    <div
      data-theme={mode}
      style={{
        background: token.colorBgLayout,
        color: token.colorText,
        padding: token.paddingLG,
        minHeight: '100vh',
      }}
    >
      {children}
    </div>
  );
}

const preview: Preview = {
  parameters: {
    controls: {
      matchers: { color: /(background|color)$/i, date: /Date$/i },
    },
    a11y: { test: 'error' },
    options: {
      storySort: {
        order: ['Foundations', 'Primitives', 'Patterns', 'Marketing', 'Product'],
      },
    },
  },
  initialGlobals: {
    theme: 'light',
  },
  globalTypes: {
    theme: {
      description: 'Brand theme (light/dark)',
      toolbar: {
        title: 'Theme',
        icon: 'paintbrush',
        items: [
          { value: 'light', title: 'Light', icon: 'sun' },
          { value: 'dark', title: 'Dark', icon: 'moon' },
        ],
        dynamicTitle: true,
      },
    },
  },
  decorators: [
    (Story, context) => {
      const mode = (context.globals.theme as ThemeMode) ?? 'light';
      // Keyed remount on theme change so antd's css-in-js fully recomputes.
      return (
        <ThemeProvider key={mode} mode={mode}>
          <ThemedSurface mode={mode}>
            <Story />
          </ThemedSurface>
        </ThemeProvider>
      );
    },
  ],
  tags: ['autodocs'],
};

export default preview;
