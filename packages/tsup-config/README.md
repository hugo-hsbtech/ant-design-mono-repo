# @repo/tsup-config

**Por que existe:** todas as bibliotecas do workspace (`design-system`, `brand-tokens`,
`icons`, `utils`, `i18n`) precisam ser compiladas do mesmo jeito — ESM + CJS, `.d.ts`,
sourcemaps e, principalmente, **os mesmos externals**. Este pacote define isso uma vez.

## O ponto crítico: externals

`react`, `react-dom`, `antd`, `@ant-design/icons` e `@ant-design/cssinjs` são
**externals**: nunca são embutidos no bundle das libs. O app é quem fornece a única
cópia do runtime (evitando React duplicado e CSS-in-JS quebrado) e transpila os
pacotes via `transpilePackages` no `next.config`. Por isso essas libs declaram
`antd`/`react` como `peerDependencies`.

## Como usar

```ts
// tsup.config.ts de uma lib
import { createConfig } from '@repo/tsup-config';

export default createConfig({
  entry: ['src/index.ts'],
  // overrides locais se necessário
});
```

Defaults do `createConfig`: `format: ['esm', 'cjs']`, `dts: true`, `sourcemap: true`,
`clean: true`, `treeshake: true` + a lista de externals acima.

## Regra

Nova lib no workspace? Use `createConfig` — não escreva config do tsup do zero. Se a
lib precisa de um external novo que outras também vão precisar, adicione **aqui**.
