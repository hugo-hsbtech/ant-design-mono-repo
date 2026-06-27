'use client';
import { ThemeProvider } from '@repo/design-system';
import { useLocale } from 'next-intl';
import { antdLocale } from '@repo/i18n';

export function Providers({ children }: { children: React.ReactNode }) {
  const locale = useLocale();
  return (
    <ThemeProvider defaultMode="light" locale={antdLocale(locale)}>
      {children}
    </ThemeProvider>
  );
}
