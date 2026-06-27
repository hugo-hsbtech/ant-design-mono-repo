import { getRequestConfig } from 'next-intl/server';
import { cookies } from 'next/headers';
import { defaultLocale, getMessages, isLocale } from '@repo/i18n';

// "Without i18n routing" (ADR-0002): the locale comes from a cookie, so it does
// not collide with the /[org] dynamic routes. No locale segment in the URL.
export default getRequestConfig(async () => {
  const store = await cookies();
  const cookieLocale = store.get('locale')?.value;
  const locale = cookieLocale && isLocale(cookieLocale) ? cookieLocale : defaultLocale;
  return { locale, messages: getMessages(locale) };
});
