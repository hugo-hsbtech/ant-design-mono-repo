import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Button, PageHeader, Space } from '@repo/design-system';
import { EditOutlined, PlusOutlined } from '@ant-design/icons';

const meta = {
  title: 'Patterns/PageHeader',
  component: PageHeader,
  parameters: { layout: 'padded' },
} satisfies Meta<typeof PageHeader>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    title: 'Projetos',
    subtitle: 'Gerencie os projetos da sua organização',
    breadcrumb: [{ title: 'Início', href: '#' }, { title: 'Projetos' }],
    extra: (
      <Space>
        <Button icon={<EditOutlined />}>Editar</Button>
        <Button type="primary" icon={<PlusOutlined />}>
          Novo
        </Button>
      </Space>
    ),
  },
};

export const WithBack: Story = {
  args: {
    title: 'Projeto Apollo',
    subtitle: 'Detalhes do projeto',
    onBack: () => {},
  },
};
