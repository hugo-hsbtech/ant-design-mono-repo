import type { Metadata } from 'next';
import { cookies } from 'next/headers';
import { AntdRegistry } from '@ant-design/nextjs-registry';
import type { ThemeMode } from '@repo/design-system';
import { Providers } from './providers';
// Brand CSS custom properties.
import '@repo/brand-tokens/css';

export const metadata: Metadata = {
  title: 'Reservation — Dashboard',
  description: 'Hotel & room management sample on Ant Design v5.',
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  // Read the theme preference on the server to avoid a flash on first paint.
  const cookieStore = await cookies();
  const mode: ThemeMode = cookieStore.get('theme')?.value === 'dark' ? 'dark' : 'light';

  return (
    <html lang="en" data-theme={mode} suppressHydrationWarning>
      <body style={{ margin: 0 }}>
        <AntdRegistry>
          <Providers initialMode={mode}>{children}</Providers>
        </AntdRegistry>
      </body>
    </html>
  );
}
