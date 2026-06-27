import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { FAQ } from '@repo/design-system';

const meta = {
  title: 'Marketing/FAQ',
  component: FAQ,
  parameters: { layout: 'fullscreen' },
} satisfies Meta<typeof FAQ>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    items: [
      { question: 'Preciso saber Ant Design?', answer: 'Não — você importa tudo de @repo/design-system.' },
      { question: 'Como troco a marca?', answer: 'Edite os tokens DTCG em @repo/brand-tokens; tudo re-tematiza.' },
      { question: 'Tem dark mode?', answer: 'Sim, via o toggle no ThemeProvider.' },
    ],
  },
};
