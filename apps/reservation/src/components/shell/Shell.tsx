'use client';
import { usePathname, useRouter } from 'next/navigation';
import { AppShell, Flex, Menu, Space } from '@repo/design-system';
import { HomeOutlined } from '@ant-design/icons';
import { ProductBranding } from '@/components/product/ProductBranding';
import { ThemeToggle } from '@/components/ThemeToggle';

export function Shell({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();

  const header = (
    <Flex align="center" justify="space-between" style={{ width: '100%' }} gap="middle">
      <ProductBranding name="Reservation" href="/hotels" />
      <Space align="center" size="small">
        <ThemeToggle />
      </Space>
    </Flex>
  );

  const sidebar = (
    <Menu
      mode="inline"
      selectedKeys={[pathname.startsWith('/hotels') ? 'hotels' : '']}
      style={{ borderInlineEnd: 'none' }}
      onClick={({ key }) => {
        if (key === 'hotels') router.push('/hotels');
      }}
      items={[{ key: 'hotels', icon: <HomeOutlined />, label: 'Hotels' }]}
    />
  );

  return (
    <AppShell header={header} sidebar={sidebar}>
      {children}
    </AppShell>
  );
}
