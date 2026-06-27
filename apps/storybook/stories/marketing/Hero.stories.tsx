import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Hero } from '@repo/design-system';

const meta = {
  title: 'Marketing/Hero',
  component: Hero,
  parameters: { layout: 'fullscreen' },
} satisfies Meta<typeof Hero>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    eyebrow: 'Plataforma de UI',
    title: 'Uma marca, três frentes',
    subtitle:
      'Dashboards, landing pages e sites institucionais com identidade unificada, sobre o Ant Design v5.',
    primaryAction: { label: 'Começar agora', href: '#' },
    secondaryAction: { label: 'Ver documentação', href: '#' },
  },
};
