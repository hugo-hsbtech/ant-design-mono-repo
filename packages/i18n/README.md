# @repo/i18n

**Por que existe:** centraliza tudo de internacionalização que precisa ser igual nas
três frentes (web, landing, site): a lista de locales suportados, as mensagens
traduzidas e o mapa locale → locale do antd. Sem este pacote, cada app duplicaria as
mensagens e o `ConfigProvider.locale` poderia divergir da UI traduzida.

## O que exporta

```ts
import {
  locales, // ['pt-BR', 'en'] as const
  type Locale,
  defaultLocale, // 'pt-BR'
  localeNames, // rótulos p/ language switcher: { 'pt-BR': 'Português', en: 'English' }
  isLocale, // type guard para valores vindos de cookie/header
  getMessages, // mensagens do next-intl (com fallback p/ default)
  antdLocale, // locale correspondente do antd ConfigProvider
} from '@repo/i18n';
```

As mensagens vivem em [`messages/`](./messages) (`pt-BR.json`, `en.json`) e são
publicadas junto com o pacote (`files: ["dist", "messages"]`).

## Como os apps usam

A estratégia (decidida no [ADR-0002](../../docs/adr/0002-i18n-library.md)) é
**next-intl sem segmento de locale na URL** — o locale vem de cookie:

1. `apps/<app>/src/i18n/request.ts` lê o cookie e chama `getMessages(locale)`.
2. O `providers.tsx` do app passa `antdLocale(locale)` para o `ConfigProvider` —
   assim os textos internos do antd (paginação, date picker…) seguem o mesmo idioma
   das mensagens.

## Como adicionar um idioma

1. Crie `messages/<locale>.json` (copie as chaves de `pt-BR.json`).
2. Em `src/index.ts`: adicione o locale em `locales`, `localeNames`, `MESSAGES`
   e `ANTD_LOCALES` (import do locale correspondente de `antd/locale/*`).
3. `pnpm --filter @repo/i18n build` — o TypeScript aponta qualquer mapa esquecido.

## Como adicionar uma mensagem

Adicione a chave em **todos** os arquivos de `messages/` (o tipo `Messages` é derivado
de `pt-BR.json`; chave faltando em outro idioma quebra o typecheck).
