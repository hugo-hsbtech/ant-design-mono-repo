# Roadmap — fases do blueprint

Estado de implementação das fases descritas no PRD.

| Fase | Descrição | Estado |
|---|---|---|
| 0 | Bootstrap do monorepo (pnpm + Turborepo + TS + ESLint/Prettier + Changesets + CI) | ✅ |
| 1 | `brand-tokens` (source.ts → ThemeConfig light/dark + CSS vars) | ✅ |
| 2 | `design-system` (fachada antd + ThemeProvider + patterns + marketing) | ✅ |
| 3 | `apps/storybook` (Storybook 9 + nextjs-vite; foundations + catálogo) | ✅ (foundations + catálogo representativo; cobertura cresce incrementalmente) |
| 4 | `apps/web` (Next.js + AntdRegistry + App do antd + tema SSR via cookie + providers) | ✅ (shell + providers; Auth.js como stub plugável) |
| 5 | Shell (TopNav, Sidebar, AppSwitcher, OrgSwitcher, NotificationCenter, ThemeToggle) | ✅ |
| 6 | CRUD de exemplo + gestão de membros da org | 🚧 CRUD de exemplo presente; membros parcial |
| 7 | `apps/landing` + `apps/site` (blocos de marketing + layouts) | ✅ scaffold + blocos |
| 8 | Hardening (cobertura de testes, E2E, a11y/axe, responsividade, CI/release) | 🚧 bases configuradas; cobertura cresce |

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
