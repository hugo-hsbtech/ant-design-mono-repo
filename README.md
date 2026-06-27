# Plataforma de UI — Ant Design v5

Base de UI reutilizável construída **sobre o Ant Design v5**, com identidade de marca
unificada nas três frentes:

- **Dashboards / SaaS** (`apps/web`)
- **Landing pages** (`apps/landing`)
- **Sites institucionais** (`apps/site`)

A mesma marca (cor primária, tipografia, raios, spacing) é definida **uma vez** em
design tokens (`packages/brand-tokens`) e aplicada via `ConfigProvider` do Ant Design.

## Filosofia

- **Fundação:** dependemos do `antd` — não recriamos componentes de baixo nível e
  herdamos suas atualizações.
- **Por cima:** componentes próprios (blocos de marketing, layouts, compostos de
  produto) construídos sobre os componentes/tokens do Ant Design.
- **Fachada:** os apps nunca importam `antd` direto — importam de
  `@repo/design-system`, ponto único de evolução.

## Estrutura

```
apps/
  web/        dashboard / SaaS (Next.js App Router)
  landing/    landing page (Next.js)
  site/       site institucional (Next.js)
  storybook/  catálogo central (Storybook 9 + nextjs-vite)
packages/
  brand-tokens/      source.ts (fonte única) → ThemeConfig light/dark + CSS vars
  design-system/     fachada antd + patterns + marketing + ThemeProvider
  icons/             ícones próprios
  utils/             helpers compartilhados
  typescript-config/ tsconfig base / react-library / nextjs
  eslint-config/     flat config base / react / next
  test-config/       Vitest + Playwright bases
  tsup-config/       build comum das libs
```

## Stack

pnpm workspaces · Turborepo · TypeScript · Ant Design v5 · Next.js App Router ·
Storybook 9 · Vitest · Playwright · Changesets.

## Comandos

```bash
pnpm install            # instala o workspace
pnpm dev                # roda todos os apps em dev
pnpm build              # build de tudo (turbo)
pnpm lint               # ESLint
pnpm typecheck          # TypeScript
pnpm test               # testes unitários (Vitest)
pnpm test:storybook     # testes de componente (Storybook Test / Playwright)
pnpm test:e2e           # E2E (Playwright)
pnpm build:storybook    # build do catálogo
pnpm changeset          # cria um changeset para release
```

## Theming

A marca vive em `packages/brand-tokens/src/source.ts`. Dele derivam:

- `lightTheme` / `darkTheme` — objetos `ThemeConfig` do antd (componentes).
- CSS vars (`css.ts`) — para os blocos de marketing (landing/site), fora do antd.

Trocar o `colorPrimary` em `source.ts` re-tematiza **tudo** nas três frentes.

## Convenções

- `apps/*` + `packages/*`; scripts da raiz só delegam para `turbo run`.
- Libs compiladas com `tsup`; `antd`/`react`/`react-dom`/`@ant-design/icons` são
  externals (peerDependencies).
- Stories vivem em `apps/storybook/stories/**` (compartilhados) ou co-localizadas
  nos apps (`apps/<app>/src/**/*.stories.tsx`) — nunca dentro de `design-system`.
- Sem cor/spacing hardcoded — sempre via tokens.

## Status de implementação

Veja [`docs/ROADMAP.md`](./docs/ROADMAP.md) para o estado de cada fase do blueprint.
