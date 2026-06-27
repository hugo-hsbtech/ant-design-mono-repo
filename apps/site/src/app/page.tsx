import { CTA, Footer, Hero, Section } from '@repo/design-system';

// NOTE: this is a Server Component. antd's `Typography.Title/Paragraph` are
// statics on a client-component reference and resolve to `undefined` on the
// server, so we use semantic HTML for prose here (better for SEO anyway).
export default function AboutPage() {
  return (
    <main>
      <Hero
        eyebrow="Sobre"
        title="Construímos a base de UI da nossa marca"
        subtitle="Uma fundação compartilhada que serve dashboards, landing pages e sites — com a mesma identidade."
        primaryAction={{ label: 'Falar com a gente', href: '#contato' }}
      />
      <Section maxWidth={760}>
        <h2>Nossa missão</h2>
        <p>
          Entregar experiências consistentes e acessíveis em todas as frentes, evoluindo sobre o
          Ant Design v5 e herdando suas atualizações. A marca vive em um único conjunto de design
          tokens, aplicado uniformemente do produto logado ao site institucional.
        </p>
        <h2 id="contato">Contato</h2>
        <p>contato@plataforma.exemplo</p>
      </Section>
      <CTA
        title="Quer conhecer a plataforma?"
        description="Veja o catálogo de componentes e os templates."
        primaryAction={{ label: 'Ver catálogo', href: '#' }}
      />
      <Footer
        brand="Plataforma"
        copyright="© 2026 Plataforma."
        columns={[
          {
            title: 'Institucional',
            links: [
              { label: 'Sobre', href: '/' },
              { label: 'Contato', href: '#contato' },
            ],
          },
          {
            title: 'Legal',
            links: [
              { label: 'Privacidade', href: '#' },
              { label: 'Termos', href: '#' },
            ],
          },
        ]}
      />
    </main>
  );
}
