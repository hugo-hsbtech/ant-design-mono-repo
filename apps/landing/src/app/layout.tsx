import type { Metadata } from 'next';
import { AntdRegistry } from '@ant-design/nextjs-registry';
import { Providers } from './providers';
import '@repo/brand-tokens/css';

export const metadata: Metadata = {
  title: 'Plataforma — Uma marca, três frentes',
  description: 'Dashboards, landing pages e sites institucionais sobre o Ant Design v5.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body style={{ margin: 0 }}>
        <AntdRegistry>
          <Providers>{children}</Providers>
        </AntdRegistry>
      </body>
    </html>
  );
}
