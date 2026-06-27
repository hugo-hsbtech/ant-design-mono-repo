import { Col, Divider, Flex, Row, Space, Typography, theme } from 'antd';
import type { ReactNode } from 'react';
import { Section } from './Section';

const { Text, Link, Title } = Typography;

export interface FooterLink {
  label: string;
  href: string;
}

export interface FooterColumn {
  title: ReactNode;
  links: FooterLink[];
}

export interface FooterProps {
  brand?: ReactNode;
  description?: ReactNode;
  columns?: FooterColumn[];
  /** e.g. "© 2026 Plataforma". */
  copyright?: ReactNode;
  social?: ReactNode;
}

/** Site/landing footer with link columns and a brand blurb. */
export function Footer({ brand, description, columns = [], copyright, social }: FooterProps) {
  const { token } = theme.useToken();
  return (
    <footer style={{ background: token.colorBgContainer, borderTop: `1px solid ${token.colorBorderSecondary}` }}>
      <Section>
        <Row gutter={[token.paddingLG, token.paddingLG]}>
          <Col xs={24} md={8}>
            {brand && <Title level={4}>{brand}</Title>}
            {description && <Text type="secondary">{description}</Text>}
          </Col>
          {columns.map((col, i) => (
            <Col key={i} xs={12} md={Math.max(4, Math.floor(16 / Math.max(columns.length, 1)))}>
              <Title level={5}>{col.title}</Title>
              <Space direction="vertical">
                {col.links.map((l, li) => (
                  <Link key={`${l.label}-${li}`} href={l.href}>
                    {l.label}
                  </Link>
                ))}
              </Space>
            </Col>
          ))}
        </Row>
        <Divider />
        <Flex justify="space-between" align="center" wrap="wrap" gap="small">
          <Text type="secondary">{copyright}</Text>
          {social}
        </Flex>
      </Section>
    </footer>
  );
}
