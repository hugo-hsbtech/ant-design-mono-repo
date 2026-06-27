# ADR-0001 — Ant Design v5 como base e política de upgrade (v5 → v6)

- **Status:** Aceito
- **Contexto do PRD:** §11.1 (decisão em aberto: "Ant Design v5 vs v6 + política de upgrade")

## Contexto

"Herdar atualizações" do Ant Design é o argumento central da plataforma. Precisamos
fixar a versão-base e o ritmo de adoção de majors, equilibrando estabilidade
(produção) com o ganho do v6 (notadamente `zeroRuntime` / melhor performance de
CSS-in-JS).

No momento da decisão, o v5 é maduro e amplamente suportado; o v6 ainda está em
estabilização.

## Decisão

1. **Base atual: Ant Design v5** (pinado por minor no `peerDependencies` da fachada
   `@repo/design-system` e nas devDependencies dos apps).
2. **Ponto único de upgrade:** os apps importam **somente** de `@repo/design-system`.
   Trocar a major do antd acontece em **um** lugar (a fachada), não em N apps.
3. **Ritmo de adoção de majors:**
   - Patches/minors: adoção contínua (Renovate/Dependabot), barrados pelos gates de
     CI (typecheck → unit → **Storybook Test/axe** → **E2E**).
   - Major (v6): adoção **deliberada**, em branch, atrás da fachada, somente quando
     (a) `@ant-design/nextjs-registry` e o ecossistema suportarem o v6, (b) o catálogo
     Storybook inteiro passar (render + axe), (c) os E2E críticos passarem.
4. **Tokens são estáveis na transição:** a marca vive em `@repo/brand-tokens` (DTCG →
   `ThemeConfig`). Mudanças de API de theming do antd são absorvidas no mapeamento
   (`$extensions["com.plataforma.antd"]`), não nos apps.

## Consequências

- **+** Upgrades de major viram um PR isolado e testável; o blast radius fica na fachada.
- **+** O catálogo + E2E funcionam como suíte de regressão para validar o upgrade.
- **+** Apps nunca dependem de detalhes internos do antd (lint pode proibir `import 'antd'`
  fora da fachada).
- **−** A fachada precisa acompanhar renomeações de componentes/props entre majors.
- **Reavaliar** quando o v6 estiver estável: abrir ADR-NNNN para registrar a migração.
