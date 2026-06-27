import { getRequestConfig } from 'next-intl/server';
import { cookies } from 'next/headers';
import { defaultLocale, getMessages, isLocale } from '@repo/i18n';

// "Without i18n routing" (ADR-0002): locale resolved from a cookie.
export default getRequestConfig(async () => {
  const store = await cookies();
  const cookieLocale = store.get('locale')?.value;
  const locale = cookieLocale && isLocale(cookieLocale) ? cookieLocale : defaultLocale;
  return { locale, messages: getMessages(locale) };
});
