import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { fn } from 'storybook/test';
import { Form, Select } from '@repo/design-system';

const options = [
  { label: 'Apple', value: 'apple' },
  { label: 'Banana', value: 'banana' },
  { label: 'Cherry', value: 'cherry' },
  { label: 'Date', value: 'date' },
];

const meta: Meta<typeof Select> = {
  title: 'Primitives/Select',
  component: Select,
  args: {
    options,
    placeholder: 'Select a fruit',
    onChange: fn(),
    style: { width: '100%' },
    // antd Form.Item labels aren't wired to the control without a `name`, so give
    // the combobox its own accessible name for the axe a11y gate.
    'aria-label': 'Fruit',
  },
  argTypes: {
    size: { control: 'select', options: ['small', 'middle', 'large'] },
    status: { control: 'select', options: ['', 'error', 'warning'] },
    disabled: { control: 'boolean' },
  },
  render: (args) => (
    <Form layout="vertical" style={{ maxWidth: 360 }}>
      <Form.Item label="Fruit">
        <Select {...args} />
      </Form.Item>
    </Form>
  ),
};

export default meta;
type Story = StoryObj<typeof Select>;

export const Single: Story = {};

export const Multiple: Story = {
  render: (args) => (
    <Form layout="vertical" style={{ maxWidth: 360 }}>
      <Form.Item label="Fruits">
        <Select {...args} mode="multiple" placeholder="Select fruits" />
      </Form.Item>
    </Form>
  ),
};

export const WithSearch: Story = {
  render: (args) => (
    <Form layout="vertical" style={{ maxWidth: 360 }}>
      <Form.Item label="Searchable fruit">
        <Select {...args} showSearch optionFilterProp="label" />
      </Form.Item>
    </Form>
  ),
};

export const Status: Story = {
  render: (args) => (
    <Form layout="vertical" style={{ maxWidth: 360 }}>
      <Form.Item label="Error" validateStatus="error" help="Required">
        <Select {...args} status="error" />
      </Form.Item>
      <Form.Item label="Warning" validateStatus="warning">
        <Select {...args} status="warning" />
      </Form.Item>
    </Form>
  ),
};

export const Disabled: Story = {
  render: (args) => (
    <Form layout="vertical" style={{ maxWidth: 360 }}>
      <Form.Item label="Disabled">
        <Select {...args} disabled defaultValue="apple" />
      </Form.Item>
    </Form>
  ),
};

export const Sizes: Story = {
  render: (args) => (
    <Form layout="vertical" style={{ maxWidth: 360 }}>
      <Form.Item label="Large">
        <Select {...args} size="large" />
      </Form.Item>
      <Form.Item label="Middle">
        <Select {...args} size="middle" />
      </Form.Item>
      <Form.Item label="Small">
        <Select {...args} size="small" />
      </Form.Item>
    </Form>
  ),
};
