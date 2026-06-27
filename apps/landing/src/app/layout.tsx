import type { Metadata } from 'next';
import { NextIntlClientProvider } from 'next-intl';
import { getLocale, getMessages } from 'next-intl/server';
import { AntdRegistry } from '@ant-design/nextjs-registry';
import { Providers } from './providers';
import '@repo/brand-tokens/css';

export const metadata: Metadata = {
  title: 'Plataforma — Uma marca, três frentes',
  description: 'Dashboards, landing pages e sites institucionais sobre o Ant Design v5.',
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const locale = await getLocale();
  const messages = await getMessages();
  return (
    <html lang={locale}>
      <body style={{ margin: 0 }}>
        <AntdRegistry>
          <NextIntlClientProvider locale={locale} messages={messages}>
            <Providers>{children}</Providers>
          </NextIntlClientProvider>
        </AntdRegistry>
      </body>
    </html>
  );
}
