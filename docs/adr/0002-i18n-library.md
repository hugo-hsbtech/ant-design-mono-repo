# ADR-0002 — Biblioteca de i18n: next-intl

- **Status:** Aceito
- **Contexto do PRD:** §8 / §11.1 (decisão em aberto: "Biblioteca de i18n — next-intl vs i18next")

## Contexto

`ConfigProvider.locale` do antd cobre os textos **internos** dos componentes
(DatePicker, Pagination, Table etc.), mas o **conteúdo dos apps** precisa de uma lib
de i18n. O dashboard usa rotas dinâmicas `/[org]/...`; uma estratégia de i18n com
segmento de locale (`/[locale]/[org]/...`) acrescentaria complexidade e colidiria com
o roteamento por organização.

## Decisão

Adotar **next-intl**, na configuração **"without i18n routing"** (sem segmento de
locale na URL):

1. O locale é resolvido por **cookie** (`locale`), lido no servidor em
   `src/i18n/request.ts` via `getRequestConfig` — sem middleware de roteamento e sem
   conflito com `/[org]`.
2. Um package compartilhado **`@repo/i18n`** centraliza: lista de locales, default,
   carregamento de mensagens (`messages/<locale>.json`) e o mapa **locale → antd
   `Locale`** (`antd/locale/*`).
3. O `ThemeProvider` recebe o `locale` do antd (via `useLocale()` + `antdLocale()`),
   unindo a i18n do conteúdo (next-intl) à dos componentes (antd) num só lugar.
4. RTL acompanha o locale quando necessário (antd suporta `direction="rtl"`).

### Por que next-intl (e não i18next)

- Integração **first-class com o App Router** (Server Components, `getTranslations`
  no servidor, `useTranslations` no cliente) sem boilerplate de provider duplicado.
- Mensagens type-safe e divisão por namespace simples.
- Funciona sem segmento de locale, preservando `/[org]` intacto.

## Consequências

- **+** Conteúdo e componentes compartilham um único locale; troca via cookie +
  `router.refresh()`.
- **+** `@repo/i18n` é reutilizável pelas três frentes (web/landing/site).
- **−** Sem locale na URL: SEO multilíngue por idioma exige estratégia adicional
  (ex.: domínios/headers) se/quando o site institucional precisar — reavaliar então.
- **−** Ler o cookie no servidor torna as páginas **dinâmicas** (SSR sob demanda).
  Para `apps/web` (logado) isso é esperado. Para `landing`/`site` (§7.2 — estáticas/
  performáticas) é um trade-off: se a estática for prioridade, fixar o locale default
  em build (sem ler cookie) e oferecer só troca client-side. Reavaliar por frente.
- **−** Traduzir todo o conteúdo é incremental; a infra entra agora, as strings migram
  superfície a superfície.
