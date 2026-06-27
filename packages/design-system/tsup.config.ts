import { readFileSync, writeFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { createConfig } from '@repo/tsup-config';

const DIRECTIVE = '"use client";\n';

function walk(dir: string, visit: (file: string) => void) {
  for (const name of readdirSync(dir)) {
    const full = join(dir, name);
    if (statSync(full).isDirectory()) walk(full, visit);
    else visit(full);
  }
}

/**
 * Prepend the RSC client directive to every emitted *leaf* component file, but
 * NOT the re-export barrels (`index.js`): a `"use client"` file cannot use
 * `export *` (Next forbids it across the server→client boundary), and our
 * barrels do `export * from 'antd'`. Neutral barrels let server components
 * import named members that resolve to the client leaves — the canonical RSC
 * pattern.
 */
function addUseClient(file: string) {
  const name = file.split('/').pop()!;
  if (!file.endsWith('.js') || name.startsWith('index.')) return;
  const code = readFileSync(file, 'utf8');
  if (!code.startsWith('"use client"')) writeFileSync(file, DIRECTIVE + code);
}

/**
 * tsup (bundle:false) leaves relative specifiers extensionless, which is
 * invalid Node ESM — Next's SSG prerender runs the real ESM and the exports
 * resolve to undefined. Rewrite `from './x'` to the concrete `./x.js` or
 * `./x/index.js` so the output is spec-compliant ESM.
 */
function fixExtensions(file: string) {
  if (!file.endsWith('.js')) return;
  const fromDir = dirname(file);
  const code = readFileSync(file, 'utf8');
  const fixed = code.replace(
    /(from\s*)(['"])(\.\.?\/[^'"]+)\2/g,
    (match, kw, quote, spec) => {
      if (/\.(js|json|css|mjs|cjs)$/.test(spec)) return match;
      const base = resolve(fromDir, spec);
      let target = spec;
      if (existsSync(`${base}.js`)) target = `${spec}.js`;
      else if (existsSync(join(base, 'index.js'))) target = `${spec}/index.js`;
      return `${kw}${quote}${target}${quote}`;
    },
  );
  if (fixed !== code) writeFileSync(file, fixed);
}

export default createConfig({
  // Unbundled so `export * from 'antd'` stays literal (statically resolvable by
  // downstream bundlers). ESM-only — the facade barrels make a clean CJS build
  // impractical and every consumer (Next, Vite, Storybook) uses ESM.
  entry: ['src/**/*.{ts,tsx}', '!src/**/*.test.{ts,tsx}', '!src/**/*.d.ts'],
  format: ['esm'],
  bundle: false,
  splitting: false,
  async onSuccess() {
    walk('dist', fixExtensions);
    walk('dist', addUseClient);
  },
});
