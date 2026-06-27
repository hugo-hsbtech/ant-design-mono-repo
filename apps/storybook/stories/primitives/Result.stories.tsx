import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Button, Result } from '@repo/design-system';

const meta: Meta<typeof Result> = {
  title: 'Primitives/Result',
  component: Result,
  args: {
    status: 'success',
    title: 'Operação concluída com sucesso',
    subTitle: 'Pedido #2017182818828182881 processado.',
  },
  argTypes: {
    status: {
      control: 'select',
      options: ['success', 'error', 'info', 'warning', '403', '404', '500'],
    },
  },
  render: (args) => (
    <Result {...args} extra={<Button type="primary">Voltar ao início</Button>} />
  ),
};

export default meta;
type Story = StoryObj<typeof Result>;

export const Success: Story = {};

export const Error: Story = {
  args: { status: 'error', title: 'Falha na submissão', subTitle: 'Verifique os dados.' },
};

export const Forbidden403: Story = {
  args: { status: '403', title: '403', subTitle: 'Você não tem permissão para acessar esta página.' },
};

export const NotFound404: Story = {
  args: { status: '404', title: '404', subTitle: 'A página que você visitou não existe.' },
};

export const ServerError500: Story = {
  args: { status: '500', title: '500', subTitle: 'Desculpe, algo deu errado no servidor.' },
};
