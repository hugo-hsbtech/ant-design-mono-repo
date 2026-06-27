import {
  CTA,
  FAQ,
  Features,
  Footer,
  Hero,
  Pricing,
  Testimonials,
} from '@repo/design-system';
import { RocketOutlined, SafetyOutlined, ThunderboltOutlined } from '@ant-design/icons';

export default function LandingPage() {
  return (
    <main>
      <Hero
        eyebrow="Plataforma de UI"
        title="Uma marca, três frentes"
        subtitle="Dashboards, landing pages e sites institucionais com identidade unificada, sobre o Ant Design v5."
        primaryAction={{ label: 'Começar agora', href: '#pricing' }}
        secondaryAction={{ label: 'Ver catálogo', href: '#features' }}
      />
      <Features
        heading="Por que a plataforma"
        subheading="Tudo construído sobre tokens de marca."
        items={[
          {
            icon: <ThunderboltOutlined />,
            title: 'Tema unificado',
            description: 'Mude a cor primária uma vez e tudo se re-tematiza.',
          },
          {
            icon: <RocketOutlined />,
            title: 'Pronto para produção',
            description: '60+ componentes do Ant Design pela fachada do design-system.',
          },
          {
            icon: <SafetyOutlined />,
            title: 'Acessível',
            description: 'WCAG AA como linha de base, verificado com axe no catálogo.',
          },
        ]}
      />
      <Testimonials
        heading="Quem usa, recomenda"
        items={[
          { quote: 'Subimos um dashboard inteiro na marca em dias.', author: 'Ada Lovelace', role: 'CTO, Apollo' },
          { quote: 'O tema unificado economizou semanas.', author: 'Alan Turing', role: 'Eng. Lead, Hermes' },
          { quote: 'Catálogo vivo: testado e acessível.', author: 'Grace Hopper', role: 'Produto, Atlas' },
        ]}
      />
      <Pricing
        heading="Planos"
        plans={[
          {
            name: 'Starter',
            price: 'R$0',
            period: '/mês',
            features: ['1 organização', 'Até 3 membros'],
            cta: { label: 'Começar' },
          },
          {
            name: 'Pro',
            price: 'R$99',
            period: '/mês',
            features: ['Orgs ilimitadas', 'RBAC completo', 'Suporte prioritário'],
            cta: { label: 'Assinar Pro' },
            highlighted: true,
            badge: 'Popular',
          },
        ]}
      />
      <FAQ
        items={[
          { question: 'Preciso saber Ant Design?', answer: 'Não — importe tudo de @repo/design-system.' },
          { question: 'Como troco a marca?', answer: 'Edite os tokens DTCG; tudo re-tematiza.' },
        ]}
      />
      <CTA
        title="Pronto para começar?"
        description="Suba sua primeira frente na marca em minutos."
        primaryAction={{ label: 'Criar conta', href: '#' }}
      />
      <Footer
        brand="Plataforma"
        description="Uma marca, três frentes — sobre o Ant Design v5."
        copyright="© 2026 Plataforma."
        columns={[
          {
            title: 'Produto',
            links: [
              { label: 'Recursos', href: '#features' },
              { label: 'Preços', href: '#pricing' },
            ],
          },
          {
            title: 'Empresa',
            links: [
              { label: 'Sobre', href: '#' },
              { label: 'Contato', href: '#' },
            ],
          },
        ]}
      />
    </main>
  );
}
