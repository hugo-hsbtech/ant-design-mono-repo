import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, fn, userEvent, within } from 'storybook/test';
import { CheckOutlined, CloseOutlined } from '@ant-design/icons';
import { Space, Switch } from '@repo/design-system';

// antd's SwitchProps type omits aria-* (the underlying button forwards them at
// runtime), so apply the accessible name via an untyped spread.
const label = (value: string): Record<string, string> => ({ 'aria-label': value });

const meta: Meta<typeof Switch> = {
  title: 'Primitives/Switch',
  component: Switch,
  args: {
    defaultChecked: true,
    onChange: fn(),
  },
  argTypes: {
    size: { control: 'select', options: ['default', 'small'] },
    disabled: { control: 'boolean' },
    loading: { control: 'boolean' },
  },
  render: (args) => <Switch {...args} {...label('Toggle setting')} />,
};

export default meta;
type Story = StoryObj<typeof Switch>;

export const Default: Story = {};

export const Sizes: Story = {
  render: (args) => (
    <Space>
      <Switch {...args} size="default" {...label('Default size')} />
      <Switch {...args} size="small" {...label('Small size')} />
    </Space>
  ),
};

export const Loading: Story = {
  render: (args) => (
    <Space>
      <Switch {...args} loading {...label('Loading on')} />
      <Switch {...args} loading defaultChecked={false} {...label('Loading off')} />
    </Space>
  ),
};

export const Disabled: Story = {
  render: (args) => (
    <Space>
      <Switch {...args} disabled {...label('Disabled on')} />
      <Switch {...args} disabled defaultChecked={false} {...label('Disabled off')} />
    </Space>
  ),
};

export const WithChildren: Story = {
  render: (args) => (
    <Space>
      <Switch {...args} checkedChildren="On" unCheckedChildren="Off" {...label('Text toggle')} />
      <Switch
        {...args}
        checkedChildren={<CheckOutlined />}
        unCheckedChildren={<CloseOutlined />}
        {...label('Icon toggle')}
      />
    </Space>
  ),
};

export const ToggleInteraction: Story = {
  args: { defaultChecked: false },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    const sw = canvas.getByRole('switch', { name: /toggle setting/i });
    await userEvent.click(sw);
    await expect(args.onChange).toHaveBeenCalledTimes(1);
    await expect(sw).toBeChecked();
  },
};
