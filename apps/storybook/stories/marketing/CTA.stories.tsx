import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { CTA } from '@repo/design-system';

const meta = {
  title: 'Marketing/CTA',
  component: CTA,
  parameters: { layout: 'fullscreen' },
} satisfies Meta<typeof CTA>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    title: 'Pronto para começar?',
    description: 'Suba sua primeira frente na marca em minutos.',
    primaryAction: { label: 'Criar conta', href: '#' },
    secondaryAction: { label: 'Falar com vendas', href: '#' },
  },
};
