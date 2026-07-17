import { fileURLToPath } from "node:url";
import { dirname } from "node:path";
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
  addons: [getAbsolutePath("@storybook/addon-docs"), getAbsolutePath("@storybook/addon-a11y"), getAbsolutePath("@storybook/addon-vitest")],
  framework: {
    name: getAbsolutePath("@storybook/nextjs-vite"),
    options: {},
  },
  core: {
    disableTelemetry: true,
  },
};

export default config;

function getAbsolutePath(value: string): any {
  return dirname(fileURLToPath(import.meta.resolve(`${value}/package.json`)));
}
