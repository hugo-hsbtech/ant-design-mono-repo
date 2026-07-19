import { defineConfig } from 'vitest/config';
import { fileURLToPath } from 'node:url';
import type { CoverageV8Options } from 'vitest/node';
import { coverageConfig } from '../../packages/test-config/vitest.coverage';

export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['../../packages/test-config/vitest.setup.ts'],
    css: false,
    include: ['src/**/*.test.{ts,tsx}'],
    coverage: {
      ...(coverageConfig({
        lines: 80,
        statements: 80,
        functions: 80,
        branches: 70,
      }) as CoverageV8Options),
      include: ['src/lib/**'],
    },
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      'server-only': fileURLToPath(new URL('./src/test/server-only-stub.ts', import.meta.url)),
    },
  },
});
