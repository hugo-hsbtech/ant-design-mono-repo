import { defineConfig } from 'vitest/config';

/** Shared Vitest base for unit / logic tests across the workspace. */
export const vitestBase = defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: [new URL('./vitest.setup.ts', import.meta.url).pathname],
    css: false,
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html'],
      exclude: ['**/*.stories.tsx', '**/*.config.*', '**/dist/**'],
    },
  },
});

export default vitestBase;
