'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signOut } from 'next-auth/react';
import { AppShell, Flex, Menu, Space, Tag } from '@repo/design-system';
import {
  AppstoreOutlined,
  GlobalOutlined,
  ReadOutlined,
  SettingOutlined,
  TeamOutlined,
} from '@ant-design/icons';
import { OrgProvider, type OrgContextValue } from '@/lib/org-context';
import { ThemeToggle } from '@/components/ThemeToggle';
import { ProductBranding } from '@/components/product/ProductBranding';
import { OrgSwitcher } from '@/components/product/OrgSwitcher';
import { AppSwitcher } from '@/components/product/AppSwitcher';
import {
  NotificationCenter,
  type NotificationItem,
} from '@/components/product/NotificationCenter';
import { UserMenu } from '@/components/product/UserMenu';

const SEED_NOTIFICATIONS: NotificationItem[] = [
  { id: 'n1', title: 'Bem-vindo à Plataforma', description: 'Comece criando um projeto.', time: 'agora' },
  { id: 'n2', title: 'Novo membro', description: 'Alan entrou na organização.', time: 'há 2h', read: true },
];

export function Shell({ value, children }: { value: OrgContextValue; children: React.ReactNode }) {
  const router = useRouter();
  const { org, orgs, role, user } = value;
  const [notifications, setNotifications] = useState(SEED_NOTIFICATIONS);

  const products = [
    { key: 'dashboard', name: 'Dashboard', icon: <AppstoreOutlined />, href: `/${org.slug}` },
    { key: 'landing', name: 'Landing', icon: <GlobalOutlined />, href: '#' },
    { key: 'site', name: 'Site', icon: <ReadOutlined />, href: '#' },
  ];

  const header = (
    <Flex align="center" justify="space-between" style={{ width: '100%' }} gap="middle">
      <Space align="center" size="middle">
        <ProductBranding name="Plataforma" href={`/${org.slug}`} />
        <OrgSwitcher current={org} orgs={orgs} onSelect={(slug) => router.push(`/${slug}`)} />
        <Tag>{role}</Tag>
      </Space>
      <Space align="center" size="small">
        <AppSwitcher products={products} currentKey="dashboard" />
        <NotificationCenter
          items={notifications}
          onMarkAllRead={() => setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))}
        />
        <ThemeToggle />
        <UserMenu
          name={user.name ?? 'Usuário'}
          email={user.email ?? undefined}
          onLogout={() => signOut({ callbackUrl: '/login' })}
        />
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
