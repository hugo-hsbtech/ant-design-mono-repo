'use client';
import { Button, Popover, Typography, theme } from '@repo/design-system';
import { WaffleIcon } from '@repo/icons';
import type { ReactNode } from 'react';

const { Text } = Typography;

export interface AppSwitcherProduct {
  key: string;
  name: string;
  icon: ReactNode;
  href?: string;
}

export interface AppSwitcherProps {
  products: AppSwitcherProduct[];
  currentKey?: string;
}

/** Google-style "waffle" product switcher: a grid of cross-product links. */
export function AppSwitcher({ products, currentKey }: AppSwitcherProps) {
  const { token } = theme.useToken();
  const grid = (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 88px)',
        gap: token.paddingXS,
        padding: token.paddingXS,
      }}
    >
      {products.map((p) => (
        <a
          key={p.key}
          href={p.href ?? '#'}
          aria-current={p.key === currentKey ? 'page' : undefined}
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: token.marginXXS,
            padding: token.paddingSM,
            borderRadius: token.borderRadius,
            color: 'inherit',
            textDecoration: 'none',
            background: p.key === currentKey ? token.colorFillSecondary : 'transparent',
          }}
        >
          <span style={{ fontSize: token.fontSizeHeading3, color: token.colorPrimary }}>
            {p.icon}
          </span>
          <Text style={{ fontSize: token.fontSizeSM, textAlign: 'center' }}>{p.name}</Text>
        </a>
      ))}
    </div>
  );
  return (
    <Popover content={grid} trigger="click" placement="bottomRight">
      <Button type="text" icon={<WaffleIcon />} aria-label="Trocar de produto" />
    </Popover>
  );
}
