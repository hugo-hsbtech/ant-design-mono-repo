'use client';
import { useRouter } from 'next/navigation';
import { useLocale, useTranslations } from 'next-intl';
import { Button, Dropdown } from '@repo/design-system';
import { GlobalOutlined } from '@ant-design/icons';
import { locales, localeNames } from '@repo/i18n';

const ONE_YEAR = 60 * 60 * 24 * 365;

/** Switches the app locale via a cookie (ADR-0002: no locale segment in URL). */
export function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const t = useTranslations('nav');

  const setLocale = (next: string) => {
    document.cookie = `locale=${next}; path=/; max-age=${ONE_YEAR}; samesite=lax`;
    router.refresh();
  };

  return (
    <Dropdown
      trigger={['click']}
      menu={{
        selectable: true,
        selectedKeys: [locale],
        items: locales.map((l) => ({ key: l, label: localeNames[l] })),
        onClick: ({ key }) => setLocale(key),
      }}
    >
      <Button type="text" icon={<GlobalOutlined />} aria-label={t('language')} />
    </Dropdown>
  );
}
