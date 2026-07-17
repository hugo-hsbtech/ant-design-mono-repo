# @repo/design-system

**Por que existe:** é a **fachada única de UI** da plataforma. Os apps nunca importam
`antd` diretamente — importam tudo daqui. Isso dá um ponto único para trocar defaults,
adicionar wrappers, fixar comportamento ou até substituir a biblioteca de base no
futuro, sem tocar nos apps.

## O que exporta

| Camada         | Conteúdo                                                                                                               | Fonte            |
| -------------- | ---------------------------------------------------------------------------------------------------------------------- | ---------------- |
| **Primitives** | Toda a superfície do `antd` re-exportada (`Button`, `Table`, `Form`…)                                                  | `src/components` |
| **Patterns**   | Compostos próprios de produto: `AppShell`, `DataTable`, `PageHeader`, `FormModal`, `FormDrawer`, `EmptyState`, `Stack` | `src/patterns`   |
| **Marketing**  | Blocos de landing/site: `Hero`, `Features`, `Pricing`, `Testimonials`, `FAQ`, `CTA`, `Footer`, `Section`               | `src/marketing`  |
| **Theming**    | `ThemeProvider` (modo light/dark com cookie + SSR), `useThemeMode`                                                     | `src/providers`  |
| **Hooks**      | `useBreakpoint` (re-export do `Grid.useBreakpoint`)                                                                    | `src/hooks`      |
| **Tokens**     | `lightTheme`, `darkTheme`, `themes`, `themeFor`, `tokens`, `brandCssPath` re-exportados de `@repo/brand-tokens`        | —                |

## Como usar num app

```tsx
// Nunca: import { Button } from 'antd'
import { Button, PageHeader, ThemeProvider } from '@repo/design-system';
```

A regra "sem `antd` direto" vale para todos os `apps/*`. O ESLint compartilhado e o
code review guardam essa fronteira.

## Como estender

- **Wrapper/override de um primitive:** crie o componente em `src/components` e
  exporte-o **antes** do `export * from 'antd'` ser resolvido (export nomeado ganha).
- **Novo pattern (produto):** `src/patterns/MeuPattern.tsx` + export em
  `src/patterns/index.ts`.
- **Novo bloco de marketing:** `src/marketing/MeuBloco.tsx` + export no index.
- **Story obrigatória:** todo componente novo precisa de story no catálogo
  (`apps/storybook/stories/**`) — ver o
  [definition of done](../../apps/storybook/stories/README.md). Stories **não**
  vivem dentro deste pacote.
- **Sem cor/spacing hardcoded:** use os tokens do tema (`theme.useToken()` do antd
  ou CSS vars de `@repo/brand-tokens`).

## Build

Compilado com `tsup` (config compartilhada em `@repo/tsup-config`). `antd`, `react`,
`react-dom` e `@ant-design/icons` são `peerDependencies`/externals — o app fornece a
única cópia do runtime e transpila este pacote via `transpilePackages` no
`next.config`.

```sh
pnpm --filter @repo/design-system build   # gera dist/
pnpm --filter @repo/design-system dev     # tsup --watch
pnpm --filter @repo/design-system test    # Vitest
```
