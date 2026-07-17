# @repo/eslint-config

**Por que existe:** as regras de lint são uma decisão da plataforma, não de cada app.
Este pacote publica as _flat configs_ (ESLint 9) que todos os workspaces estendem —
incluindo as regras que protegem as fronteiras da arquitetura (ex.: apps não devem
importar `antd` direto, e sim `@repo/design-system`).

## Presets

| Export                      | Para quem                                | Conteúdo                                      |
| --------------------------- | ---------------------------------------- | --------------------------------------------- |
| `@repo/eslint-config/base`  | Pacotes sem React (utils, tokens)        | `@eslint/js` + `typescript-eslint` + Prettier |
| `@repo/eslint-config/react` | Bibliotecas React (design-system, icons) | base + `eslint-plugin-react` + `react-hooks`  |
| `@repo/eslint-config/next`  | `apps/*`                                 | react + regras de Next.js + Storybook         |

## Como usar

```js
// eslint.config.js de um app
import next from '@repo/eslint-config/next';

export default [...next];
```

```js
// eslint.config.js de uma lib React
import react from '@repo/eslint-config/react';

export default [...react];
```

## Regra

Regra nova que vale para todos entra **aqui**. O `eslint.config.js` local serve só
para ignores e exceções pontuais do projeto — se você está copiando a mesma regra
para um segundo app, é sinal de que ela pertence a este pacote.
