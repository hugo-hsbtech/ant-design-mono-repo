import { defineConfig } from 'vitest/config';

/**
 * Shared Vitest base for unit / logic tests across the workspace.
 *
 * Per-project coverage lives in ./vitest.coverage.ts — import it by relative
 * path from each package's vitest.config.ts.
 */
export const vitestBase = defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: [new URL('./vitest.setup.ts', import.meta.url).pathname],
    css: false,
  },
});

export default vitestBase;
