import { defineConfig } from 'vitest/config';

/**
 * Root Vitest config used for the workspace-wide coverage report (CI).
 *
 * It runs every unit-test package as a Vitest "project" so a single, merged
 * coverage report is produced (coverage is a root-only Vitest option). Each
 * project keeps its own environment / setup via its local vitest.config.ts.
 *
 * Day-to-day, packages are still tested individually via `turbo run test`.
 * Use `pnpm test:coverage` (locally and in CI) to produce the merged report.
 */
export default defineConfig({
  test: {
    projects: ['apps/web', 'packages/design-system', 'packages/brand-tokens', 'packages/utils'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'text-summary', 'html', 'lcov', 'json-summary'],
      reportsDirectory: './coverage',
      // Count all source as coverable, not just files a test imported.
      all: true,
      include: ['apps/web/src/**', 'packages/*/src/**'],
      exclude: [
        '**/*.stories.tsx',
        '**/*.stories.ts',
        '**/*.config.*',
        '**/dist/**',
        '**/__generated__/**',
        '**/*.d.ts',
        '**/test/**',
        '**/*.test.*',
        '**/index.ts', // barrel re-exports
      ],
      thresholds: {
        // Baseline set just below current measured coverage so CI fails on
        // regressions, not on today's (sparse) suite. Ratchet these up as
        // coverage grows. Measured 2026-07: lines/statements 8.89%,
        // functions 53.84%, branches 69.38%.
        lines: 8,
        statements: 8,
        functions: 50,
        branches: 65,
      },
    },
  },
});
