import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Our workspace libs ship untranspiled ESM; let Next compile them.
  transpilePackages: [
    '@repo/design-system',
    '@repo/brand-tokens',
    '@repo/icons',
    '@repo/utils',
    '@repo/i18n',
  ],
};

export default withNextIntl(nextConfig);
