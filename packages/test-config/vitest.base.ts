import type { CoverageOptions } from 'vitest/node';
import { defineConfig } from 'vitest/config';

export interface CoverageThresholds {
  lines: number;
  functions: number;
  branches: number;
  statements: number;
}

/**
 * Shared per-project coverage config.
 *
 * Every package that runs unit tests calls this in its own vitest.config.ts
 * and passes its own thresholds, so each project has an independent, strict
 * coverage gate. Reporters emit `lcov` + `json-summary` (consumed by the
 * workspace-wide informational summary) plus a console `text-summary`.
 */
export function coverageConfig(thresholds: CoverageThresholds): CoverageOptions {
  return {
    provider: 'v8',
    reporter: ['text-summary', 'json-summary', 'lcov'],
    reportsDirectory: './coverage',
    include: ['src/**'],
    exclude: [
      '**/*.stories.tsx',
      '**/*.stories.ts',
      '**/*.config.*',
      '**/dist/**',
      '**/__generated__/**',
      '**/*.d.ts',
      '**/test/**',
      '**/*.test.*',
    ],
    thresholds,
  };
}

/** Shared Vitest base for unit / logic tests across the workspace. */
export const vitestBase = defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: [new URL('./vitest.setup.ts', import.meta.url).pathname],
    css: false,
  },
});

export default vitestBase;
