import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Alert, Button, Space } from '@repo/design-system';

const meta: Meta<typeof Alert> = {
  title: 'Primitives/Alert',
  component: Alert,
  args: {
    message: 'Operação concluída',
    type: 'info',
    showIcon: true,
  },
  argTypes: {
    type: { control: 'select', options: ['success', 'info', 'warning', 'error'] },
    showIcon: { control: 'boolean' },
    closable: { control: 'boolean' },
    banner: { control: 'boolean' },
  },
  render: (args) => <Alert {...args} style={{ maxWidth: 480 }} />,
};

export default meta;
type Story = StoryObj<typeof Alert>;

export const Default: Story = {};

export const Types: Story = {
  render: (args) => (
    <Space direction="vertical" style={{ width: 480 }}>
      <Alert {...args} type="success" message="Sucesso" />
      <Alert {...args} type="info" message="Informação" />
      <Alert {...args} type="warning" message="Atenção" />
      <Alert {...args} type="error" message="Erro" />
    </Space>
  ),
};

export const WithDescription: Story = {
  args: {
    type: 'warning',
    message: 'Quase lá',
    description: 'Revise os campos destacados antes de continuar.',
  },
};

export const Closable: Story = {
  args: { type: 'error', message: 'Falha ao salvar', closable: true },
};

export const Banner: Story = {
  args: { type: 'info', message: 'Modo de manutenção ativo', banner: true },
  render: (args) => <Alert {...args} />,
};

export const WithAction: Story = {
  args: {
    type: 'warning',
    message: 'Sessão expirando',
    description: 'Sua sessão vai expirar em breve.',
    action: (
      <Button size="small" type="primary">
        Renovar
      </Button>
    ),
  },
};
