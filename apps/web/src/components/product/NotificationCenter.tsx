'use client';
import { Badge, Button, Empty, Flex, List, Popover, Typography, theme } from '@repo/design-system';
import { BellOutlined } from '@ant-design/icons';

const { Text } = Typography;

export interface NotificationItem {
  id: string;
  title: string;
  description?: string;
  time?: string;
  read?: boolean;
}

export interface NotificationCenterProps {
  items: NotificationItem[];
  onMarkAllRead?: () => void;
  onItemClick?: (id: string) => void;
}

/** Bell + unread badge → a popover list of notifications (uses Notification/Badge). */
export function NotificationCenter({ items, onMarkAllRead, onItemClick }: NotificationCenterProps) {
  const { token } = theme.useToken();
  const unread = items.filter((i) => !i.read).length;

  const content = (
    <div style={{ width: 320 }}>
      <Flex
        align="center"
        justify="space-between"
        style={{ paddingBlockEnd: token.paddingXS }}
      >
        <Text strong>Notificações</Text>
        {unread > 0 && onMarkAllRead && (
          <Button type="link" size="small" onClick={onMarkAllRead}>
            Marcar todas como lidas
          </Button>
        )}
      </Flex>
      {items.length === 0 ? (
        <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="Sem notificações" />
      ) : (
        <List
          size="small"
          dataSource={items}
          style={{ maxHeight: 320, overflow: 'auto' }}
          renderItem={(item) => (
            <List.Item
              onClick={() => onItemClick?.(item.id)}
              style={{
                cursor: onItemClick ? 'pointer' : undefined,
                background: item.read ? undefined : token.colorFillQuaternary,
                paddingInline: token.paddingXS,
              }}
            >
              <List.Item.Meta
                title={item.title}
                description={
                  <>
                    {item.description && <div>{item.description}</div>}
                    {item.time && <Text type="secondary" style={{ fontSize: token.fontSizeSM }}>{item.time}</Text>}
                  </>
                }
              />
            </List.Item>
          )}
        />
      )}
    </div>
  );

  return (
    <Popover content={content} trigger="click" placement="bottomRight">
      <Badge count={unread} size="small">
        <Button type="text" icon={<BellOutlined />} aria-label={`Notificações (${unread} não lidas)`} />
      </Badge>
    </Popover>
  );
}
