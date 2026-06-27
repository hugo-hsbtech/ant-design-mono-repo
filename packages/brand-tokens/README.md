# @repo/brand-tokens

Design tokens for the platform's Ant Design theme. The W3C **DTCG** (`.tokens.json`)
files under [`tokens/`](./tokens) are the **single source of truth**. From them the
build generates an antd `ThemeConfig` (light + dark) and a CSS custom-properties file.

> There is no `source.ts`. Do not hand-author the generated TypeScript — edit the
> DTCG files (or re-import from Figma) and rebuild.

## Layout

```
tokens/
  base/    color, typography, radius, spacing, motion, elevation, components
  modes/   light.tokens.json, dark.tokens.json   (mode overrides)
figma/
  figma.tokens.json   sample Figma export (DTCG) used by the importer
scripts/
  import-figma-tokens.mjs   Figma export -> tokens/base/*
  build-tokens.mjs          tokens/* -> src/__generated__/* + dist/brand.css
```

## The antd mapping lives in `$extensions`

A token is wired to an antd theme key via its DTCG `$extensions` block:

```json
"primary": {
  "$value": "#0066CC",
  "$extensions": { "com.plataforma.antd": { "token": "colorPrimary" } }
}
```

- `{ "token": "colorPrimary" }` -> global `theme.token.colorPrimary`
- `{ "component": "Button", "token": "..." }` -> `theme.components.Button.*`

Tokens without this extension still emit a `--brand-*` CSS variable but do not
feed the antd `ThemeConfig`. `scripts/build-tokens.mjs` is the only consumer of
`$extensions`.

## Round-trip: Figma -> tokens -> theme

1. **Export from Figma.** In **Figma Variables** (or **Tokens Studio**) export the
   brand variables as a W3C DTCG JSON. Save it to `figma/figma.tokens.json`
   (the default path) or anywhere and pass the path explicitly.

2. **Import** — refresh the DTCG source from the export:

   ```sh
   pnpm --filter @repo/brand-tokens tokens:import
   # or with an explicit path:
   pnpm --filter @repo/brand-tokens tokens:import ./path/to/export.tokens.json
   ```

   The importer:
   - Validates the input is a DTCG object and every leaf has a `$value`.
   - Routes each top-level group to a file: `color.*` -> `color.tokens.json`,
     `font.*` -> `typography.tokens.json`, `radius.*` -> `radius.tokens.json`,
     `space.*` -> `spacing.tokens.json`, and any unknown group ->
     `tokens/base/<group>.tokens.json`.
   - **Merges non-destructively:** existing tokens not present in the export are
     left untouched. For tokens that are present, it updates `$value` (and
     `$description`/`$type` when the export provides them).
   - **Preserves the antd mapping:** if the export omits `$extensions` for a token
     we already map, our `$extensions["com.plataforma.antd"]` is kept. Re-importing
     brand values from Figma therefore never drops the antd wiring.
   - Is idempotent — safe to run repeatedly.

3. **Build** — regenerate the antd `ThemeConfig` and CSS vars:

   ```sh
   pnpm --filter @repo/brand-tokens build
   ```

   This produces `src/__generated__/theme.light.ts`, `theme.dark.ts`, `tokens.ts`,
   and `dist/brand.css`.

## Adding a new mapped token

When a brand value should drive an antd theme key, add the `$extensions` block in
the DTCG file (Figma exports won't include it). Once present, the importer
preserves it across future imports.
