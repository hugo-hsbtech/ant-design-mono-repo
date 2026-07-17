import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { fn } from 'storybook/test';
import { AutoComplete, Form } from '@repo/design-system';

const options = [
  { value: 'Apple' },
  { value: 'Apricot' },
  { value: 'Banana' },
  { value: 'Blueberry' },
  { value: 'Cherry' },
];

const meta: Meta<typeof AutoComplete> = {
  title: 'Primitives/AutoComplete',
  component: AutoComplete,
  args: {
    options,
    placeholder: 'Type a fruit',
    onChange: fn(),
    style: { width: '100%' },
    // antd Form.Item labels aren't wired to the control without a `name`, so give
    // the input its own accessible name for the axe a11y gate.
    'aria-label': 'Fruit',
  },
  argTypes: {
    size: { control: 'select', options: ['small', 'middle', 'large'] },
    disabled: { control: 'boolean' },
  },
  render: (args) => (
    <Form layout="vertical" style={{ maxWidth: 360 }}>
      <Form.Item label="Fruit">
        <AutoComplete {...args} />
      </Form.Item>
    </Form>
  ),
};

export default meta;
type Story = StoryObj<typeof AutoComplete>;

export const Default: Story = {};

export const WithFilter: Story = {
  render: (args) => (
    <Form layout="vertical" style={{ maxWidth: 360 }}>
      <Form.Item label="Filtered fruit">
        <AutoComplete
          {...args}
          filterOption={(inputValue, option) =>
            (option?.value as string)
              .toUpperCase()
              .indexOf(inputValue.toUpperCase()) !== -1
          }
        />
      </Form.Item>
    </Form>
  ),
};

export const Disabled: Story = {
  render: (args) => (
    <Form layout="vertical" style={{ maxWidth: 360 }}>
      <Form.Item label="Disabled">
        <AutoComplete {...args} disabled defaultValue="Apple" />
      </Form.Item>
    </Form>
  ),
};

export const Sizes: Story = {
  render: (args) => (
    <Form layout="vertical" style={{ maxWidth: 360 }}>
      <Form.Item label="Large">
        <AutoComplete {...args} size="large" />
      </Form.Item>
      <Form.Item label="Middle">
        <AutoComplete {...args} size="middle" />
      </Form.Item>
      <Form.Item label="Small">
        <AutoComplete {...args} size="small" />
      </Form.Item>
    </Form>
  ),
};
