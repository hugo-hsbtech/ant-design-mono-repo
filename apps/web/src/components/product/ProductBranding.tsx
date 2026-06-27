'use client';
import { Space, Typography, theme } from '@repo/design-system';
import type { ReactNode } from 'react';

const { Text } = Typography;

export interface ProductBrandingProps {
  name: string;
  /** Optional custom logo; falls back to a brand-colored mark. */
  logo?: ReactNode;
  href?: string;
}

/** Product identity in the top nav (logo + name). */
export function ProductBranding({ name, logo, href }: ProductBrandingProps) {
  const { token } = theme.useToken();
  const mark = logo ?? (
    <span
      aria-hidden
      style={{
        width: 24,
        height: 24,
        borderRadius: token.borderRadius,
        background: token.colorPrimary,
        display: 'inline-block',
      }}
    />
  );
  const content = (
    <Space align="center" size="small">
      {mark}
      <Text strong style={{ fontSize: token.fontSizeLG }}>
        {name}
      </Text>
    </Space>
  );
  return href ? (
    <a href={href} style={{ color: 'inherit', textDecoration: 'none' }}>
      {content}
    </a>
  ) : (
    content
  );
}
