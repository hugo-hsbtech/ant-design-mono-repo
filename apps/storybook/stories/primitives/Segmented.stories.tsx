import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, userEvent, within } from 'storybook/test';
import { Segmented, Space } from '@repo/design-system';
import { AppstoreOutlined, BarsOutlined, CalendarOutlined } from '@ant-design/icons';

const meta: Meta<typeof Segmented> = {
  title: 'Primitives/Segmented',
  component: Segmented,
  args: {
    options: ['Daily', 'Weekly', 'Monthly', 'Yearly'],
  },
  argTypes: {
    size: { control: 'select', options: ['small', 'middle', 'large'] },
    block: { control: 'boolean' },
    disabled: { control: 'boolean' },
  },
};

export default meta;
type Story = StoryObj<typeof Segmented>;

export const Default: Story = {};

export const WithIcons: Story = {
  args: {
    options: [
      { label: 'List', value: 'List', icon: <BarsOutlined /> },
      { label: 'Grid', value: 'Grid', icon: <AppstoreOutlined /> },
      { label: 'Calendar', value: 'Calendar', icon: <CalendarOutlined /> },
    ],
  },
};

export const Sizes: Story = {
  render: (args) => (
    <Space direction="vertical">
      <Segmented {...args} size="large" />
      <Segmented {...args} size="middle" />
      <Segmented {...args} size="small" />
    </Space>
  ),
};

export const Disabled: Story = {
  args: {
    disabled: true,
  },
};

export const Block: Story = {
  args: {
    block: true,
  },
  render: (args) => (
    <div style={{ width: 480 }}>
      <Segmented {...args} />
    </div>
  ),
};

export const SelectInteraction: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const weekly = canvas.getByRole('radio', { name: 'Weekly' });
    // antd Segmented sets pointer-events:none on the radio input (the label
    // handles the click), so skip userEvent's pointer-events guard.
    await userEvent.click(weekly, { pointerEventsCheck: 0 });
    await expect(weekly).toBeChecked();
  },
};
