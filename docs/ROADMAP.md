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
| 7 | `apps/landing` + `apps/site` (blocos de marketing + layouts) | 🟡 Scaffolds compondo os blocos de marketing; i18n (next-intl) ligado. Nota: o locale por cookie torna as páginas dinâmicas — ver trade-off em ADR-0002 se a estática for prioridade. |
| 8 | Hardening (cobertura de testes, E2E, a11y/axe, responsividade, CI/release) | 🟡 277 testes de componente (axe incluso) + 8 E2E Playwright (login → trocar org → CRUD → membros → tema; isolamento multi-tenant) + 11 testes unitários (RBAC/tenancy) + CI em camadas. Cobertura cresce. |

## Decisões do PRD §11.1 — agora formalizadas (ver [docs/adr](./adr/))

- **Antd v5 vs v6 + política de upgrade** → [ADR-0001](./adr/0001-antd-version-and-upgrade-policy.md):
  base em v5, upgrade de major atrás da fachada, validado por catálogo + E2E.
- **Biblioteca de i18n** → [ADR-0002](./adr/0002-i18n-library.md): **next-intl** (sem
  segmento de locale; cookie), `@repo/i18n` compartilhado, antd `ConfigProvider.locale`
  ligado. Wired em web/landing/site; LanguageSwitcher + login traduzidos (demais strings
  incrementais).
- **Figma kit / hand-off** → [ADR-0003](./adr/0003-figma-to-tokens-pipeline.md): Figma →
  DTCG → `tokens:import` → build; os `.tokens.json` são a fonte única.

## Outros itens entregues

- **Gerador de projeto (E2-S3):** `pnpm gen` (turbo gen) cria um app on-brand em
  `apps/<name>` — verificado (app gerado typecheck-a).
- **Acessibilidade/responsividade (E9-S2):** auditoria + plano manual em
  [docs/accessibility.md](./accessibility.md) + 2 E2E de teclado.

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
