import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { App, Button, Space } from '@repo/design-system';

// The global `message` API does NOT read ConfigProvider, so we use
// `App.useApp()`. The global ThemeProvider already wraps stories with antd App.
function MessageDemo() {
  const { message } = App.useApp();
  return (
    <Space wrap>
      <Button onClick={() => message.success('Salvo!')}>Sucesso</Button>
      <Button danger onClick={() => message.error('Falha ao salvar')}>
        Erro
      </Button>
      <Button onClick={() => message.warning('Atenção necessária')}>Aviso</Button>
      <Button onClick={() => message.loading('Carregando...')}>Loading</Button>
      <Button onClick={() => message.info('Informação')}>Info</Button>
    </Space>
  );
}

const meta: Meta = {
  title: 'Primitives/Message',
};

export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => <MessageDemo />,
};
