'use client';
import { Button, Space, theme } from '@repo/design-system';
import { CheckOutlined, DownOutlined } from '@ant-design/icons';
import { Dropdown } from '@repo/design-system';

export interface OrgSwitcherOrg {
  slug: string;
  name: string;
}

export interface OrgSwitcherProps {
  current: OrgSwitcherOrg;
  orgs: OrgSwitcherOrg[];
  onSelect: (slug: string) => void;
}

/** Current organization + a menu to switch between the user's orgs. */
export function OrgSwitcher({ current, orgs, onSelect }: OrgSwitcherProps) {
  const { token } = theme.useToken();
  return (
    <Dropdown
      trigger={['click']}
      menu={{
        selectable: true,
        selectedKeys: [current.slug],
        items: orgs.map((o) => ({
          key: o.slug,
          label: o.name,
          icon:
            o.slug === current.slug ? (
              <CheckOutlined style={{ color: token.colorPrimary }} />
            ) : (
              <span style={{ display: 'inline-block', width: token.fontSize }} />
            ),
        })),
        onClick: ({ key }) => onSelect(key),
      }}
    >
      <Button aria-label="Trocar de organização">
        <Space size="small">
          {current.name}
          <DownOutlined />
        </Space>
      </Button>
    </Dropdown>
  );
}
