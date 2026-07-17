import { Card, Col, Row, Typography, theme } from 'antd';
import type { ReactNode } from 'react';
import { Section } from './Section';

const { Title, Paragraph, Text } = Typography;

export interface FeatureItem {
  icon?: ReactNode;
  title: ReactNode;
  description: ReactNode;
}

export interface FeaturesProps {
  heading?: ReactNode;
  subheading?: ReactNode;
  items: FeatureItem[];
  /** Columns on desktop (defaults to 3). */
  columns?: 2 | 3 | 4;
}

/** Grid of product features/benefits. */
export function Features({ heading, subheading, items, columns = 3 }: FeaturesProps) {
  const { token } = theme.useToken();
  const span = 24 / columns;
  return (
    <Section>
      {(heading || subheading) && (
        <div style={{ textAlign: 'center', marginBottom: token.marginXL }}>
          {heading && <Title level={2}>{heading}</Title>}
          {subheading && <Paragraph type="secondary">{subheading}</Paragraph>}
        </div>
      )}
      <Row gutter={[token.paddingLG, token.paddingLG]}>
        {items.map((item, i) => (
          <Col key={i} xs={24} sm={12} lg={span}>
            <Card variant="borderless" style={{ height: '100%' }}>
              {item.icon && (
                <div style={{ fontSize: token.fontSizeHeading2, color: token.colorPrimary }}>
                  {item.icon}
                </div>
              )}
              <Title level={3} style={{ marginTop: token.marginSM, fontSize: token.fontSizeHeading4 }}>
                {item.title}
              </Title>
              <Text type="secondary">{item.description}</Text>
            </Card>
          </Col>
        ))}
      </Row>
    </Section>
  );
}
