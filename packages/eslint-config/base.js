import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import prettier from 'eslint-config-prettier';
import globals from 'globals';

/** Shared flat ESLint config for all packages. */
export const baseConfig = [
  js.configs.recommended,
  ...tseslint.configs.recommended,
  prettier,
  {
    rules: {
      '@typescript-eslint/no-unused-vars': [
        'warn',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],
      '@typescript-eslint/consistent-type-imports': [
        'warn',
        { prefer: 'type-imports', fixStyle: 'inline-type-imports' },
      ],
    },
  },
  {
    // Build scripts and config files run in Node.
    files: ['**/*.{mjs,cjs}', '**/*.config.{js,ts,mjs,cjs}', 'scripts/**'],
    languageOptions: {
      globals: { ...globals.node },
    },
  },
  {
    ignores: [
      'dist/**',
      '.next/**',
      'storybook-static/**',
      '.turbo/**',
      'coverage/**',
      '**/__generated__/**',
      // tsup writes a transient bundled config next to tsup.config.ts while
      // building; a concurrent `eslint .` can race and crash on it (ENOENT).
      '**/*.bundled_*.mjs',
    ],
  },
];

export default baseConfig;
