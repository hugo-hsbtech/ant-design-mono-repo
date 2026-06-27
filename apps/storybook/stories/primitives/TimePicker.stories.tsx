import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { fn } from 'storybook/test';
import { Form, TimePicker } from '@repo/design-system';

const meta: Meta<typeof TimePicker> = {
  title: 'Primitives/TimePicker',
  component: TimePicker,
  args: {
    onChange: fn(),
    style: { width: '100%' },
  },
  argTypes: {
    size: { control: 'select', options: ['small', 'middle', 'large'] },
    disabled: { control: 'boolean' },
  },
  render: (args) => (
    <Form layout="vertical" style={{ maxWidth: 320 }}>
      <Form.Item label="Time">
        <TimePicker {...args} />
      </Form.Item>
    </Form>
  ),
};

export default meta;
type Story = StoryObj<typeof TimePicker>;

export const Basic: Story = {};

export const CustomFormat: Story = {
  render: (args) => (
    <Form layout="vertical" style={{ maxWidth: 320 }}>
      <Form.Item label="Hours and minutes">
        <TimePicker {...args} format="HH:mm" />
      </Form.Item>
    </Form>
  ),
};

export const TwelveHours: Story = {
  render: (args) => (
    <Form layout="vertical" style={{ maxWidth: 320 }}>
      <Form.Item label="12-hour time">
        <TimePicker {...args} use12Hours format="h:mm a" />
      </Form.Item>
    </Form>
  ),
};

export const Disabled: Story = {
  render: (args) => (
    <Form layout="vertical" style={{ maxWidth: 320 }}>
      <Form.Item label="Disabled">
        <TimePicker {...args} disabled />
      </Form.Item>
    </Form>
  ),
};
