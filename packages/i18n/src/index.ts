import ptBR from 'antd/locale/pt_BR';
import enUS from 'antd/locale/en_US';
import ptMessages from '../messages/pt-BR.json';
import enMessages from '../messages/en.json';

export const locales = ['pt-BR', 'en'] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = 'pt-BR';

/** Human-readable names for a language switcher. */
export const localeNames: Record<Locale, string> = {
  'pt-BR': 'Português',
  en: 'English',
};

export type Messages = typeof ptMessages;
const MESSAGES: Record<Locale, Messages> = { 'pt-BR': ptMessages, en: enMessages };

export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}

/** next-intl messages for a locale (falls back to the default). */
export function getMessages(locale: string): Messages {
  return MESSAGES[locale as Locale] ?? MESSAGES[defaultLocale];
}

type AntdLocale = typeof ptBR;
const ANTD_LOCALES: Record<Locale, AntdLocale> = { 'pt-BR': ptBR, en: enUS };

/** Map an app locale to the antd `ConfigProvider` locale (falls back to default). */
export function antdLocale(locale: string): AntdLocale {
  return ANTD_LOCALES[locale as Locale] ?? ANTD_LOCALES[defaultLocale];
}
