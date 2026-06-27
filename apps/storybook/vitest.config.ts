import { defineConfig } from 'vitest/config';
import { storybookTest } from '@storybook/addon-vitest/vitest-plugin';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const dir = dirname(fileURLToPath(import.meta.url));

// Storybook Test (PRD §10.1 level 2): every story becomes a test running in a
// real browser via Playwright/Chromium — render + interaction (play) + a11y.
export default defineConfig({
  plugins: [storybookTest({ configDir: join(dir, '.storybook') })],
  test: {
    name: 'storybook',
    browser: {
      enabled: true,
      provider: 'playwright',
      headless: true,
      instances: [
        {
          browser: 'chromium',
          // CI installs the matching browser via `playwright install`. Set
          // CHROMIUM_BIN locally to reuse a pre-installed binary instead.
          launch: process.env.CHROMIUM_BIN
            ? { executablePath: process.env.CHROMIUM_BIN }
            : undefined,
        },
      ],
    },
    setupFiles: [join(dir, '.storybook/vitest.setup.ts')],
  },
});
