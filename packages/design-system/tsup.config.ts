import { readFileSync, writeFileSync } from 'node:fs';
import { createConfig } from '@repo/tsup-config';

const DIRECTIVE = '"use client";\n';

export default createConfig({
  entry: ['src/index.ts'],
  // The whole design system is built on antd (client-only). esbuild strips a
  // bundled `"use client"` directive, so we prepend it post-build to keep the
  // RSC boundary correct for the Next.js App Router.
  async onSuccess() {
    for (const file of ['dist/index.js', 'dist/index.cjs']) {
      const code = readFileSync(file, 'utf8');
      if (!code.startsWith('"use client"')) {
        writeFileSync(file, DIRECTIVE + code);
      }
    }
  },
});
