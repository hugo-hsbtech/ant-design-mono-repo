# Plataforma de UI — Ant Design v5

Monorepo de UI reutilizável construído **sobre o Ant Design v5**, com identidade de
marca unificada nas três frentes:

- **Dashboards / SaaS** (`apps/web`)
- **Landing pages** (`apps/landing`)
- **Sites institucionais** (`apps/site`)

A marca (cor primária, tipografia, raios, spacing) é definida **uma vez** em design
tokens (`packages/brand-tokens`) e aplicada em tudo via `ConfigProvider` do Ant Design
e CSS vars. Trocar um token re-tematiza as três frentes.

## Filosofia

Três camadas, cada uma com uma regra:

1. **Fundação — dependemos do `antd`.** Não recriamos componentes de baixo nível;
   herdamos as atualizações da biblioteca. A política de versão está no
   [ADR-0001](./docs/adr/0001-antd-version-and-upgrade-policy.md).
2. **Por cima — componentes próprios.** Patterns de produto (AppShell, DataTable…) e
   blocos de marketing (Hero, Pricing…) construídos sobre os componentes e tokens do
   antd.
3. **Fachada — apps nunca importam `antd` direto.** Toda UI vem de
   `@repo/design-system`, o ponto único de evolução (trocar defaults, adicionar
   wrappers, pinar comportamento) sem tocar nos apps.

## Mapa do monorepo

Cada workspace tem um README explicando **por que existe** e como usá-lo:

### Apps (`apps/*`)

| App                                       | Porta | Por que existe                                                                                    |
| ----------------------------------------- | ----- | ------------------------------------------------------------------------------------------------- |
| [`web`](./apps/web/README.md)             | 3000  | Frente de **produto logado** (SaaS): auth, RBAC, multi-org, referência para novos apps de produto |
| [`landing`](./apps/landing/README.md)     | 3001  | Frente de **aquisição**: landing page composta pelos blocos de marketing do core                  |
| [`site`](./apps/site/README.md)           | 3002  | Frente **institucional**: mesmo arcabouço da landing, conteúdo permanente                         |
| [`storybook`](./apps/storybook/README.md) | 6006  | **Catálogo central** + testes de componente + gate de acessibilidade                              |

### Bibliotecas de UI (`packages/*`)

| Pacote                                                      | Por que existe                                                                                                                   |
| ----------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------- |
| [`@repo/brand-tokens`](./packages/brand-tokens/README.md)   | **Fonte única da marca**: tokens DTCG (`tokens/**.tokens.json`) → `ThemeConfig` light/dark do antd + CSS vars (`dist/brand.css`) |
| [`@repo/design-system`](./packages/design-system/README.md) | **Fachada única de UI**: re-exporta o antd + patterns próprios + blocos de marketing + `ThemeProvider`                           |
| [`@repo/icons`](./packages/icons/README.md)                 | **Fonte única de ícones**: `@ant-design/icons` + ícones da marca                                                                 |
| [`@repo/i18n`](./packages/i18n/README.md)                   | Locales, mensagens e o mapa locale→antd compartilhados pelas três frentes                                                        |
| [`@repo/utils`](./packages/utils/README.md)                 | Helpers pequenos sem framework (`cx`, `slugify`, `initials`…) usados por mais de um workspace                                    |

### Tooling compartilhado (`packages/*`)

| Pacote                                                              | Por que existe                                                                                                |
| ------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------- |
| [`@repo/typescript-config`](./packages/typescript-config/README.md) | Presets de `tsconfig` (`base`, `react-library`, `nextjs`) — opções de compilador decididas uma vez            |
| [`@repo/eslint-config`](./packages/eslint-config/README.md)         | Flat configs do ESLint (`base`, `react`, `next`) — inclui as regras que protegem as fronteiras da arquitetura |
| [`@repo/test-config`](./packages/test-config/README.md)             | Bases de Vitest e Playwright — mesmo setup de teste em todo workspace                                         |
| [`@repo/tsup-config`](./packages/tsup-config/README.md)             | Build comum das libs (ESM+CJS, dts, **externals**: react/antd nunca vão para o bundle)                        |

### Como as peças se conectam

```
brand-tokens ──► design-system ──► apps (web, landing, site)
   (tokens)        (fachada +          │
                    patterns +         └─► storybook (catálogo de tudo)
icons ──────────►   marketing)
utils ──────────►
i18n ───────────────────────────────► apps (mensagens + locale antd)

typescript-config / eslint-config / test-config / tsup-config ──► todos
```

## Stack

pnpm workspaces · Turborepo · TypeScript · Ant Design v5 · Next.js 15 (App Router) ·
Storybook 10 (`nextjs-vite`) · Vitest · Playwright · nx release.

## Começando (novo engenheiro)

```bash
make setup       # pnpm install + apps/web/.env.local (AUTH_SECRET) + build dos packages
make web         # produto em :3000 (login dev sem senha: ada@plataforma.dev)
make landing     # :3001
make site        # :3002
make storybook   # :6006
```

> Cada serviço roda em um terminal próprio de propósito — rodar tudo junto
> (`make dev-all`) é pesado em memória. Os apps consomem o `dist/` pré-buildado dos
> packages; ao editar um package, rode `make watch-packages PKG=<nome>`.
> `make help` lista todos os alvos.

Comandos raiz (delegam para `turbo run`):

