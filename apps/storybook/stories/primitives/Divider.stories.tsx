import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Divider, Typography } from '@repo/design-system';

const meta: Meta<typeof Divider> = {
  title: 'Primitives/Divider',
  component: Divider,
  args: {},
  argTypes: {
    type: { control: 'select', options: ['horizontal', 'vertical'] },
    orientation: { control: 'select', options: ['left', 'center', 'right'] },
    dashed: { control: 'boolean' },
    plain: { control: 'boolean' },
  },
  render: (args) => (
    <div style={{ maxWidth: 480 }}>
      <Typography.Paragraph>
        Text above the divider that gives it some context to separate.
      </Typography.Paragraph>
      <Divider {...args} />
      <Typography.Paragraph>Text below the divider.</Typography.Paragraph>
    </div>
  ),
};

export default meta;
type Story = StoryObj<typeof Divider>;

export const Horizontal: Story = {};

export const WithText: Story = {
  render: () => (
    <div style={{ maxWidth: 480 }}>
      <Divider orientation="left">Left</Divider>
      <Typography.Paragraph>Section content.</Typography.Paragraph>
      <Divider orientation="center">Center</Divider>
      <Typography.Paragraph>Section content.</Typography.Paragraph>
      <Divider orientation="right">Right</Divider>
      <Typography.Paragraph>Section content.</Typography.Paragraph>
    </div>
  ),
};

export const Dashed: Story = {
  args: { dashed: true },
};

export const Plain: Story = {
  render: () => (
    <div style={{ maxWidth: 480 }}>
      <Typography.Paragraph>Above.</Typography.Paragraph>
      <Divider plain>Plain text label</Divider>
      <Typography.Paragraph>Below.</Typography.Paragraph>
    </div>
  ),
};

export const Vertical: Story = {
  render: () => (
    <Typography.Text>
      Home
      <Divider type="vertical" />
      Docs
      <Divider type="vertical" />
      Pricing
    </Typography.Text>
  ),
};
