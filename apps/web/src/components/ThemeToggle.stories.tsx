import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { ThemeToggle } from './ThemeToggle';

// Co-located app-specific story — pulled into the central catalog via the glob
// in apps/storybook/.storybook/main.ts (PRD §6.2: one catalog, two origins).
const meta: Meta<typeof ThemeToggle> = {
  title: 'Product/ThemeToggle',
  component: ThemeToggle,
};

export default meta;
type Story = StoryObj<typeof ThemeToggle>;

export const Default: Story = {};
