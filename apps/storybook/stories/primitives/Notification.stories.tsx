import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { App, Button, Space } from '@repo/design-system';

// The global `notification` API does NOT read ConfigProvider, so we use
// `App.useApp()`. The global ThemeProvider already wraps stories with antd App.
function NotificationDemo() {
  const { notification } = App.useApp();
  return (
    <Space wrap>
      <Button
        onClick={() =>
          notification.success({ message: 'Sucesso', description: 'Tudo certo!' })
        }
      >
        Sucesso
      </Button>
      <Button
        danger
        onClick={() =>
          notification.error({ message: 'Erro', description: 'Algo deu errado.' })
        }
      >
        Erro
      </Button>
      <Button
        onClick={() =>
          notification.open({ message: 'Notificação', description: 'Mensagem aberta.' })
        }
      >
        Abrir
      </Button>
    </Space>
  );
}

function PlacementDemo() {
  const { notification } = App.useApp();
  return (
    <Space wrap>
      {(['topLeft', 'topRight', 'bottomLeft', 'bottomRight'] as const).map((placement) => (
        <Button
          key={placement}
          onClick={() =>
            notification.info({ message: placement, description: `Posição ${placement}`, placement })
          }
        >
          {placement}
        </Button>
      ))}
    </Space>
  );
}

const meta: Meta = {
  title: 'Primitives/Notification',
};

export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => <NotificationDemo />,
};

export const Placements: Story = {
  render: () => <PlacementDemo />,
};
