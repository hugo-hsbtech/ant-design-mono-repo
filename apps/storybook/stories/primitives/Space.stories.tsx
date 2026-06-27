import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Button, Divider, Input, Space, Typography } from '@repo/design-system';

const meta: Meta<typeof Space> = {
  title: 'Primitives/Space',
  component: Space,
  args: {
    size: 'middle',
  },
  argTypes: {
    direction: { control: 'select', options: ['horizontal', 'vertical'] },
    size: { control: 'select', options: ['small', 'middle', 'large'] },
    align: { control: 'select', options: ['start', 'end', 'center', 'baseline'] },
    wrap: { control: 'boolean' },
  },
  render: (args) => (
    <Space {...args}>
      <Button type="primary">One</Button>
      <Button>Two</Button>
      <Button>Three</Button>
    </Space>
  ),
};

export default meta;
type Story = StoryObj<typeof Space>;

export const Horizontal: Story = {};

export const Vertical: Story = {
  args: { direction: 'vertical' },
  render: (args) => (
    <Space {...args} style={{ width: 200 }}>
      <Button block type="primary">
        One
      </Button>
      <Button block>Two</Button>
      <Button block>Three</Button>
    </Space>
  ),
};

export const Sizes: Story = {
  render: () => (
    <Space direction="vertical" size="large">
      <Space size="small">
        <Typography.Text>Small</Typography.Text>
        <Button>A</Button>
        <Button>B</Button>
      </Space>
      <Space size="middle">
        <Typography.Text>Middle</Typography.Text>
        <Button>A</Button>
        <Button>B</Button>
      </Space>
      <Space size="large">
        <Typography.Text>Large</Typography.Text>
        <Button>A</Button>
        <Button>B</Button>
      </Space>
      <Space size={48}>
        <Typography.Text>Custom (48px)</Typography.Text>
        <Button>A</Button>
        <Button>B</Button>
      </Space>
    </Space>
  ),
};

export const Wrap: Story = {
  render: () => (
    <Space wrap style={{ maxWidth: 320 }}>
      {Array.from({ length: 12 }).map((_, i) => (
        <Button key={i}>Item {i + 1}</Button>
      ))}
    </Space>
  ),
};

export const Compact: Story = {
  render: () => (
    <Space direction="vertical" size="large">
      <Space.Compact>
        <Input style={{ width: 200 }} aria-label="Compact text input" defaultValue="Search term" />
        <Button type="primary">Search</Button>
      </Space.Compact>
      <Space.Compact>
        <Button>Left</Button>
        <Button>Middle</Button>
        <Button>Right</Button>
      </Space.Compact>
    </Space>
  ),
};

export const SplitWithDivider: Story = {
  render: () => (
    <Space split={<Divider type="vertical" />}>
      <Typography.Link>Edit</Typography.Link>
      <Typography.Link>Duplicate</Typography.Link>
      <Typography.Link>Delete</Typography.Link>
    </Space>
  ),
};
