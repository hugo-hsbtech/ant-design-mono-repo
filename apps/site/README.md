# site — site institucional

**Por que existe:** é a frente **institucional** (empresa, conteúdo, páginas
permanentes). Separado da `landing` porque o conteúdo institucional evolui em ritmo
próprio e tende a crescer em número de páginas — mas compartilha a mesma fundação:
blocos de marketing e tokens do core, garantindo identidade única com o resto da
plataforma.

Roda em **http://localhost:3002** (`make site` ou `pnpm --filter site dev`).

## Estrutura

```
src/
  app/
    layout.tsx      importa brand.css + AntdRegistry + ThemeProvider (SSR, sem flash)
    page.tsx        páginas compostas com blocos de @repo/design-system (marketing/)
    providers.tsx   ConfigProvider (tema + locale antd)
  i18n/request.ts   locale via cookie → mensagens de @repo/i18n
```

É intencionalmente gêmeo da `landing` em arquitetura — a diferença é o propósito do
conteúdo, não a stack. Se você sabe montar uma página na landing, sabe montar aqui.

## Regras

- Blocos reutilizáveis nascem em `packages/design-system/src/marketing`, nunca aqui.
- Sem cor/spacing hardcoded — CSS vars `--brand-*` / tokens.
- Textos via `next-intl` (`@repo/i18n`).
