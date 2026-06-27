import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Features } from '@repo/design-system';
import { RocketOutlined, SafetyOutlined, ThunderboltOutlined } from '@ant-design/icons';

const meta = {
  title: 'Marketing/Features',
  component: Features,
  parameters: { layout: 'fullscreen' },
} satisfies Meta<typeof Features>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    heading: 'Por que a plataforma',
    subheading: 'Tudo construído sobre tokens de marca.',
    items: [
      {
        icon: <ThunderboltOutlined />,
        title: 'Tema unificado',
        description: 'Mude a cor primária uma vez e tudo se re-tematiza.',
      },
      {
        icon: <RocketOutlined />,
        title: 'Pronto para produção',
        description: '60+ componentes do Ant Design pela fachada do design-system.',
      },
      {
        icon: <SafetyOutlined />,
        title: 'Acessível',
        description: 'WCAG AA como linha de base, verificado com axe no catálogo.',
      },
    ],
  },
};
