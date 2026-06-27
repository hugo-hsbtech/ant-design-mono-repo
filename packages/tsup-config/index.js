import { defineConfig } from 'tsup';

/**
 * Shared tsup base for the workspace libraries.
 *
 * `antd`, `react`, `react-dom` and `@ant-design/icons` are kept external so the
 * runtime is never bundled into the libs — the apps provide a single copy and
 * transpile our packages via `transpilePackages` in `next.config`.
 *
 * @param {import('tsup').Options} [overrides]
 * @returns {import('tsup').Options}
 */
export function createConfig(overrides = {}) {
  return defineConfig({
    format: ['esm', 'cjs'],
    dts: true,
    sourcemap: true,
    clean: true,
    treeshake: true,
    external: [
      'react',
      'react-dom',
      'react/jsx-runtime',
      'antd',
      '@ant-design/icons',
      '@ant-design/cssinjs',
    ],
    ...overrides,
  });
}

export default createConfig;
