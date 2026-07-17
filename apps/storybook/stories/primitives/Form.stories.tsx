import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, fn, userEvent, within } from 'storybook/test';
import { Button, Checkbox, Form, Input, Select, Space, Switch } from '@repo/design-system';

const roleOptions = [
  { label: 'Admin', value: 'admin' },
  { label: 'Editor', value: 'editor' },
  { label: 'Viewer', value: 'viewer' },
];

const meta: Meta<typeof Form> = {
  title: 'Primitives/Form',
  component: Form,
  args: {
    layout: 'vertical',
    onFinish: fn(),
  },
  argTypes: {
    layout: { control: 'select', options: ['vertical', 'horizontal', 'inline'] },
  },
  // A required Form.Item wrapping a Select makes antd put aria-required="true" on
  // the `.ant-select` wrapper div, which axe rejects (the role is on a child, not
  // the div). It's antd's Select+Form markup, not ours, so skip that rule.
  parameters: {
    a11y: { config: { rules: [{ id: 'aria-allowed-attr', enabled: false }] } },
  },
  render: (args) => (
    <Form
      {...args}
      style={{ maxWidth: 480 }}
      labelCol={args.layout === 'horizontal' ? { span: 6 } : undefined}
      wrapperCol={args.layout === 'horizontal' ? { span: 18 } : undefined}
    >
      <Form.Item
        name="name"
        label="Name"
        rules={[{ required: true, message: 'Please enter your name' }]}
      >
        <Input placeholder="Jane Doe" />
      </Form.Item>
      <Form.Item
        name="email"
        label="Email"
        rules={[
          { required: true, message: 'Please enter your email' },
          { type: 'email', message: 'Enter a valid email' },
        ]}
      >
        <Input placeholder="jane@acme.com" />
      </Form.Item>
      <Form.Item
        name="role"
        label="Role"
        rules={[{ required: true, message: 'Please select a role' }]}
      >
        <Select options={roleOptions} placeholder="Select a role" />
      </Form.Item>
      <Form.Item name="notifications" label="Notifications" valuePropName="checked">
        <Switch />
      </Form.Item>
      <Form.Item
        name="agree"
        valuePropName="checked"
        rules={[
          {
            validator: (_, value) =>
              value ? Promise.resolve() : Promise.reject(new Error('You must accept the terms')),
          },
        ]}
      >
        <Checkbox>I accept the terms and conditions</Checkbox>
      </Form.Item>
      <Form.Item>
        <Space>
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
          <Button htmlType="reset">Reset</Button>
        </Space>
      </Form.Item>
    </Form>
  ),
};

export default meta;
type Story = StoryObj<typeof Form>;

export const Vertical: Story = {};

export const Horizontal: Story = {
  args: { layout: 'horizontal' },
};

export const Inline: Story = {
  args: { layout: 'inline' },
  render: (args) => (
    <Form {...args}>
      <Form.Item
        name="query"
        label="Search"
        rules={[{ required: true, message: 'Enter a search term' }]}
      >
        <Input placeholder="Keyword" />
      </Form.Item>
      <Form.Item name="role" label="Role">
        <Select options={roleOptions} placeholder="Any" style={{ width: 140 }} />
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit">
          Filter
        </Button>
      </Form.Item>
    </Form>
  ),
};

export const ValidationOnSubmit: Story = {
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    const submit = canvas.getByRole('button', { name: /submit/i });
    await userEvent.click(submit);

    expect(await canvas.findByText(/please enter your name/i)).toBeInTheDocument();
    expect(args.onFinish).not.toHaveBeenCalled();
  },
};
