# @repo/storybook — catálogo central

**Por que existe:** é a **vitrine e o campo de provas** da plataforma. Um único
Storybook cataloga tudo: foundations (tokens aplicados), primitives (antd via
fachada), patterns, blocos de marketing e compostos de produto. É também onde rodam
os **testes de componente** (Storybook Test + Playwright) e o gate de
**acessibilidade** (addon a11y com `test: 'error'` — violação AA falha o teste).

Roda em **http://localhost:6006** (`make storybook` ou
`pnpm --filter @repo/storybook dev`).

## Por que um app separado (e não stories dentro do design-system)?

- O catálogo junta stories de **várias origens**: as compartilhadas
  (`stories/**`, deste app) e as co-localizadas nos apps
  (`apps/<app>/src/**/*.stories.tsx`), via glob no `.storybook/main.ts`.
- O `design-system` permanece uma lib limpa, sem dependências de Storybook.
- Builder `@storybook/nextjs-vite`: as stories rodam no mesmo contexto dos apps
  (Next.js), com Vitest browser mode para os testes.

## Organização das stories

Ver [`stories/README.md`](./stories/README.md) — taxonomia das pastas
(`foundations/`, `primitives/`, `patterns/`, `marketing/`, `product/`), o template
de story e o **definition of done**: componente novo sem story não fecha tarefa.

## Comandos

```sh
pnpm --filter @repo/storybook dev              # catálogo em :6006
pnpm --filter @repo/storybook test:storybook   # testes de componente + a11y
pnpm --filter @repo/storybook build:storybook  # build estático (publicável)
```
