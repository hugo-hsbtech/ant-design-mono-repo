'use client';
import { useRouter } from 'next/navigation';
import { signOut } from 'next-auth/react';
import {
  AppShell,
  Avatar,
  Button,
  Dropdown,
  Flex,
  Menu,
  Select,
  Space,
  Tag,
  Typography,
} from '@repo/design-system';
import {
  AppstoreOutlined,
  LogoutOutlined,
  SettingOutlined,
  TeamOutlined,
} from '@ant-design/icons';
import { OrgProvider, type OrgContextValue } from '@/lib/org-context';
import { ThemeToggle } from '@/components/ThemeToggle';

const { Text } = Typography;

export function Shell({ value, children }: { value: OrgContextValue; children: React.ReactNode }) {
  const router = useRouter();
  const { org, orgs, role, user } = value;

  const header = (
    <Flex align="center" justify="space-between" style={{ width: '100%' }} gap="middle">
      <Space align="center" size="middle">
        <Text strong>Plataforma</Text>
        <Select
          size="small"
          value={org.slug}
          onChange={(slug) => router.push(`/${slug}`)}
          aria-label="Trocar de organização"
          style={{ minWidth: 140 }}
          options={orgs.map((o) => ({ value: o.slug, label: o.name }))}
        />
        <Tag>{role}</Tag>
      </Space>
      <Space>
        <ThemeToggle />
        <Dropdown
          menu={{
            items: [
              { key: 'profile', label: user.name ?? user.email ?? 'Perfil', disabled: true },
              { type: 'divider' },
              { key: 'logout', icon: <LogoutOutlined />, label: 'Sair' },
            ],
            onClick: ({ key }) => {
              if (key === 'logout') signOut({ callbackUrl: '/login' });
            },
          }}
        >
          <Button type="text" aria-label="Menu do usuário">
            <Avatar size="small">{(user.name ?? 'U').charAt(0)}</Avatar>
          </Button>
        </Dropdown>
      </Space>
    </Flex>
  );

  const sidebar = (
    <Menu
      mode="inline"
      selectedKeys={['projects']}
      style={{ borderInlineEnd: 'none' }}
      onClick={({ key }) => {
        if (key === 'projects') router.push(`/${org.slug}`);
      }}
      items={[
        { key: 'projects', icon: <AppstoreOutlined />, label: 'Projetos' },
        { key: 'members', icon: <TeamOutlined />, label: 'Membros', disabled: true },
        { key: 'settings', icon: <SettingOutlined />, label: 'Configurações', disabled: true },
      ]}
    />
  );

  return (
    <OrgProvider value={value}>
      <AppShell header={header} sidebar={sidebar}>
        {children}
      </AppShell>
    </OrgProvider>
  );
}
