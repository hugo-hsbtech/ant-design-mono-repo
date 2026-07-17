# @repo/test-config

**Por que existe:** bases compartilhadas de teste para que todo workspace rode Vitest
e Playwright com o mesmo setup (jsdom, Testing Library, matchers) sem copiar
boilerplate de config — e para que uma mudança de setup (ex.: novo matcher global)
aconteça num lugar só.

## Exports

| Export                         | O que é                                                             |
| ------------------------------ | ------------------------------------------------------------------- |
| `@repo/test-config/vitest`     | Config base do Vitest (ambiente, globals) para unit/component tests |
| `@repo/test-config/setup`      | Setup file: `@testing-library/jest-dom` e afins                     |
| `@repo/test-config/playwright` | Config base do Playwright para E2E                                  |

Os arquivos são consumidos direto como TS (sem build) — este pacote não tem `dist`.

## Como usar

```ts
// vitest.config.ts de um pacote/app
import { defineConfig, mergeConfig } from 'vitest/config';
import base from '@repo/test-config/vitest';

export default mergeConfig(
  base,
  defineConfig({
    // overrides locais (aliases, environment…)
  }),
);
```

```ts
// playwright.config.ts de um app
import base from '@repo/test-config/playwright';

export default { ...base /* baseURL, webServer do app */ };
```

## Onde cada tipo de teste vive

- **Unit** (Vitest): co-localizado no código (`*.test.ts[x]`).
- **Component** (Storybook Test + Playwright): via stories, em `apps/storybook`.
- **E2E** (Playwright): no app dono do fluxo (ex.: `apps/web/e2e`).
