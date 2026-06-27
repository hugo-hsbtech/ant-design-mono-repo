# ADR-0003 — Pipeline Figma → design tokens

- **Status:** Aceito
- **Contexto do PRD:** §11.1 (decisão em aberto: "Figma kit / hand-off de design")

## Contexto

A marca precisa fluir do design (Figma) para o código sem drift. Já temos a fonte
única em **DTCG** (`packages/brand-tokens/tokens/**.tokens.json`), construída por
Style Dictionary v4 em `ThemeConfig` (antd) + CSS vars.

## Decisão

Pipeline **Figma → DTCG → build**, com os arquivos DTCG como **única fonte da verdade**:

1. **Export do Figma:** Figma Variables (export nativo de variáveis) ou o plugin
   *Tokens Studio* exportam um JSON no formato **DTCG** (`$value`/`$type`).
2. **Import:** `pnpm --filter @repo/brand-tokens tokens:import [arquivo]`
   (`scripts/import-figma-tokens.mjs`) normaliza o export para a estrutura de
   `tokens/base/*` e **preserva** o mapeamento antd existente
   (`$extensions["com.plataforma.antd"]`) quando o token já existe — o Figma fornece
   valores de marca; a ligação com o antd é mantida no repositório.
3. **Build:** `pnpm --filter @repo/brand-tokens build` regenera `theme.light/dark.ts`
   + `brand.css`. Tudo se re-tematiza nas três frentes.

`source.ts` **não** é usado (legado do PRD §3); a fonte é o conjunto DTCG.

## Consequências

- **+** Designers alteram variáveis no Figma; um comando traz os valores para o código.
- **+** O mapeamento técnico (token → `colorPrimary` etc.) vive no repo, fora do alcance
  de edições de design — sem quebrar a ligação com o antd.
- **+** Round-trip versionado e revisável em PR (diff dos `.tokens.json`).
- **−** O import assume export DTCG; coleções/aliases específicos do Figma podem exigir
  ajuste do normalizador.
- **Futuro:** automação via Figma REST API (CI) é possível, mas exige token de acesso —
  fora do escopo atual; o import por arquivo cobre o hand-off hoje.
