import { Avatar, Card, Col, Row, Typography, theme } from 'antd';
import type { ReactNode } from 'react';
import { initials } from '@repo/utils';
import { Section } from './Section';

const { Title, Paragraph, Text } = Typography;

export interface Testimonial {
  quote: ReactNode;
  author: string;
  role?: ReactNode;
  avatarSrc?: string;
}

export interface TestimonialsProps {
  heading?: ReactNode;
  items: Testimonial[];
}

/** Social-proof block: customer quotes with author + avatar. */
export function Testimonials({ heading, items }: TestimonialsProps) {
  const { token } = theme.useToken();
  return (
    <Section background={token.colorFillQuaternary}>
      {heading && (
        <Title level={2} style={{ textAlign: 'center', marginBottom: token.marginXL }}>
          {heading}
        </Title>
      )}
      <Row gutter={[token.paddingLG, token.paddingLG]}>
        {items.map((t, i) => (
          <Col key={i} xs={24} md={12} lg={8}>
            <Card variant="borderless" style={{ height: '100%' }}>
              <Paragraph style={{ fontSize: token.fontSizeLG }}>“{t.quote}”</Paragraph>
              <Card.Meta
                avatar={<Avatar src={t.avatarSrc}>{initials(t.author)}</Avatar>}
                title={t.author}
                description={t.role && <Text type="secondary">{t.role}</Text>}
              />
            </Card>
          </Col>
        ))}
      </Row>
    </Section>
  );
}
