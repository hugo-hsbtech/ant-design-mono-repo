import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { AppShell, Avatar, Button, Flex, Menu, Space, Typography } from '@repo/design-system';
import {
  AppstoreOutlined,
  BellOutlined,
  HomeOutlined,
  SettingOutlined,
  TeamOutlined,
} from '@ant-design/icons';

const { Text } = Typography;

const meta = {
  title: 'Patterns/AppShell',
  component: AppShell,
  parameters: { layout: 'fullscreen' },
} satisfies Meta<typeof AppShell>;

export default meta;
type Story = StoryObj<typeof meta>;

const sidebar = (
  <Menu
    mode="inline"
    defaultSelectedKeys={['home']}
    style={{ borderInlineEnd: 'none' }}
    items={[
      { key: 'home', icon: <HomeOutlined />, label: 'Início' },
      { key: 'projects', icon: <AppstoreOutlined />, label: 'Projetos' },
      { key: 'members', icon: <TeamOutlined />, label: 'Membros' },
      { key: 'settings', icon: <SettingOutlined />, label: 'Configurações' },
    ]}
  />
);

const header = (
  <Flex align="center" justify="space-between" style={{ width: '100%' }}>
    <Text strong>Plataforma</Text>
    <Space>
      <Button type="text" icon={<BellOutlined />} aria-label="Notificações" />
      <Avatar>AL</Avatar>
    </Space>
  </Flex>
);

export const Default: Story = {
  args: {
    header,
    sidebar,
    children: (
      <div>
        <Typography.Title level={3}>Conteúdo</Typography.Title>
        <Text type="secondary">
          Redimensione a viewport: abaixo de <Text code>lg</Text> a sidebar vira um Drawer.
        </Text>
      </div>
    ),
  },
};
