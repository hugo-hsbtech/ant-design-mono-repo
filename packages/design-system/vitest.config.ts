import { defineConfig } from 'vitest/config';
import { coverageConfig } from '@repo/test-config/vitest';

export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['../test-config/vitest.setup.ts'],
    css: false,
    coverage: coverageConfig({
      lines: 7,
      statements: 7,
      functions: 30,
      branches: 51,
    }),
  },
});
