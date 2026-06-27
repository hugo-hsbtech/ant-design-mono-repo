import { readFileSync, writeFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { createConfig } from '@repo/tsup-config';

const DIRECTIVE = '"use client";\n';

/** Recursively prepend the RSC client directive to every emitted JS file. */
function addUseClient(dir: string) {
  for (const name of readdirSync(dir)) {
    const full = join(dir, name);
    if (statSync(full).isDirectory()) {
      addUseClient(full);
    } else if (full.endsWith('.js') || full.endsWith('.cjs')) {
      const code = readFileSync(full, 'utf8');
      if (!code.startsWith('"use client"')) writeFileSync(full, DIRECTIVE + code);
    }
  }
}

export default createConfig({
  // Unbundled build: keep `export * from 'antd'` literal so downstream bundlers
  // (Vite/rollup, Next) can statically resolve every re-exported antd member.
  entry: ['src/**/*.{ts,tsx}', '!src/**/*.test.{ts,tsx}', '!src/**/*.d.ts'],
  bundle: false,
  splitting: false,
  // The whole design system is client-only (antd). Mark every output accordingly.
  async onSuccess() {
    addUseClient('dist');
  },
});
