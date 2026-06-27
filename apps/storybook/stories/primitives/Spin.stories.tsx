import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Card, Spin, Space } from '@repo/design-system';

const meta: Meta<typeof Spin> = {
  title: 'Primitives/Spin',
  component: Spin,
  args: {
    size: 'default',
  },
  argTypes: {
    size: { control: 'select', options: ['small', 'default', 'large'] },
    spinning: { control: 'boolean' },
  },
};

export default meta;
type Story = StoryObj<typeof Spin>;

export const Default: Story = {};

export const Sizes: Story = {
  render: (args) => (
    <Space size="large" align="center">
      <Spin {...args} size="small" />
      <Spin {...args} size="default" />
      <Spin {...args} size="large" />
    </Space>
  ),
};

export const WithTip: Story = {
  render: (args) => (
    <Spin {...args} tip="Carregando...">
      <Card style={{ width: 320, height: 120 }}>Conteúdo</Card>
    </Spin>
  ),
};

export const WrappingContent: Story = {
  render: (args) => (
    <Spin {...args} spinning tip="Salvando...">
      <Card title="Relatório" style={{ width: 320 }}>
        Dados do relatório carregando sob o overlay.
      </Card>
    </Spin>
  ),
};

export const Fullscreen: Story = {
  render: (args) => <Spin {...args} spinning fullscreen />,
};
