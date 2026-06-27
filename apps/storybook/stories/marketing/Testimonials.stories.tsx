import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Testimonials } from '@repo/design-system';

const meta = {
  title: 'Marketing/Testimonials',
  component: Testimonials,
  parameters: { layout: 'fullscreen' },
} satisfies Meta<typeof Testimonials>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    heading: 'Quem usa, recomenda',
    items: [
      { quote: 'Subimos um dashboard inteiro na marca em dias.', author: 'Ada Lovelace', role: 'CTO, Apollo' },
      { quote: 'O tema unificado economizou semanas de design.', author: 'Alan Turing', role: 'Eng. Lead, Hermes' },
      { quote: 'Catálogo vivo: tudo testado e acessível.', author: 'Grace Hopper', role: 'Head de Produto, Atlas' },
    ],
  },
};
