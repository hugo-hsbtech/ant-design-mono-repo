import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Our workspace libs ship untranspiled ESM; let Next compile them.
  transpilePackages: [
    '@repo/design-system',
    '@repo/brand-tokens',
    '@repo/icons',
    '@repo/utils',
  ],
};

export default nextConfig;
