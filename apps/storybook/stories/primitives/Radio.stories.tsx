import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, fn, userEvent, within } from 'storybook/test';
import { Radio, Space } from '@repo/design-system';

const options = [
  { label: 'Small', value: 'small' },
  { label: 'Medium', value: 'medium' },
  { label: 'Large', value: 'large' },
];

const meta: Meta<typeof Radio.Group> = {
  title: 'Primitives/Radio',
  component: Radio.Group,
  args: {
    options,
    defaultValue: 'medium',
    onChange: fn(),
  },
  argTypes: {
    disabled: { control: 'boolean' },
  },
  render: (args) => <Radio.Group {...args} aria-label="Size selection" />,
};

export default meta;
type Story = StoryObj<typeof Radio.Group>;

export const Group: Story = {};

export const ButtonGroup: Story = {
  render: (args) => (
    <Radio.Group {...args} optionType="button" buttonStyle="solid" aria-label="Size selection" />
  ),
};

export const Sizes: Story = {
  render: (args) => (
    <Space direction="vertical">
      <Radio.Group {...args} optionType="button" size="large" aria-label="Large sizes" />
      <Radio.Group {...args} optionType="button" size="middle" aria-label="Middle sizes" />
      <Radio.Group {...args} optionType="button" size="small" aria-label="Small sizes" />
    </Space>
  ),
};

export const Disabled: Story = {
  render: (args) => <Radio.Group {...args} disabled aria-label="Size selection" />,
};

export const Vertical: Story = {
  render: (args) => (
    <Radio.Group {...args} aria-label="Size selection">
      <Space direction="vertical">
        <Radio value="small">Small</Radio>
        <Radio value="medium">Medium</Radio>
        <Radio value="large">Large</Radio>
      </Space>
    </Radio.Group>
  ),
};

export const SelectInteraction: Story = {
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    const radio = canvas.getByRole('radio', { name: /large/i });
    await userEvent.click(radio);
    await expect(args.onChange).toHaveBeenCalled();
    await expect(radio).toBeChecked();
  },
};
