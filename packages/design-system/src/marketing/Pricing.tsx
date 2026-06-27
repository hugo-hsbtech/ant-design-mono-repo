import { Button, Card, Col, List, Row, Tag, Typography, theme } from 'antd';
import { CheckOutlined } from '@ant-design/icons';
import type { ReactNode } from 'react';
import { Section } from './Section';

const { Title, Paragraph, Text } = Typography;

export interface PricingPlan {
  name: ReactNode;
  price: ReactNode;
  period?: ReactNode;
  description?: ReactNode;
  features: ReactNode[];
  cta: { label: string; href?: string; onClick?: () => void };
  highlighted?: boolean;
  badge?: ReactNode;
}

export interface PricingProps {
  heading?: ReactNode;
  subheading?: ReactNode;
  plans: PricingPlan[];
}

/** Pricing tiers block; highlight one plan via `highlighted`. */
export function Pricing({ heading, subheading, plans }: PricingProps) {
  const { token } = theme.useToken();
  const span = Math.floor(24 / Math.min(plans.length, 4)) || 8;
  return (
    <Section>
      {(heading || subheading) && (
        <div style={{ textAlign: 'center', marginBottom: token.marginXL }}>
          {heading && <Title level={2}>{heading}</Title>}
          {subheading && <Paragraph type="secondary">{subheading}</Paragraph>}
        </div>
      )}
      <Row gutter={[token.paddingLG, token.paddingLG]} justify="center">
        {plans.map((plan, i) => (
          <Col key={i} xs={24} sm={12} lg={span}>
            <Card
              style={{
                height: '100%',
                borderColor: plan.highlighted ? token.colorPrimary : undefined,
                borderWidth: plan.highlighted ? 2 : undefined,
              }}
              title={
                <span>
                  {plan.name} {plan.badge && <Tag color="blue">{plan.badge}</Tag>}
                </span>
              }
            >
              <Title level={2} style={{ margin: 0 }}>
                {plan.price}
                {plan.period && <Text type="secondary"> {plan.period}</Text>}
              </Title>
              {plan.description && <Paragraph type="secondary">{plan.description}</Paragraph>}
              <List
                size="small"
                dataSource={plan.features}
                renderItem={(f) => (
                  <List.Item>
                    <CheckOutlined style={{ color: token.colorSuccess, marginInlineEnd: token.marginXS }} />
                    {f}
                  </List.Item>
                )}
                style={{ marginBlock: token.margin }}
              />
              <Button
                block
                type={plan.highlighted ? 'primary' : 'default'}
                size="large"
                href={plan.cta.href}
                onClick={plan.cta.onClick}
              >
                {plan.cta.label}
              </Button>
            </Card>
          </Col>
        ))}
      </Row>
    </Section>
  );
}
