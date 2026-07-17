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
    // Belt-and-suspenders for the real-browser runner: a transient dep-optimizer
    // reload should be retried, never fail the run. a11y/render assertions are
    // deterministic, so a genuine violation still fails every attempt. The
    // deterministic fix (pre-bundling late-discovered deps) lives in
    // .storybook/main.ts `viteFinal`, which reaches the browser optimizer.
    retry: 2,
    browser: {
      enabled: true,
      provider: 'playwright',
      headless: true,
      instances: [
        // CI installs the matching browser via `playwright install`. Set
        // CHROMIUM_BIN locally to reuse a pre-installed binary instead.
        // `launch` is valid at runtime for the playwright provider but absent
        // from this vitest version's instance type, so we cast.
        {
          browser: 'chromium',
          ...(process.env.CHROMIUM_BIN
            ? { launch: { executablePath: process.env.CHROMIUM_BIN } }
            : {}),
        } as { browser: 'chromium' },
      ],
    },
    setupFiles: [join(dir, '.storybook/vitest.setup.ts')],
  },
});
