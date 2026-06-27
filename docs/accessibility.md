# Acessibilidade e responsividade

Auditoria da fase E9-S2 (hardening). Documenta a linha de base de acessibilidade,
a cobertura automatizada, o plano de testes manuais, a matriz de breakpoints
responsivos e as questões conhecidas com suas mitigações.

## Linha de base

- **Alvo:** WCAG 2.1 nível **AA**.
- **Trade-off do antd:** a acessibilidade da plataforma herda o comportamento dos
  componentes do Ant Design v5 — esse é um trade-off aceito do projeto (PRD §2 e
  §10). Adotamos o antd como fachada única de UI; onde os componentes do antd têm
  lacunas de a11y (ex.: semântica de portais, foco em alguns overlays), tratamos
  caso a caso em vez de reescrever primitivos. Não regredimos abaixo do que o antd
  entrega e adicionamos `aria-label`/papéis onde o antd não infere.

## Cobertura automatizada (axe)

O Storybook roda o **a11y addon** com `a11y: { test: 'error' }`
(`apps/storybook/.storybook/preview.tsx`). Na prática, o **axe-core** é executado
em **cada uma das 277 stories** do catálogo, em Chromium real, e qualquer violação
**falha o build de testes** (`test:storybook`). Isso cobre foundations, primitivos
antd, patterns, blocos de marketing e os componentes de produto (`Product/`).

**O que o axe detecta (~30–50% dos critérios WCAG):**

- Contraste de cor texto/fundo.
- Atributos ARIA inválidos, papéis (roles) inconsistentes ou órfãos.
- Imagens/ícones sem texto alternativo e controles sem nome acessível.
- Estrutura de cabeçalhos, `lang` do documento, rótulos de formulário ausentes.
- Atributos duplicados, IDs repetidos e landmarks malformados.

**O que o axe NÃO detecta (exige teste manual):**

- **Ordem e lógica de foco** ao navegar por `Tab` (sequência faz sentido?).
- **Gestão de foco** em overlays: foco que entra ao abrir e **retorna** ao
  gatilho ao fechar (Modal, Drawer, Popover, Dropdown, Popconfirm).
- **Semântica para leitor de tela:** o que é anunciado de fato, ordem de leitura,
  mudanças dinâmicas (toasts/`message`, badges de não lidas).
- **Operabilidade só por teclado** de fluxos completos (criar projeto, convidar
  membro, trocar org) e atalhos como `Esc` para fechar.
- **Significado dependente de cor** (ex.: `Tag` de status verde/cinza).

Conclusão: o axe é a primeira linha de defesa contínua, mas a conformidade AA
depende do plano manual abaixo.

## Plano de testes manuais

### Fluxos-chave por teclado (somente teclado, sem mouse)

Convenção: `Tab`/`Shift+Tab` move o foco, `Enter`/`Espaço` ativa, `Esc` fecha
overlays, setas navegam dentro de menus/listas do antd.

- [ ] **Login** (`/login`): `Tab` chega ao campo **E-mail**; digitar e-mail e
      `Enter` submete o `Form` e navega para o dashboard da org. Mensagem de erro
      do `Alert` é alcançável/anunciada.
- [ ] **Troca de organização** (`OrgSwitcher`, um `Dropdown` com `menu`
      selecionável): `Enter`/`Espaço` abre, setas percorrem as orgs, `Enter`
      seleciona e navega, `Esc` fecha e **devolve o foco** ao botão "Trocar de
      organização". O item atual deve indicar seleção (`CheckOutlined`), não só
      por cor.
- [ ] **CRUD de projetos**:
  - [ ] Botão **"Novo projeto"** abre o `FormModal` (Modal + Form). Foco entra no
        modal; `Tab` fica **preso no modal** (focus trap); campo "Nome" recebe
        foco; `Enter`/"Salvar" submete; `Esc`/"Cancelar" fecha e **retorna foco**
        ao gatilho.
  - [ ] **Busca** da `DataTable` operável por teclado.
  - [ ] Excluir → `Popconfirm`: abre por teclado, foco vai ao popover, "OK"/
        "Cancelar" alcançáveis, `Esc` fecha e retorna foco ao botão "Excluir".
- [ ] **Gestão de membros** (`/[org]/members`): "Convidar" abre `FormModal` com
      `Input` de e-mail + `Select` de papel (operável por teclado/setas); `Select`
      de papel por linha tem `aria-label` ("Papel de …"); "Remover" via
      `Popconfirm`; cancelar convite pendente.
- [ ] **NotificationCenter** (`Popover`, `trigger: 'click'`): abre por teclado,
      lista navegável, `Esc` fecha e devolve foco ao sino. "Marcar todas como
      lidas" alcançável. Badge de não lidas tem nome acessível no botão.
- [ ] **AppSwitcher** (`Popover` waffle): abre por teclado, grade de links
      navegável por `Tab`, `aria-current="page"` no produto atual, `Esc` fecha e
      retorna foco ao gatilho "Trocar de produto".
