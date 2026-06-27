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
pnpm gen                # gera um novo projeto na plataforma (turbo gen)
```

## Adicionar um novo projeto à plataforma

Para criar uma nova frente (app Next.js) já conectada ao core, use o gerador do
Turborepo em vez de copiar um app existente à mão:

```bash
pnpm gen                # equivale a `turbo gen`
```

No prompt:

1. Escolha o gerador **`app`**.
2. Informe o **nome** (pasta e package — minúsculas, números e hífens, ex.: `meu-app`).
3. Informe uma **descrição** curta (usada no `package.json` e no `metadata` da página).

O novo app é criado em `apps/<name>` já com:

- **Marca** — `@repo/brand-tokens` (CSS vars + temas) importada no layout.
- **Design-system** — `@repo/design-system` (fachada do Ant Design v5 + composições).
- **Tema com SSR** — `AntdRegistry` + `ThemeProvider` com o modo lido do cookie no
  servidor (sem flash de tema na primeira renderização).
- **Tooling** — `tsconfig`, ESLint e `next.config` herdados dos configs compartilhados
  (`@repo/typescript-config`, `@repo/eslint-config`).
- **CI** — por viver em `apps/*`, o app entra automaticamente nos pipelines do
  Turborepo (`build`, `lint`, `typecheck`, etc.).

> A porta padrão do novo app é `3003`; ajuste em `apps/<name>/package.json` se já
> estiver em uso por outra frente.

## Theming

A marca vive como tokens **DTCG** em `packages/brand-tokens/tokens/**.tokens.json`
(fonte única). Um build com Style Dictionary v4 deriva:

- `lightTheme` / `darkTheme` — objetos `ThemeConfig` do antd (componentes).
- CSS vars (`dist/brand.css`) — para os blocos de marketing (landing/site), fora do antd.

Trocar o `color.brand.primary` nos `.tokens.json` re-tematiza **tudo** nas três frentes.
O hand-off Figma → tokens está em [ADR-0003](./docs/adr/0003-figma-to-tokens-pipeline.md)
(`pnpm --filter @repo/brand-tokens tokens:import`).

## i18n

`next-intl` (sem segmento de locale na URL; locale via cookie) + `ConfigProvider.locale`
do antd, com mensagens e o mapa locale→antd em `@repo/i18n`. Ver
[ADR-0002](./docs/adr/0002-i18n-library.md).

## Convenções

- `apps/*` + `packages/*`; scripts da raiz só delegam para `turbo run`.
- Libs compiladas com `tsup`; `antd`/`react`/`react-dom`/`@ant-design/icons` são
  externals (peerDependencies).
- Stories vivem em `apps/storybook/stories/**` (compartilhados) ou co-localizadas
  nos apps (`apps/<app>/src/**/*.stories.tsx`) — nunca dentro de `design-system`.
- Sem cor/spacing hardcoded — sempre via tokens.

## Status de implementação

Veja [`docs/ROADMAP.md`](./docs/ROADMAP.md) para o estado de cada fase do blueprint.
