# @repo/typescript-config

**Por que existe:** um único lugar para as opções de compilador do workspace. Sem ele,
cada app/pacote manteria seu próprio `tsconfig` e as opções derivariam com o tempo
(strictness diferente, targets diferentes). Aqui a decisão é tomada uma vez e herdada
por todos.

## Presets

| Arquivo              | Para quem                                    | O que define                                              |
| -------------------- | -------------------------------------------- | --------------------------------------------------------- |
| `base.json`          | Todos                                        | strict mode, module resolution, target — a fundação comum |
| `react-library.json` | `packages/*` com JSX (design-system, icons…) | base + JSX para bibliotecas compiladas com tsup           |
| `nextjs.json`        | `apps/*`                                     | base + plugin do Next.js, `noEmit` (o Next compila)       |

## Como usar

```jsonc
// packages/minha-lib/tsconfig.json
{
  "extends": "@repo/typescript-config/react-library.json",
  "include": ["src"]
}

// apps/meu-app/tsconfig.json
{
  "extends": "@repo/typescript-config/nextjs.json",
  "include": ["src", "next-env.d.ts"]
}
```

## Regra

Opção de compilador que vale para todo o workspace muda **aqui**, não no tsconfig
local. O tsconfig local só declara `include`/`paths` específicos do projeto.
