import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Footer } from '@repo/design-system';

const meta = {
  title: 'Marketing/Footer',
  component: Footer,
  parameters: { layout: 'fullscreen' },
} satisfies Meta<typeof Footer>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    brand: 'Plataforma',
    description: 'Uma marca, três frentes — sobre o Ant Design v5.',
    copyright: '© 2026 Plataforma. Todos os direitos reservados.',
    columns: [
      {
        title: 'Produto',
        links: [
          { label: 'Recursos', href: '#' },
          { label: 'Preços', href: '#' },
          { label: 'Changelog', href: '#' },
        ],
      },
      {
        title: 'Empresa',
        links: [
          { label: 'Sobre', href: '#' },
          { label: 'Blog', href: '#' },
          { label: 'Contato', href: '#' },
        ],
      },
      {
        title: 'Legal',
        links: [
          { label: 'Privacidade', href: '#' },
          { label: 'Termos', href: '#' },
        ],
      },
    ],
  },
};
