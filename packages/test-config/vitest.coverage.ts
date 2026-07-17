import type { CoverageOptions } from 'vitest/node';

export interface CoverageThresholds {
  lines: number;
  functions: number;
  branches: number;
  statements: number;
}

/**
 * Shared per-project coverage config.
 *
 * Each package that runs unit tests imports this **by relative path** in its
 * own vitest.config.ts and passes its own thresholds, so every project has an
 * independent, strict coverage gate. The relative import matters: Vitest
 * bundles the config with esbuild, and a bare package import would be left
 * external and fail to load a `.ts` file on Node < 22.6 (CI). A relative
 * import is inlined into the bundle, so it works on any Node version.
 *
 * The file is type-only at runtime (the sole import is erased), so nothing
 * from here survives into the bundled config except the returned object.
 *
 * Reporters: `lcov` + `json-summary` (consumed by the workspace-wide
 * informational summary) plus a console `text-summary`.
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
