import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { fn } from 'storybook/test';
import { Form, InputNumber } from '@repo/design-system';

const meta: Meta<typeof InputNumber> = {
  title: 'Primitives/InputNumber',
  component: InputNumber,
  args: {
    defaultValue: 3,
    onChange: fn(),
  },
  argTypes: {
    size: { control: 'select', options: ['small', 'middle', 'large'] },
    min: { control: 'number' },
    max: { control: 'number' },
    step: { control: 'number' },
    disabled: { control: 'boolean' },
  },
  render: (args) => (
    <Form layout="vertical" style={{ maxWidth: 320 }}>
      <Form.Item label="Quantity">
        <InputNumber {...args} style={{ width: '100%' }} />
      </Form.Item>
    </Form>
  ),
};

export default meta;
type Story = StoryObj<typeof InputNumber>;

export const Default: Story = {};

export const MinMaxStep: Story = {
  render: (args) => (
    <Form layout="vertical" style={{ maxWidth: 320 }}>
      <Form.Item label="0 to 10, step 2">
        <InputNumber {...args} min={0} max={10} step={2} style={{ width: '100%' }} />
      </Form.Item>
    </Form>
  ),
};

export const WithAddon: Story = {
  render: (args) => (
    <Form layout="vertical" style={{ maxWidth: 320 }}>
      <Form.Item label="Weight">
        <InputNumber {...args} addonBefore="≈" addonAfter="kg" style={{ width: '100%' }} />
      </Form.Item>
    </Form>
  ),
};

export const Formatter: Story = {
  render: (args) => (
    <Form layout="vertical" style={{ maxWidth: 320 }}>
      <Form.Item label="Price">
        <InputNumber
          {...args}
          defaultValue={1000}
          formatter={(value) => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
          parser={(value) => (value ? Number(value.replace(/\$\s?|(,*)/g, '')) : 0)}
          style={{ width: '100%' }}
        />
      </Form.Item>
    </Form>
  ),
};

export const Sizes: Story = {
  render: (args) => (
    <Form layout="vertical" style={{ maxWidth: 320 }}>
      <Form.Item label="Large">
        <InputNumber {...args} size="large" style={{ width: '100%' }} />
      </Form.Item>
      <Form.Item label="Middle">
        <InputNumber {...args} size="middle" style={{ width: '100%' }} />
      </Form.Item>
      <Form.Item label="Small">
        <InputNumber {...args} size="small" style={{ width: '100%' }} />
      </Form.Item>
    </Form>
  ),
};

export const Disabled: Story = {
  render: (args) => (
    <Form layout="vertical" style={{ maxWidth: 320 }}>
      <Form.Item label="Disabled">
        <InputNumber {...args} disabled style={{ width: '100%' }} />
      </Form.Item>
    </Form>
  ),
};
