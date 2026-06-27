import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  transpilePackages: ['@repo/design-system', '@repo/brand-tokens', '@repo/utils'],
};

export default nextConfig;
