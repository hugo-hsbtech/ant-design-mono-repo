import { Button, Flex, Space, Typography, theme } from 'antd';
import type { ReactNode } from 'react';
import { Section } from './Section';

const { Title, Paragraph } = Typography;

export interface HeroAction {
  label: string;
  href?: string;
  onClick?: () => void;
}

export interface HeroProps {
  title: ReactNode;
  subtitle?: ReactNode;
  primaryAction?: HeroAction;
  secondaryAction?: HeroAction;
  /** Optional visual (image/illustration) shown beside the copy. */
  media?: ReactNode;
  eyebrow?: ReactNode;
}

/** Landing/site hero block. Identity comes from theme tokens. */
export function Hero({ title, subtitle, primaryAction, secondaryAction, media, eyebrow }: HeroProps) {
  const { token } = theme.useToken();
  return (
    <Section>
      <Flex gap={token.paddingLG * 2} wrap="wrap" align="center" justify="space-between">
        <div style={{ flex: '1 1 360px', minWidth: 0 }}>
          {eyebrow && (
            <Typography.Text style={{ color: token.colorPrimary, fontWeight: token.fontWeightStrong }}>
              {eyebrow}
            </Typography.Text>
          )}
          <Title style={{ marginTop: token.marginXS }}>{title}</Title>
          {subtitle && (
            <Paragraph type="secondary" style={{ fontSize: token.fontSizeLG }}>
              {subtitle}
            </Paragraph>
          )}
          <Space size="middle" wrap style={{ marginTop: token.margin }}>
            {primaryAction && (
              <Button type="primary" size="large" href={primaryAction.href} onClick={primaryAction.onClick}>
                {primaryAction.label}
              </Button>
            )}
            {secondaryAction && (
              <Button size="large" href={secondaryAction.href} onClick={secondaryAction.onClick}>
                {secondaryAction.label}
              </Button>
            )}
          </Space>
        </div>
        {media && <div style={{ flex: '1 1 360px', minWidth: 0 }}>{media}</div>}
      </Flex>
    </Section>
  );
}
