import { createConfig } from '@repo/tsup-config';

export default createConfig({
  entry: ['src/index.ts'],
  // Keep all antd subpaths external (e.g. antd/locale/pt_BR); bundle the
  // message JSON into the lib.
  external: [/^antd(\/|$)/],
});
