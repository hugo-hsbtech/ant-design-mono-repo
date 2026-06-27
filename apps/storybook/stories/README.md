# Catálogo — organização e governança

Stories vivem **aqui** (fora do código-fonte do `design-system`). Cada pasta é uma camada:

| Pasta | O que mora aqui | Origem |
|---|---|---|
| `foundations/` | Tokens aplicados: cor, tipografia, espaçamento, elevação, motion | compartilhado |
| `primitives/` | Componentes do Ant Design via fachada `@repo/design-system` | compartilhado |
| `patterns/` | Compostos próprios reutilizáveis (AppShell, DataTable, PageHeader…) | compartilhado |
| `marketing/` | Blocos de landing/site (Hero, Pricing, CTA…) | compartilhado |
| `product/` | Compostos do app logado (AppSwitcher, OrgSwitcher…), catalogados com mocks | específico |

Stories específicas de um app também podem ser **co-localizadas** no próprio app
(`apps/<app>/src/**/*.stories.tsx`) — são incluídas no catálogo via glob em
`.storybook/main.ts`. Assim tudo fica no mesmo catálogo.

## Receita de uma story (template)

```tsx
import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Componente } from '@repo/design-system';

// Use anotação explícita (evita TS2742 com os tipos profundos do antd):
const meta: Meta<typeof Componente> = {
  title: 'Primitives/Componente',
  component: Componente,
  args: { /* defaults */ },
  argTypes: { /* controles das variantes */ },
};
export default meta;
type Story = StoryObj<typeof Componente>;

export const Default: Story = {};
// + stories de variantes/estados; play() onde houver comportamento.
```

## Definition of done (gate incremental)

Todo componente novo só fecha a tarefa que o criou quando tem:

- [ ] pasta correta da taxonomia;
- [ ] story com `args`/controles das variantes principais;
- [ ] teste de render + interação (`play`) onde houver comportamento;
- [ ] a11y/axe sem violations AA (addon a11y, `test: 'error'`);
- [ ] tipagem pública + doc mínima (autodocs/MDX).

> Nenhuma story "fica para depois": componente sem story não fecha a tarefa.
