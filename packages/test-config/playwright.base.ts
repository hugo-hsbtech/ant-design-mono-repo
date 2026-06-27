import { defineConfig, devices } from '@playwright/test';

/**
 * Shared Playwright base for E2E flows in the apps (login, org switch, CRUD).
 * Apps extend this and provide their own `webServer` + `baseURL`.
 */
export function createPlaywrightConfig(overrides: Parameters<typeof defineConfig>[0] = {}) {
  return defineConfig({
    testDir: './e2e',
    fullyParallel: true,
    forbidOnly: !!process.env.CI,
    retries: process.env.CI ? 2 : 0,
    reporter: process.env.CI ? 'github' : 'list',
    use: {
      trace: 'on-first-retry',
    },
    projects: [
      { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
      { name: 'mobile', use: { ...devices['Pixel 7'] } },
    ],
    ...overrides,
  });
}

export default createPlaywrightConfig;
