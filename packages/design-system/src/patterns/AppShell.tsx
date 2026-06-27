'use client';
import { Drawer, Grid, Layout, Button, theme } from 'antd';
import { MenuOutlined } from '@ant-design/icons';
import { useState, type ReactNode } from 'react';

const { Header, Sider, Content } = Layout;

export interface AppShellProps {
  /** Top navigation content (branding, switchers, user menu…). */
  header?: ReactNode;
  /** Sidebar content (typically a `Menu`). Becomes a Drawer on mobile. */
  sidebar?: ReactNode;
  children: ReactNode;
  siderWidth?: number;
}

/**
 * Responsive application shell: TopNav + Sidebar + Content. Below the `lg`
 * breakpoint the sidebar collapses into a Drawer toggled from the header.
 */
export function AppShell({ header, sidebar, children, siderWidth = 240 }: AppShellProps) {
  const screens = Grid.useBreakpoint();
  const { token } = theme.useToken();
  const [drawerOpen, setDrawerOpen] = useState(false);
  // `lg` is undefined on first SSR pass; treat as desktop to avoid layout flash.
  const isMobile = screens.lg === false;

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: token.margin,
          paddingInline: token.paddingContentHorizontal,
          background: token.colorBgContainer,
          borderBottom: `1px solid ${token.colorBorderSecondary}`,
        }}
      >
        {isMobile && sidebar && (
          <Button
            type="text"
            aria-label="Abrir menu de navegação"
            icon={<MenuOutlined />}
            onClick={() => setDrawerOpen(true)}
          />
        )}
        <div style={{ flex: 1, minWidth: 0 }}>{header}</div>
      </Header>
      <Layout>
        {sidebar && !isMobile && (
          <Sider
            width={siderWidth}
            theme="light"
            style={{ borderInlineEnd: `1px solid ${token.colorBorderSecondary}` }}
          >
            {sidebar}
          </Sider>
        )}
        {sidebar && isMobile && (
          <Drawer
            placement="left"
            open={drawerOpen}
            onClose={() => setDrawerOpen(false)}
            width={siderWidth}
            styles={{ body: { padding: 0 } }}
            // Close the drawer after a navigation click inside it.
            rootClassName="app-shell-drawer"
          >
            <div onClick={() => setDrawerOpen(false)}>{sidebar}</div>
          </Drawer>
        )}
        <Content style={{ padding: token.paddingLG }}>{children}</Content>
      </Layout>
    </Layout>
  );
}
