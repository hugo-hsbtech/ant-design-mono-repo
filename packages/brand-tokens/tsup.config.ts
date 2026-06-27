import { createConfig } from '@repo/tsup-config';

export default createConfig({
  entry: ['src/index.ts'],
  // brand-tokens has no antd/react runtime to bundle; tokens are plain data.
  external: ['antd'],
  // The token build (scripts/build-tokens.mjs) writes dist/brand.css *before*
  // tsup runs, so we must not wipe dist here.
  clean: false,
});
