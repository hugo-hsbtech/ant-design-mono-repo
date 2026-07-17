# landing — landing page

**Por que existe:** é a frente de **aquisição** — a landing page de marketing.
Existe separada do `site` e do `web` porque tem ciclo de vida próprio (campanhas,
A/B, deploy independente) mas precisa da **mesma marca**: ela consome os mesmos
tokens e blocos de marketing do core, então mudar a marca re-tematiza a landing
junto com todo o resto.

Roda em **http://localhost:3001** (`make landing` ou `pnpm --filter landing dev`).

## Como é construída

A página é **composição de blocos** do `@repo/design-system` (camada `marketing/`):
`Hero`, `Features`, `Pricing`, `Testimonials`, `FAQ`, `CTA`, `Footer`, `Section` —
estilizados via CSS vars da marca (`@repo/brand-tokens/css`), que funcionam também
fora dos componentes antd.

```
src/
  app/
    layout.tsx      importa brand.css + AntdRegistry + ThemeProvider (SSR, sem flash)
    page.tsx        composição dos blocos de marketing
    providers.tsx   ConfigProvider (tema + locale antd)
  i18n/request.ts   locale via cookie → mensagens de @repo/i18n
```

## Regras

- **Nenhum bloco novo nasce aqui.** Bloco de marketing reutilizável nasce em
  `packages/design-system/src/marketing` (com story no catálogo) e a landing só
  compõe. O app deve permanecer fino: páginas + conteúdo.
- Sem cor/spacing hardcoded — use as CSS vars `--brand-*`.
- Textos via `next-intl` (`@repo/i18n`), nunca string solta.
