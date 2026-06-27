import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, userEvent, within } from 'storybook/test';
import { Button, Dropdown, Space } from '@repo/design-system';
import type { MenuProps } from '@repo/design-system';
import {
  DownOutlined,
  EditOutlined,
  LogoutOutlined,
  UserOutlined,
} from '@ant-design/icons';

const items: MenuProps['items'] = [
  { key: '1', label: 'Profile' },
  { key: '2', label: 'Billing' },
  { type: 'divider' },
  { key: '3', label: 'Settings' },
];

const iconItems: MenuProps['items'] = [
  { key: '1', icon: <UserOutlined />, label: 'Profile' },
  { key: '2', icon: <EditOutlined />, label: 'Edit' },
  { type: 'divider' },
  { key: '3', icon: <LogoutOutlined />, label: 'Logout' },
];

const meta: Meta<typeof Dropdown> = {
  title: 'Primitives/Dropdown',
  component: Dropdown,
  args: {
    menu: { items },
  },
};

export default meta;
type Story = StoryObj<typeof Dropdown>;

export const TriggerButton: Story = {
  render: (args) => (
    <Dropdown {...args}>
      <Button>
        <Space>
          Hover me
          <DownOutlined />
        </Space>
      </Button>
    </Dropdown>
  ),
};

export const WithIcons: Story = {
  args: { menu: { items: iconItems } },
  render: (args) => (
    <Dropdown {...args}>
      <Button>
        <Space>
          Account
          <DownOutlined />
        </Space>
      </Button>
    </Dropdown>
  ),
};

export const ButtonVariant: Story = {
  render: (args) => (
    <Dropdown.Button {...args} onClick={() => {}}>
      Actions
    </Dropdown.Button>
  ),
};

export const Placement: Story = {
  args: { placement: 'bottomRight' },
  render: (args) => (
    <Dropdown {...args}>
      <Button>Bottom Right</Button>
    </Dropdown>
  ),
};

export const OpenInteraction: Story = {
  render: (args) => (
    <Dropdown {...args} trigger={['click']}>
      <Button>Open menu</Button>
    </Dropdown>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const trigger = canvas.getByRole('button', { name: /open menu/i });
    await userEvent.click(trigger);
    // Dropdown menu renders in a portal, so query the document body.
    const body = within(document.body);
    await expect(await body.findByText('Profile')).toBeInTheDocument();
  },
};
