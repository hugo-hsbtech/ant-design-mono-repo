import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Pricing } from '@repo/design-system';

const meta = {
  title: 'Marketing/Pricing',
  component: Pricing,
  parameters: { layout: 'fullscreen' },
} satisfies Meta<typeof Pricing>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    heading: 'Planos',
    subheading: 'Escolha o que cabe no seu time.',
    plans: [
      {
        name: 'Starter',
        price: 'R$0',
        period: '/mês',
        features: ['1 organização', 'Até 3 membros', 'Comunidade'],
        cta: { label: 'Começar' },
      },
      {
        name: 'Pro',
        price: 'R$99',
        period: '/mês',
        description: 'Para times em crescimento.',
        features: ['Orgs ilimitadas', 'RBAC completo', 'Suporte prioritário'],
        cta: { label: 'Assinar Pro' },
        highlighted: true,
        badge: 'Popular',
      },
      {
        name: 'Enterprise',
        price: 'Sob consulta',
        features: ['SSO/SAML', 'SLA', 'Onboarding dedicado'],
        cta: { label: 'Falar com vendas' },
      },
    ],
  },
};
