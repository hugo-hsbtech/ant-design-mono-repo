import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, fn, userEvent, within } from 'storybook/test';
import { Form, Input } from '@repo/design-system';
import { LockOutlined, UserOutlined } from '@ant-design/icons';

const meta: Meta<typeof Input> = {
  title: 'Primitives/Input',
  component: Input,
  args: {
    placeholder: 'Type here',
    onChange: fn(),
  },
  argTypes: {
    variant: { control: 'select', options: ['outlined', 'filled', 'borderless'] },
    size: { control: 'select', options: ['small', 'middle', 'large'] },
    status: { control: 'select', options: ['', 'error', 'warning'] },
    disabled: { control: 'boolean' },
  },
  render: (args) => (
    <Form layout="vertical" style={{ maxWidth: 360 }}>
      <Form.Item label="Name">
        <Input {...args} />
      </Form.Item>
    </Form>
  ),
};

export default meta;
type Story = StoryObj<typeof Input>;

export const Default: Story = {};

export const Variants: Story = {
  render: (args) => (
    <Form layout="vertical" style={{ maxWidth: 360 }}>
      <Form.Item label="Outlined">
        <Input {...args} variant="outlined" />
      </Form.Item>
      <Form.Item label="Filled">
        <Input {...args} variant="filled" />
      </Form.Item>
      <Form.Item label="Borderless">
        <Input {...args} variant="borderless" />
      </Form.Item>
    </Form>
  ),
};

export const Sizes: Story = {
  render: (args) => (
    <Form layout="vertical" style={{ maxWidth: 360 }}>
      <Form.Item label="Large">
        <Input {...args} size="large" />
      </Form.Item>
      <Form.Item label="Middle">
        <Input {...args} size="middle" />
      </Form.Item>
      <Form.Item label="Small">
        <Input {...args} size="small" />
      </Form.Item>
    </Form>
  ),
};

export const Status: Story = {
  render: (args) => (
    <Form layout="vertical" style={{ maxWidth: 360 }}>
      <Form.Item label="Error" validateStatus="error" help="Required field">
        <Input {...args} status="error" />
      </Form.Item>
      <Form.Item label="Warning" validateStatus="warning">
        <Input {...args} status="warning" />
      </Form.Item>
      <Form.Item label="Disabled">
        <Input {...args} disabled />
      </Form.Item>
    </Form>
  ),
};

export const PrefixSuffixAddon: Story = {
  render: (args) => (
    <Form layout="vertical" style={{ maxWidth: 360 }}>
      <Form.Item label="With prefix">
        <Input {...args} prefix={<UserOutlined />} placeholder="Username" />
      </Form.Item>
      <Form.Item label="With suffix">
        <Input {...args} suffix=".com" placeholder="domain" />
      </Form.Item>
      <Form.Item label="With addon">
        <Input {...args} addonBefore="https://" addonAfter=".com" placeholder="site" />
      </Form.Item>
    </Form>
  ),
};

export const Specialized: Story = {
  render: (args) => (
    <Form layout="vertical" style={{ maxWidth: 360 }}>
      <Form.Item label="Password">
        <Input.Password {...args} prefix={<LockOutlined />} placeholder="Password" />
      </Form.Item>
      <Form.Item label="Search">
        <Input.Search {...args} placeholder="Search" enterButton />
      </Form.Item>
      <Form.Item label="Text area">
        <Input.TextArea rows={3} placeholder="Description" />
      </Form.Item>
    </Form>
  ),
};

export const TypingInteraction: Story = {
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByRole('textbox');
    await userEvent.type(input, 'Hello');
    await expect(args.onChange).toHaveBeenCalled();
    await expect(input).toHaveValue('Hello');
  },
};