```bash
pnpm build | lint | typecheck | test   # gates de qualidade
pnpm test:storybook                    # testes de componente (Storybook Test)
pnpm test:e2e                          # E2E (Playwright, apps/web)
pnpm build:storybook                   # catálogo estático
pnpm release:dry                       # prévia (dry-run) do próximo release por pacote
pnpm gen                               # scaffolding de novo app (turbo gen)
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
> estiver em uso por outra frente. Os templates vivem em `turbo/generators/templates`.

Depois do scaffold, o fluxo típico de desenvolvimento é:

1. Monte páginas **compondo** o que já existe em `@repo/design-system`.
2. Componente reutilizável novo? Nasce no `design-system` (pattern ou marketing),
   com story no catálogo — ver o
   [definition of done](./apps/storybook/stories/README.md).
3. Componente específico do app? Fica em `apps/<name>/src/components`, com story
   co-localizada (`*.stories.tsx` — entra no catálogo automaticamente).
4. Nada de cor/spacing hardcoded, nada de `import ... from 'antd'`.

## Theming

A marca vive como tokens **DTCG** em `packages/brand-tokens/tokens/**.tokens.json`
(fonte única — não existe `source.ts`). Um build com Style Dictionary v4 deriva:

- `lightTheme` / `darkTheme` — objetos `ThemeConfig` do antd (componentes).
- CSS vars (`dist/brand.css`) — para os blocos de marketing (landing/site), fora do antd.

Trocar o `color.brand.primary` nos `.tokens.json` re-tematiza **tudo** nas três frentes.
O hand-off Figma → tokens está em [ADR-0003](./docs/adr/0003-figma-to-tokens-pipeline.md)
(`pnpm --filter @repo/brand-tokens tokens:import`) e detalhado no
[README do pacote](./packages/brand-tokens/README.md).

## i18n

`next-intl` (sem segmento de locale na URL; locale via cookie) + `ConfigProvider.locale`
do antd, com mensagens e o mapa locale→antd em
[`@repo/i18n`](./packages/i18n/README.md). Ver [ADR-0002](./docs/adr/0002-i18n-library.md).

## Convenções

- `apps/*` + `packages/*`; scripts da raiz só delegam para `turbo run`.
- Apps importam UI **somente** de `@repo/design-system`; ícones de `@repo/icons`.
- Libs compiladas com `tsup` (`@repo/tsup-config`); `antd`/`react`/`react-dom`/
  `@ant-design/icons` são externals (peerDependencies) — o app fornece o runtime.
- Stories vivem em `apps/storybook/stories/**` (compartilhadas) ou co-localizadas
  nos apps (`apps/<app>/src/**/*.stories.tsx`) — nunca dentro de `design-system`.
- Sem cor/spacing hardcoded — sempre via tokens.
- Commits convencionais (commitlint + husky); releases por pacote com `nx release`
  (ver [Versionamento e Releases](#versionamento-e-releases)).

## Versionamento e Releases

Cada projeto do workspace (`apps/*` + `packages/*`) é versionado de forma
**independente**, a partir dos **Conventional Commits** (já validados pelo commitlint).
O motor é o `nx release` — o Turborepo continua sendo o runner de build/testes; o Nx
entra **apenas** para releases (config em `nx.json`).

- **Automático no merge para `main`:** o workflow `.github/workflows/release.yml` roda
  `nx release`, que calcula o bump de cada projeto, atualiza `package.json` + `CHANGELOG.md`,
  cria a tag `<projeto>@<versão>` e publica um GitHub Release. Projetos sem commits
  relevantes são ignorados. Não há publicação em npm (todos os pacotes são `private`).
- **Prévia local:** `pnpm release:dry` (`nx release --dry-run`) mostra os bumps, changelogs
  e tags que seriam gerados, sem alterar nada.
- **Bump abaixo de `1.0.0`:** enquanto o major for `0`, o Nx aplica a regra de
  pré-lançamento — um `feat` incrementa o rank de _patch_ (ex.: `0.1.0 → 0.1.1`) e um
  breaking change incrementa o _minor_. Depois de `1.0.0`, vale o semver padrão
  (`feat`→minor, `fix`/`perf`→patch, `!`/`BREAKING CHANGE`→major).
- **Dependências internas:** ao subir uma lib (ex.: `@repo/utils`), os consumidores
  (`@repo/design-system` e os apps) recebem um bump de _patch_ automaticamente.

### Bootstrap do primeiro release (uma vez)

Como ainda não existem tags `<projeto>@<versão>`, o **primeiro** release precisa ser
rodado uma única vez com `--first-release`, por um mantenedor com permissão de push em
`main` (ou via execução manual do workflow):

```bash
pnpm nx release --first-release
```

A partir daí, as tags-base existem e o workflow segue com o comando padrão a cada merge.

> **Proteção de branch:** se `main` for protegida, o push de volta feito pelo workflow
> será bloqueado. Nesse caso, forneça um PAT/GitHub App token com bypass ou troque o
> fluxo para abrir um _release PR_. Documentado aqui, não resolvido no workflow atual.

## Documentação

- [`docs/ROADMAP.md`](./docs/ROADMAP.md) — estado de cada fase do blueprint.
- [`docs/adr/`](./docs/adr) — decisões de arquitetura (versão do antd, i18n,
  pipeline Figma→tokens).
- [`docs/accessibility.md`](./docs/accessibility.md) — auditoria e gates de a11y.
