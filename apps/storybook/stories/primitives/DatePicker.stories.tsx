import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { fn } from 'storybook/test';
import { DatePicker, Form } from '@repo/design-system';

const meta: Meta<typeof DatePicker> = {
  title: 'Primitives/DatePicker',
  component: DatePicker,
  args: {
    onChange: fn(),
    style: { width: '100%' },
  },
  argTypes: {
    size: { control: 'select', options: ['small', 'middle', 'large'] },
    disabled: { control: 'boolean' },
  },
  render: (args) => (
    <Form layout="vertical" style={{ maxWidth: 360 }}>
      <Form.Item label="Date">
        <DatePicker {...args} />
      </Form.Item>
    </Form>
  ),
};

export default meta;
type Story = StoryObj<typeof DatePicker>;

export const Basic: Story = {};

export const RangePicker: Story = {
  render: (args) => (
    <Form layout="vertical" style={{ maxWidth: 360 }}>
      <Form.Item label="Date range">
        <DatePicker.RangePicker
          onChange={args.onChange}
          style={{ width: '100%' }}
        />
      </Form.Item>
    </Form>
  ),
};

export const MonthPicker: Story = {
  render: (args) => (
    <Form layout="vertical" style={{ maxWidth: 360 }}>
      <Form.Item label="Month">
        <DatePicker {...args} picker="month" />
      </Form.Item>
    </Form>
  ),
};

export const WithTime: Story = {
  render: (args) => (
    <Form layout="vertical" style={{ maxWidth: 360 }}>
      <Form.Item label="Date and time">
        <DatePicker {...args} showTime />
      </Form.Item>
    </Form>
  ),
};

export const Disabled: Story = {
  render: (args) => (
    <Form layout="vertical" style={{ maxWidth: 360 }}>
      <Form.Item label="Disabled">
        <DatePicker {...args} disabled />
      </Form.Item>
    </Form>
  ),
};
