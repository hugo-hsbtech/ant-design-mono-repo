import { Button, Flex, Space, Typography, theme } from 'antd';
import type { ReactNode } from 'react';
import { Section } from './Section';

const { Title, Paragraph } = Typography;

export interface CTAAction {
  label: string;
  href?: string;
  onClick?: () => void;
}

export interface CTAProps {
  title: ReactNode;
  description?: ReactNode;
  primaryAction: CTAAction;
  secondaryAction?: CTAAction;
}

/** Conversion call-to-action band. */
export function CTA({ title, description, primaryAction, secondaryAction }: CTAProps) {
  const { token } = theme.useToken();
  return (
    <Section background={token.colorPrimary}>
      <Flex vertical align="center" gap={token.margin} style={{ textAlign: 'center' }}>
        <Title level={2} style={{ color: token.colorWhite, margin: 0 }}>
          {title}
        </Title>
        {description && (
          <Paragraph style={{ color: token.colorWhite, opacity: 0.9, fontSize: token.fontSizeLG }}>
            {description}
          </Paragraph>
        )}
        <Space size="middle" wrap>
          <Button size="large" href={primaryAction.href} onClick={primaryAction.onClick}>
            {primaryAction.label}
          </Button>
          {secondaryAction && (
            <Button
              size="large"
              ghost
              href={secondaryAction.href}
              onClick={secondaryAction.onClick}
            >
              {secondaryAction.label}
            </Button>
          )}
        </Space>
      </Flex>
    </Section>
  );
}
