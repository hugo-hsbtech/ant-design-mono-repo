# @repo/icons

**Por que existe:** dá aos apps **uma única origem de ícones**. Re-exporta todo o
`@ant-design/icons` e acrescenta os ícones próprios da marca — assim nenhum app
precisa decidir "de onde importo este ícone", e um ícone do antd pode ser substituído
por uma versão da marca sem tocar nos consumidores.

## O que exporta

```ts
// Tudo do @ant-design/icons…
import { HomeOutlined, SettingFilled } from '@repo/icons';

// …mais os ícones próprios e o helper para criar novos:
import { WaffleIcon, createIcon, type IconProps } from '@repo/icons';
```

## Como criar um ícone próprio

1. Desenhe o SVG (viewBox 1024×1024, padrão antd) e crie o componente com o helper:

   ```tsx
   // src/MeuIcon.tsx
   import { createIcon } from './createIcon';

   export const MeuIcon = createIcon('MeuIcon', <svg viewBox="0 0 1024 1024">{/* paths */}</svg>);
   ```

   `createIcon` embrulha o SVG em `Icon` do `@ant-design/icons`, então o ícone herda
   tamanho/cor via `fontSize`/`color` como qualquer ícone do antd.

2. Exporte em `src/index.ts`.
3. Adicione uma story no catálogo (`apps/storybook/stories/**`).

## Build

`tsup` com config compartilhada (`@repo/tsup-config`); `react` e `@ant-design/icons`
são peers/externals — o app fornece o runtime.

```sh
pnpm --filter @repo/icons build
```
