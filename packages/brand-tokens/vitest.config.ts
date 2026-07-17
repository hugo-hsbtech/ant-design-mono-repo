import { defineConfig } from 'vitest/config';
import { coverageConfig } from '@repo/test-config/vitest';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    coverage: coverageConfig({
      lines: 100,
      statements: 100,
      functions: 100,
      branches: 100,
    }),
  },
});
