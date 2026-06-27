import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Layout, Menu, theme, Typography } from '@repo/design-system';
import {
  DashboardOutlined,
  SettingOutlined,
  TeamOutlined,
  UserOutlined,
} from '@ant-design/icons';

const { Header, Sider, Content, Footer } = Layout;

const sideItems = [
  { key: 'dashboard', icon: <DashboardOutlined />, label: 'Dashboard' },
  { key: 'team', icon: <TeamOutlined />, label: 'Team' },
  { key: 'users', icon: <UserOutlined />, label: 'Users' },
  { key: 'settings', icon: <SettingOutlined />, label: 'Settings' },
];

const topItems = [
  { key: 'home', label: 'Home' },
  { key: 'products', label: 'Products' },
  { key: 'pricing', label: 'Pricing' },
  { key: 'about', label: 'About' },
];

const meta: Meta<typeof Layout> = {
  title: 'Primitives/Layout',
  component: Layout,
  parameters: {
    layout: 'fullscreen',
  },
};

export default meta;
type Story = StoryObj<typeof Layout>;

export const Dashboard: Story = {
  render: () => {
    const { token } = theme.useToken();
    return (
      <Layout style={{ minHeight: '100vh' }}>
        <Sider breakpoint="lg" collapsedWidth="0">
          <div
            style={{
              height: 48,
              margin: 16,
              borderRadius: token.borderRadius,
              background: 'rgba(255,255,255,0.2)',
            }}
          />
          <Menu
            theme="dark"
            mode="inline"
            defaultSelectedKeys={['dashboard']}
            items={sideItems}
          />
        </Sider>
        <Layout>
          <Header style={{ background: token.colorBgContainer, paddingInline: 24 }}>
            <Typography.Title level={4} style={{ margin: '16px 0' }}>
              Dashboard
            </Typography.Title>
          </Header>
          <Content style={{ margin: 24 }}>
            <div
              style={{
                background: token.colorBgContainer,
                borderRadius: token.borderRadius,
                minHeight: 360,
                padding: 24,
              }}
            >
              Main content area.
            </div>
          </Content>
          <Footer style={{ textAlign: 'center' }}>Acme ©{new Date().getFullYear()}</Footer>
        </Layout>
      </Layout>
    );
  },
};

export const TopNav: Story = {
  render: () => {
    const { token } = theme.useToken();
    return (
      <Layout style={{ minHeight: '100vh' }}>
        <Header style={{ display: 'flex', alignItems: 'center' }}>
          <div
            style={{
              width: 120,
              height: 32,
              marginInlineEnd: 24,
              borderRadius: token.borderRadius,
              background: 'rgba(255,255,255,0.2)',
            }}
          />
          <Menu
            theme="dark"
            mode="horizontal"
            defaultSelectedKeys={['home']}
            items={topItems}
            style={{ flex: 1, minWidth: 0 }}
          />
        </Header>
        <Content style={{ padding: '24px 48px' }}>
          <div
            style={{
              background: token.colorBgContainer,
              borderRadius: token.borderRadius,
              minHeight: 380,
              padding: 24,
            }}
          >
            Page content below a top navigation bar.
          </div>
        </Content>
        <Footer style={{ textAlign: 'center' }}>Acme ©{new Date().getFullYear()}</Footer>
      </Layout>
    );
  },
};
