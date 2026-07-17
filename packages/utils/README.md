# @repo/utils

**Por que existe:** helpers pequenos e sem dependência de framework que mais de um
app/pacote precisa. Extraí-los para cá evita utilitários duplicados (e sutilmente
diferentes) espalhados pelos apps. É intencionalmente minúsculo — só entra aqui o que
já provou ser compartilhado.

## O que exporta

| Helper               | Uso                                                        |
| -------------------- | ---------------------------------------------------------- |
| `cx(...parts)`       | Junta classes CSS ignorando falsy — `cx('a', cond && 'b')` |
| `isServer`           | `true` quando rodando no servidor (guard de SSR)           |
| `range(n)`           | `[0, 1, …, n-1]` — listas de skeleton, grids de demo       |
| `clamp(v, min, max)` | Limita número ao intervalo                                 |
| `initials(name)`     | Iniciais (máx. 2) para `Avatar`                            |
| `slugify(str)`       | Slug para URLs/segmentos de org (remove acentos)           |

## Regras de admissão

- **Zero dependências** de runtime (nem `react`, nem `antd`). Helper que precisa de
  React vira hook no `@repo/design-system`; helper de tema vai para
  `@repo/brand-tokens`.
- Cada função nova entra com **teste** em `src/index.test.ts` (Vitest).
- Se só um app usa, mantenha no app (`src/lib/`) até um segundo consumidor aparecer.

```sh
pnpm --filter @repo/utils test
pnpm --filter @repo/utils build
```
