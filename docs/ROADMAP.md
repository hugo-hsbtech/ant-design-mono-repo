# Roadmap — fases do blueprint

Estado de implementação das fases descritas no PRD.

| Fase | Descrição | Estado |
|---|---|---|
| 0 | Bootstrap do monorepo (pnpm + Turborepo + TS + ESLint/Prettier + Changesets + CI) | ✅ |
| 1 | `brand-tokens` (source.ts → ThemeConfig light/dark + CSS vars) | ✅ |
| 2 | `design-system` (fachada antd + ThemeProvider + patterns + marketing) | ✅ |
| 3 | `apps/storybook` (Storybook 9 + nextjs-vite; foundations + catálogo) | ✅ Foundations + 49 primitivos antd + patterns + marketing. 265 testes de componente (render + interação + axe) verdes em Chromium real. |
| 4 | `apps/web` (Next.js + AntdRegistry + App do antd + tema SSR via cookie + providers) | ✅ AntdRegistry, ThemeProvider (App do antd), tema SSR via cookie sem flash, Auth.js (NextAuth v5, provider dev plugável), OrgContext/UserContext. |
| 5 | Shell (TopNav, Sidebar, AppSwitcher, OrgSwitcher, NotificationCenter, ThemeToggle) | ✅ AppShell + ProductBranding + AppSwitcher (waffle) + OrgSwitcher + NotificationCenter + UserMenu + ThemeToggle, todos catalogados em Storybook (Product/). |
| 6 | CRUD de exemplo + gestão de membros da org | ✅ Projetos (CRUD) + Membros (listar/convidar/papéis/remover, com guard de último owner) + Settings da org — tudo escopado por org via server actions com RBAC. |
| 7 | `apps/landing` + `apps/site` (blocos de marketing + layouts) | 🟡 Scaffolds que compõem os blocos de marketing; ambos buildam estáticos. |
| 8 | Hardening (cobertura de testes, E2E, a11y/axe, responsividade, CI/release) | 🟡 277 testes de componente (axe incluso) + 8 E2E Playwright (login → trocar org → CRUD → membros → tema; isolamento multi-tenant) + 11 testes unitários (RBAC/tenancy) + CI em camadas. Cobertura cresce. |

## Decisões em aberto (do PRD §11.1)

- **Antd v5 vs v6 + política de upgrade** — base atual fixada em v5 maduro.
- **Biblioteca de i18n** — `ConfigProvider.locale` cobre o antd; conteúdo dos apps
  pendente de escolha (next-intl vs i18next).
- **Figma kit / hand-off** — pipeline Figma → `source.ts` a definir.

## Notas de continuidade

- Auth.js (NextAuth v5) em `apps/web/src/lib/auth.ts` com provider Credentials de DEV
  sobre a camada mock (`src/lib/data.ts`). Plugar provider real (OAuth/SSO) — os call
  sites não mudam. Requer `AUTH_SECRET` em runtime (ver `.env.example`).
- RBAC: mapa `PERMISSION -> roles` em `apps/web/src/lib/rbac.ts`, validado no servidor
  (server actions / `requireOrgAccess`) — nunca só no middleware (ver CVE-2025-29927).
- Camada de dados mock (`src/lib/data.ts`) com `tenant_id` (orgId), persistida em
  `globalThis` (singleton entre bundles server — mesmo padrão do Prisma client);
  trocar por DB real mantendo as assinaturas. Testes provam isolamento cross-tenant + RBAC.
- **E2E (Playwright)** em `apps/web/e2e/`: o CI roda `playwright install` + `pnpm build`
  + `pnpm test:e2e`. Localmente, com Chromium pré-instalado:
  `cd apps/web && CHROMIUM_BIN=/caminho/chrome pnpm test:e2e` (após `pnpm build`).
  O `webServer` injeta um `AUTH_SECRET` de teste.
- A cobertura total do catálogo (60+ componentes antd) cresce seguindo a receita em
  `apps/storybook/stories/` (ver §6.3 do PRD: componente + story + teste + a11y + doc).
- **antd v5 + React 19:** o console emite um aviso de compatibilidade. Os apps devem
  aplicar `@ant-design/v5-patch-for-react-19` (a definir junto da decisão §11.1 sobre
  versão-base do antd). No catálogo é apenas um aviso — render/testes passam.
- **Storybook Test local:** o CI roda `playwright install` e o teste roda direto.
  Localmente, com um Chromium pré-instalado, use `CHROMIUM_BIN=/caminho/chrome
  pnpm --filter @repo/storybook test:storybook` (o `vitest.config.ts` lê esse env).
