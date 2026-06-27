import { Breadcrumb, Button, Flex, Space, Typography, theme } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import type { ReactNode } from 'react';

const { Title, Text } = Typography;

export interface PageHeaderCrumb {
  title: ReactNode;
  href?: string;
}

export interface PageHeaderProps {
  title: ReactNode;
  subtitle?: ReactNode;
  breadcrumb?: PageHeaderCrumb[];
  /** Right-aligned actions (buttons, dropdowns…). */
  extra?: ReactNode;
  /** Renders a back button when provided. */
  onBack?: () => void;
}

/**
 * Page heading composed from antd primitives (antd dropped `PageHeader` in v5).
 * Spacing comes from theme tokens, never hardcoded.
 */
export function PageHeader({ title, subtitle, breadcrumb, extra, onBack }: PageHeaderProps) {
  const { token } = theme.useToken();
  return (
    <div style={{ marginBottom: token.marginLG }}>
      {breadcrumb && breadcrumb.length > 0 && (
        <Breadcrumb
          style={{ marginBottom: token.marginXS }}
          items={breadcrumb.map((c) => ({ title: c.href ? <a href={c.href}>{c.title}</a> : c.title }))}
        />
      )}
      <Flex align="flex-start" justify="space-between" gap="middle" wrap="wrap">
        <Space align="center" size="middle">
          {onBack && (
            <Button
              type="text"
              shape="circle"
              aria-label="Voltar"
              icon={<ArrowLeftOutlined />}
              onClick={onBack}
            />
          )}
          <div>
            <Title level={3} style={{ margin: 0 }}>
              {title}
            </Title>
            {subtitle && <Text type="secondary">{subtitle}</Text>}
          </div>
        </Space>
        {extra && <Space wrap>{extra}</Space>}
      </Flex>
    </div>
  );
}
