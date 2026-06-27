import { beforeAll } from 'vitest';
import { setProjectAnnotations } from '@storybook/nextjs-vite';
import * as projectAnnotations from './preview';

// Apply the same decorators/globals/parameters from preview to the tests so a
// story renders in the test runner exactly as it does in the catalog.
const project = setProjectAnnotations([projectAnnotations]);

beforeAll(project.beforeAll);
