# web — dashboard / SaaS

**Por que existe:** é a frente de **produto logado** da plataforma — o app de
dashboard/SaaS de referência. Demonstra (e serve de template para) tudo que um app de
produto precisa: autenticação, RBAC, contexto de organização, tema SSR sem flash,
i18n e as três camadas de teste.

Roda em **http://localhost:3000** (`make web` ou `pnpm --filter web dev`).

## O que tem dentro

```
src/
  app/
    layout.tsx, providers.tsx   AntdRegistry + ThemeProvider (modo via cookie, SSR)
    login/                      fluxo de login (Auth.js / NextAuth v5)
    api/auth/[...nextauth]/     rotas de auth
    [org]/                      área logada multi-org (members, settings)
  components/
    shell/                      composição do AppShell do design-system
    product/                    compostos específicos do produto
    ThemeToggle, LanguageSwitcher
  lib/
    auth.ts                     config do Auth.js
    rbac.ts                     papéis e permissões (com testes)
    org.ts, org-context.tsx     resolução e contexto da organização ativa
    data.ts                     camada de dados (mock/fixture, com testes)
  i18n/request.ts               locale via cookie → mensagens de @repo/i18n
e2e/                            Playwright — jornadas críticas
```

## Setup

Este é o único app que precisa de env:

```sh
make setup          # cria apps/web/.env.local com AUTH_SECRET gerado
```

Login de dev: sem senha, use um e-mail conhecido (ex.: `ada@plataforma.dev`) —
ver `.env.example`.

## Regras da plataforma que este app segue

- **UI só via `@repo/design-system`** — nunca `import ... from 'antd'`.
- **Ícones via `@repo/icons`**; tema/tokens via `@repo/brand-tokens` (importado no
  layout); textos via `next-intl` + `@repo/i18n`.
- Componentes reutilizáveis entre apps sobem para o `design-system`; o que é
  específico do produto fica em `src/components/product` (com stories co-localizadas,
  `*.stories.tsx`, que entram no catálogo central).

## Testes

```sh
pnpm --filter web test        # Vitest (rbac, data…)
pnpm --filter web test:e2e    # Playwright (jornadas críticas)
```
