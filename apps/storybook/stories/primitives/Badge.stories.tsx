import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Badge, Avatar, Card, Space } from '@repo/design-system';
import { BellOutlined } from '@ant-design/icons';

const meta: Meta<typeof Badge> = {
  title: 'Primitives/Badge',
  component: Badge,
  args: {
    count: 5,
  },
  argTypes: {
    count: { control: 'number' },
    dot: { control: 'boolean' },
    status: {
      control: 'select',
      options: ['success', 'processing', 'default', 'error', 'warning'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof Badge>;

export const Default: Story = {
  render: (args) => (
    <Badge {...args}>
      <Avatar shape="square" icon={<BellOutlined aria-label="Notifications" />} />
    </Badge>
  ),
};

export const Overflow: Story = {
  render: () => (
    <Space size="large">
      <Badge count={99}>
        <Avatar shape="square" />
      </Badge>
      <Badge count={100}>
        <Avatar shape="square" />
      </Badge>
      <Badge count={1000} overflowCount={999}>
        <Avatar shape="square" />
      </Badge>
    </Space>
  ),
};

export const Dot: Story = {
  render: () => (
    <Space size="large">
      <Badge dot>
        <BellOutlined style={{ fontSize: 20 }} aria-label="Notifications" />
      </Badge>
      <Badge dot>
        <a href="#">Updates</a>
      </Badge>
    </Space>
  ),
};

export const Status: Story = {
  render: () => (
    <Space direction="vertical">
      <Badge status="success" text="Success" />
      <Badge status="processing" text="Processing" />
      <Badge status="error" text="Error" />
      <Badge status="warning" text="Warning" />
      <Badge status="default" text="Default" />
    </Space>
  ),
};

export const Standalone: Story = {
  render: () => (
    <Space size="large">
      <Badge count={25} />
      <Badge count={4} style={{ backgroundColor: '#52c41a' }} />
      <Badge count={109} overflowCount={99} />
    </Space>
  ),
};

export const Ribbon: Story = {
  // Showcases antd's decorative ribbon colors, not guaranteed WCAG AA.
  parameters: { a11y: { config: { rules: [{ id: 'color-contrast', enabled: false }] } } },
  render: () => (
    <Space size="large">
      <Badge.Ribbon text="New">
        <Card title="Apollo" style={{ width: 240 }}>
          Project card with a ribbon.
        </Card>
      </Badge.Ribbon>
      <Badge.Ribbon text="Hot" color="red">
        <Card title="Hermes" style={{ width: 240 }}>
          Colored ribbon variant.
        </Card>
      </Badge.Ribbon>
    </Space>
  ),
};
