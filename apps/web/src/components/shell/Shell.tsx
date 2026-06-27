'use client';
import { useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
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
import { LanguageSwitcher } from '@/components/LanguageSwitcher';
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
  const pathname = usePathname();
  const t = useTranslations('nav');
  const { org, orgs, role, user } = value;
  const [notifications, setNotifications] = useState(SEED_NOTIFICATIONS);

  const selectedKey = pathname.endsWith('/members')
    ? 'members'
    : pathname.endsWith('/settings')
      ? 'settings'
      : 'projects';

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
        <LanguageSwitcher />
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
      selectedKeys={[selectedKey]}
      style={{ borderInlineEnd: 'none' }}
      onClick={({ key }) => {
        if (key === 'projects') router.push(`/${org.slug}`);
        if (key === 'members') router.push(`/${org.slug}/members`);
        if (key === 'settings') router.push(`/${org.slug}/settings`);
      }}
      items={[
        { key: 'projects', icon: <AppstoreOutlined />, label: t('projects') },
        { key: 'members', icon: <TeamOutlined />, label: t('members') },
        { key: 'settings', icon: <SettingOutlined />, label: t('settings') },
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
