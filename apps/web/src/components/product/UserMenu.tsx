'use client';
import { Avatar, Button, Dropdown, Typography } from '@repo/design-system';
import { LogoutOutlined, SettingOutlined, UserOutlined } from '@ant-design/icons';
import type { ReactNode } from 'react';
import { initials } from '@repo/utils';

const { Text } = Typography;

export interface UserMenuProps {
  name: string;
  email?: string;
  avatarSrc?: string;
  onProfile?: () => void;
  onSettings?: () => void;
  onLogout?: () => void;
  /** Extra menu entries (e.g. a theme toggle row). */
  extra?: ReactNode;
}

/** Avatar → menu with profile, preferences and logout. */
export function UserMenu({
  name,
  email,
  avatarSrc,
  onProfile,
  onSettings,
  onLogout,
  extra,
}: UserMenuProps) {
  return (
    <Dropdown
      trigger={['click']}
      menu={{
        items: [
          {
            key: 'header',
            label: (
              <div style={{ paddingBlock: 4 }}>
                <div>
                  <Text strong>{name}</Text>
                </div>
                {email && (
                  <Text type="secondary" style={{ fontSize: 12 }}>
                    {email}
                  </Text>
                )}
              </div>
            ),
            disabled: true,
          },
          { type: 'divider' },
          { key: 'profile', icon: <UserOutlined />, label: 'Perfil' },
          { key: 'settings', icon: <SettingOutlined />, label: 'Preferências' },
          ...(extra ? [{ key: 'extra', label: extra, disabled: true }] : []),
          { type: 'divider' as const },
          { key: 'logout', icon: <LogoutOutlined />, label: 'Sair', danger: true },
        ],
        onClick: ({ key }) => {
          if (key === 'profile') onProfile?.();
          if (key === 'settings') onSettings?.();
          if (key === 'logout') onLogout?.();
        },
      }}
    >
      <Button type="text" aria-label="Menu do usuário" style={{ height: 'auto', padding: 4 }}>
        <Avatar size="small" src={avatarSrc}>
          {initials(name)}
        </Avatar>
      </Button>
    </Dropdown>
  );
}
