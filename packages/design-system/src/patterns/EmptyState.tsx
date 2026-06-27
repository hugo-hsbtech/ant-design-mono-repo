import { Empty, Space, Typography } from 'antd';
import type { ReactNode } from 'react';

const { Text } = Typography;

export interface EmptyStateProps {
  title?: ReactNode;
  description?: ReactNode;
  image?: ReactNode;
  /** Call-to-action(s), e.g. a "Create" button. */
  action?: ReactNode;
}

/** Friendly empty state built on antd `Empty`, with an optional CTA. */
export function EmptyState({ title, description, image, action }: EmptyStateProps) {
  return (
    <Empty
      image={image ?? Empty.PRESENTED_IMAGE_SIMPLE}
      description={
        <Space direction="vertical" size={4}>
          {title && <Text strong>{title}</Text>}
          {description && <Text type="secondary">{description}</Text>}
        </Space>
      }
    >
      {action}
    </Empty>
  );
}
