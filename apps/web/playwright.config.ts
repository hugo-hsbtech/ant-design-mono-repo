import { defineConfig, devices } from '@playwright/test';

const PORT = 3100;
const baseURL = `http://localhost:${PORT}`;
// CI installs the matching browser; locally set CHROMIUM_BIN to reuse one.
const executablePath = process.env.CHROMIUM_BIN || undefined;

export default defineConfig({
  testDir: './e2e',
  // Mock data is shared in-memory server state — run serially to avoid races.
  fullyParallel: false,
  workers: 1,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? 'github' : 'list',
  use: { baseURL, trace: 'on-first-retry' },
  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        launchOptions: executablePath ? { executablePath } : {},
      },
    },
  ],
  webServer: {
    // Assumes the app is built (CI runs `pnpm build` before `pnpm test:e2e`).
    command: `pnpm exec next start -p ${PORT}`,
    url: baseURL,
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
    env: {
      // Test-only secret (not a real credential). Override via env if desired.
      AUTH_SECRET: process.env.AUTH_SECRET || 'e2e-development-only-secret-value',
    },
  },
});
