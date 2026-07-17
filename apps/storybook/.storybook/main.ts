import { fileURLToPath } from 'node:url';
import { dirname } from 'node:path';
import type { StorybookConfig } from '@storybook/nextjs-vite';

const config: StorybookConfig = {
  // One catalog, two origins (PRD §6.2):
  //  1. Shared stories live here, in the dedicated stories/ folder.
  //  2. App-specific stories are co-located in each app and pulled in via glob.
  stories: [
    '../stories/**/*.mdx',
    '../stories/**/*.stories.@(ts|tsx)',
    '../../web/src/**/*.stories.@(ts|tsx)',
    '../../landing/src/**/*.stories.@(ts|tsx)',
    '../../site/src/**/*.stories.@(ts|tsx)',
  ],
  addons: [
    getAbsolutePath('@storybook/addon-docs'),
    getAbsolutePath('@storybook/addon-a11y'),
    getAbsolutePath('@storybook/addon-vitest'),
  ],
  framework: {
    name: getAbsolutePath('@storybook/nextjs-vite'),
    options: {},
  },
  core: {
    disableTelemetry: true,
  },
  // Pre-bundle the deps that the component-test browser run otherwise discovers
  // late. Late discovery triggers a mid-run Vite re-optimization that changes
  // the `?v=` of already-served chunks (e.g. Storybook's react-18 renderer
  // shim), 404-ing in-flight dynamic imports ("Failed to fetch dynamically
  // imported module"). Forcing them into the initial optimize pass makes the
  // run deterministic. This viteFinal is applied to the addon-vitest browser
  // environment too, so it reaches the sb-vitest optimizer.
  viteFinal(config) {
    config.optimizeDeps = {
      ...config.optimizeDeps,
      include: [
        ...(config.optimizeDeps?.include ?? []),
        'storybook/test',
        '@storybook/react-dom-shim',
        '@storybook/addon-a11y/preview',
        'react',
        'react-dom',
        'react-dom/client',
      ],
    };
    return config;
  },
};

export default config;

function getAbsolutePath(value: string): string {
  return dirname(fileURLToPath(import.meta.resolve(`${value}/package.json`)));
}
