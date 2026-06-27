import { reactConfig } from '@repo/eslint-config/react';
import storybook from 'eslint-plugin-storybook';

export default [...reactConfig, ...storybook.configs['flat/recommended']];
