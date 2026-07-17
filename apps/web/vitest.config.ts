import { defineConfig } from 'vitest/config';
import { fileURLToPath } from 'node:url';
import { coverageConfig } from '@repo/test-config/vitest';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    include: ['src/**/*.test.ts'],
    coverage: coverageConfig({
      lines: 9,
      statements: 9,
      functions: 65,
      branches: 76,
    }),
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      'server-only': fileURLToPath(new URL('./src/test/server-only-stub.ts', import.meta.url)),
    },
  },
});