- [ ] **ThemeToggle**: botão alcançável; `aria-label` reflete a ação ("Mudar para
      tema escuro/claro"); estado alterna ao ativar.
- [ ] **UserMenu** (`Dropdown`): abre por teclado, itens (Perfil/Preferências/
      Sair) navegáveis por setas, "Sair" alcançável, `Esc` fecha.
- [ ] **Navegação na sidebar** (`Menu mode="inline"`): `Tab` chega ao menu, setas
      percorrem itens (Projetos/Membros/Configurações), `Enter` navega, item
      selecionado refletido em `selectedKeys`. No mobile (< `lg`), o botão "Abrir
      menu de navegação" abre o `Drawer`; foco entra no Drawer e retorna ao
      fechar.

### Leitor de tela (NVDA/Windows, VoiceOver/macOS)

- [ ] Cada página tem **um `h1`** coerente (o `PageHeader` provê o título:
      "Projetos", "Membros").
- [ ] Botões só-ícone anunciam seu **nome acessível** (sino, waffle, tema,
      avatar, hambúrguer do AppShell).
- [ ] Tabelas (`DataTable`) anunciam cabeçalhos de coluna ao navegar células.
- [ ] Formulários (`Form` do antd) associam `label` ↔ controle; mensagens de
      validação são anunciadas.
- [ ] Mudanças dinâmicas (`App.useApp().message` de sucesso/erro) são anunciadas
      como live region.
- [ ] Estados de seleção (org atual, item de menu ativo, `Tag` "você") não
      dependem só de cor.
- [ ] Abrir/fechar overlays move o foco para um ponto sensível e o devolve ao
      gatilho.

## Matriz de breakpoints responsivos

Breakpoints do **Grid do antd** (`Grid.useBreakpoint()`), em px:

| Token | Largura       | Comportamento principal                                                                 |
|-------|---------------|-----------------------------------------------------------------------------------------|
| `xs`  | < 576         | Layout de coluna única; sidebar **em Drawer** (toggle no header); tabelas com scroll horizontal; formulários empilhados. |
| `sm`  | ≥ 576         | Tipografia/espaçamentos confortáveis; ainda sidebar em Drawer.                          |
| `md`  | ≥ 768         | Mais densidade; ainda Drawer; tabelas começam a caber melhor.                           |
| `lg`  | ≥ 992         | **Sidebar fixa (`Sider`, 240px)** substitui o Drawer — limite de "mobile vs desktop" do `AppShell`. |
| `xl`  | ≥ 1200        | Conteúdo com mais respiro; grids/formulários multi-coluna.                              |
| `xxl` | ≥ 1600        | Larguras máximas e maior densidade de informação.                                       |

Notas:

- O `AppShell` (`packages/design-system/src/patterns/AppShell.tsx`) usa
  `screens.lg === false` como definição de mobile: **abaixo de `lg` (< 992px)** a
  sidebar vira `Drawer` acionado pelo botão "Abrir menu de navegação"; em `lg+` é
  um `Sider` fixo de 240px.
- Na primeira passada de SSR `screens.lg` é `undefined`; é tratado como **desktop**
  para evitar flash de layout.
- `DataTable`/tabelas reflowam com scroll horizontal em larguras estreitas; os
  `Form` em `layout="vertical"` empilham label/controle naturalmente.
- Testar cada breakpoint em modo claro **e** escuro.

## Questões conhecidas e mitigações

- **Botões só-ícone precisam de `aria-label`** — *aplicado*: NotificationCenter
  (`Notificações (N não lidas)`), AppSwitcher (`Trocar de produto`), ThemeToggle
  (rótulo dependente do estado), UserMenu (`Menu do usuário`), OrgSwitcher
  (`Trocar de organização`) e o hambúrguer do AppShell (`Abrir menu de
  navegação`).
- **Contraste em tema escuro** — coberto pelo axe por story; revisar manualmente
  combinações de baixo contraste (texto secundário, `Tag`, links) no dark mode.
- **Foco em portais do antd** — Modal/Drawer fazem focus trap e retorno de foco;
  Popover/Dropdown/Popconfirm devem fechar com `Esc` e devolver foco ao gatilho.
  Validar manualmente (axe não cobre gestão de foco). Atenção ao `Drawer` da
  sidebar: o clique de navegação interno fecha o Drawer — confirmar que o foco
  não fica órfão.
- **Significado por cor** — `Tag` de status (verde "active" / cinza) e seleção de
  org/menu precisam de reforço textual ou ícone, não só cor.
- **`message` (toasts)** — garantir anúncio via live region para sucesso/erro de
  server actions (criar/remover projeto, convidar/remover membro).

## Definition of Done (a11y) por componente

Ecoa o DoD do catálogo (PRD §6.3 — componente + story + teste + a11y + doc):

- [ ] **Story no Storybook** passando pelo axe (`a11y.test: 'error'`), sem
      violações, em claro e escuro.
- [ ] **Nome acessível** em todos os controles interativos (texto visível ou
      `aria-label`); nada de botão só-ícone "mudo".
- [ ] **Operável por teclado** de ponta a ponta; ordem de `Tab` lógica; `Esc`
      fecha overlays.
- [ ] **Gestão de foco** em overlays: foco entra ao abrir e **retorna ao gatilho**
      ao fechar; focus trap em Modal/Drawer.
- [ ] **Não depender de cor** isolada para transmitir estado/significado.
- [ ] **Contraste AA** verificado nos dois temas.
- [ ] **Responsivo** validado na matriz de breakpoints (com atenção ao corte em
      `lg`).
