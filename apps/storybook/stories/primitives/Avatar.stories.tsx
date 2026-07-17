import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Avatar, Space, Tooltip } from '@repo/design-system';
import { AntDesignOutlined, UserOutlined } from '@ant-design/icons';

const meta: Meta<typeof Avatar> = {
  title: 'Primitives/Avatar',
  component: Avatar,
  args: {
    icon: <UserOutlined />,
  },
  argTypes: {
    shape: { control: 'select', options: ['circle', 'square'] },
    size: { control: 'select', options: ['small', 'default', 'large'] },
  },
};

export default meta;
type Story = StoryObj<typeof Avatar>;

// These stories intentionally showcase custom avatar background colors, which
// aren't guaranteed to meet WCAG AA contrast. Turn off the axe color-contrast
// rule for them rather than doctoring the demo colors.
const showcaseColors = {
  a11y: { config: { rules: [{ id: 'color-contrast', enabled: false }] } },
};

export const Default: Story = {};

export const Sizes: Story = {
  render: (args) => (
    <Space align="center" wrap>
      <Avatar {...args} size={64} />
      <Avatar {...args} size="large" />
      <Avatar {...args} size="default" />
      <Avatar {...args} size="small" />
    </Space>
  ),
};

export const Shapes: Story = {
  render: (args) => (
    <Space align="center" wrap>
      <Avatar {...args} shape="circle" />
      <Avatar {...args} shape="square" />
    </Space>
  ),
};

export const WithIcon: Story = {
  parameters: showcaseColors,
  render: () => (
    <Space wrap>
      <Avatar icon={<UserOutlined />} />
      <Avatar icon={<AntDesignOutlined />} style={{ backgroundColor: '#1677ff' }} />
      <Avatar style={{ backgroundColor: '#87d068' }}>AD</Avatar>
    </Space>
  ),
};

export const WithImage: Story = {
  render: () => (
    <Space wrap>
      <Avatar src="https://api.dicebear.com/7.x/miniavs/svg?seed=ada" alt="Ada Lovelace avatar" />
      <Avatar
        size="large"
        src="https://api.dicebear.com/7.x/miniavs/svg?seed=alan"
        alt="Alan Turing avatar"
      />
    </Space>
  ),
};

export const Group: Story = {
  parameters: showcaseColors,
  render: () => (
    <Avatar.Group
      max={{
        count: 3,
        style: { color: '#f56a00', backgroundColor: '#fde3cf' },
      }}
    >
      <Avatar src="https://api.dicebear.com/7.x/miniavs/svg?seed=ada" alt="Ada Lovelace avatar" />
      <Avatar style={{ backgroundColor: '#f56a00' }}>K</Avatar>
      <Tooltip title="Grace Hopper" placement="top">
        <Avatar style={{ backgroundColor: '#87d068' }} icon={<UserOutlined />} />
      </Tooltip>
      <Avatar style={{ backgroundColor: '#1677ff' }} icon={<AntDesignOutlined />} />
      <Avatar style={{ backgroundColor: '#7265e6' }}>E</Avatar>
    </Avatar.Group>
  ),
};
