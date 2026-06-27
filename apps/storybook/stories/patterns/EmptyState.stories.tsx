import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Button, EmptyState } from '@repo/design-system';
import { PlusOutlined } from '@ant-design/icons';

const meta = {
  title: 'Patterns/EmptyState',
  component: EmptyState,
  parameters: { layout: 'padded' },
} satisfies Meta<typeof EmptyState>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    title: 'Nenhum projeto ainda',
    description: 'Crie seu primeiro projeto para começar.',
    action: (
      <Button type="primary" icon={<PlusOutlined />}>
        Criar projeto
      </Button>
    ),
  },
};
