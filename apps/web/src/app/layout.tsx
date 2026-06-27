import type { Metadata } from 'next';
import { cookies } from 'next/headers';
import { AntdRegistry } from '@ant-design/nextjs-registry';
import type { ThemeMode } from '@repo/design-system';
import { Providers } from './providers';
// Brand CSS custom properties (for non-antd / marketing usage).
import '@repo/brand-tokens/css';

export const metadata: Metadata = {
  title: 'Plataforma — Dashboard',
  description: 'Dashboard SaaS sobre Ant Design v5, na identidade da marca.',
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  // Read the theme preference on the server to avoid a flash on first paint.
  const cookieStore = await cookies();
  const mode: ThemeMode = cookieStore.get('theme')?.value === 'dark' ? 'dark' : 'light';

  return (
    <html lang="pt-BR" data-theme={mode} suppressHydrationWarning>
      <body style={{ margin: 0 }}>
        {/* AntdRegistry extracts antd's first-screen styles during SSR. */}
        <AntdRegistry>
          <Providers initialMode={mode}>{children}</Providers>
        </AntdRegistry>
      </body>
    </html>
  );
}
