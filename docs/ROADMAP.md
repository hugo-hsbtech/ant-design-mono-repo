# Roadmap — fases do blueprint

Estado de implementação das fases descritas no PRD.

| Fase | Descrição | Estado |
|---|---|---|
| 0 | Bootstrap do monorepo (pnpm + Turborepo + TS + ESLint/Prettier + Changesets + CI) | ✅ |
| 1 | `brand-tokens` (source.ts → ThemeConfig light/dark + CSS vars) | ✅ |
| 2 | `design-system` (fachada antd + ThemeProvider + patterns + marketing) | ✅ |
| 3 | `apps/storybook` (Storybook 9 + nextjs-vite; foundations + catálogo) | ✅ Foundations + 49 primitivos antd + patterns + marketing. 265 testes de componente (render + interação + axe) verdes em Chromium real. |
| 4 | `apps/web` (Next.js + AntdRegistry + App do antd + tema SSR via cookie + providers) | 🟡 Scaffold mínimo: AntdRegistry, ThemeProvider (App do antd), tema SSR via cookie sem flash. Auth/multi-tenant/RBAC pendentes (fora do escopo desta sessão — E1–E3). Build de produção verde. |
| 5 | Shell (TopNav, Sidebar, AppSwitcher, OrgSwitcher, NotificationCenter, ThemeToggle) | 🟡 AppShell + Menu lateral + UserMenu (dropdown) + ThemeToggle presentes. AppSwitcher/OrgSwitcher/NotificationCenter pendentes. |
| 6 | CRUD de exemplo + gestão de membros da org | 🟡 CRUD de exemplo (Projetos) no dashboard via DataTable + FormModal + Popconfirm. Membros/org settings pendentes. |
| 7 | `apps/landing` + `apps/site` (blocos de marketing + layouts) | 🟡 Scaffolds que compõem os blocos de marketing; ambos buildam estáticos. |
| 8 | Hardening (cobertura de testes, E2E, a11y/axe, responsividade, CI/release) | 🟡 Bases prontas: 266 testes de componente (axe incluso) + CI em camadas. E2E Playwright pendente. |

## Decisões em aberto (do PRD §11.1)

- **Antd v5 vs v6 + política de upgrade** — base atual fixada em v5 maduro.
- **Biblioteca de i18n** — `ConfigProvider.locale` cobre o antd; conteúdo dos apps
  pendente de escolha (next-intl vs i18next).
- **Figma kit / hand-off** — pipeline Figma → `source.ts` a definir.

## Notas de continuidade

- Auth.js está como abstração/stub em `apps/web/src/lib/auth` — plugar provider real.
- RBAC: mapa `PERMISSION -> roles` em `apps/web/src/lib/rbac`; validar sempre no servidor
  (ver CVE-2025-29927 — não confiar só no middleware).
- A cobertura total do catálogo (60+ componentes antd) cresce seguindo a receita em
  `apps/storybook/stories/` (ver §6.3 do PRD: componente + story + teste + a11y + doc).
- **antd v5 + React 19:** o console emite um aviso de compatibilidade. Os apps devem
  aplicar `@ant-design/v5-patch-for-react-19` (a definir junto da decisão §11.1 sobre
  versão-base do antd). No catálogo é apenas um aviso — render/testes passam.
- **Storybook Test local:** o CI roda `playwright install` e o teste roda direto.
  Localmente, com um Chromium pré-instalado, use `CHROMIUM_BIN=/caminho/chrome
  pnpm --filter @repo/storybook test:storybook` (o `vitest.config.ts` lê esse env).
