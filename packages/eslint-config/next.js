import { reactConfig } from './react.js';

/**
 * ESLint config for Next.js apps. The Next.js plugin is resolved from the app
 * itself (via FlatCompat in the app's eslint config) to avoid version drift;
 * here we only extend the shared React rules.
 */
export const nextConfig = [...reactConfig];

export default nextConfig;
