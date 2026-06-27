import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, userEvent, within } from 'storybook/test';
import { Tabs } from '@repo/design-system';
import type { TabsProps } from '@repo/design-system';
import { AppleOutlined, AndroidOutlined, WindowsOutlined } from '@ant-design/icons';

const items: TabsProps['items'] = [
  { key: '1', label: 'Overview', children: 'Overview content panel.' },
  { key: '2', label: 'Activity', children: 'Activity content panel.' },
  { key: '3', label: 'Settings', children: 'Settings content panel.' },
];

const meta: Meta<typeof Tabs> = {
  title: 'Primitives/Tabs',
  component: Tabs,
  args: {
    items,
    defaultActiveKey: '1',
  },
  argTypes: {
    type: { control: 'select', options: ['line', 'card', 'editable-card'] },
    tabPosition: { control: 'select', options: ['top', 'right', 'bottom', 'left'] },
    size: { control: 'select', options: ['small', 'middle', 'large'] },
  },
};

export default meta;
type Story = StoryObj<typeof Tabs>;

export const Default: Story = {};

export const CardType: Story = {
  args: {
    type: 'card',
  },
};

export const WithIcons: Story = {
  args: {
    items: [
      { key: '1', label: 'Apple', icon: <AppleOutlined />, children: 'Apple content.' },
      { key: '2', label: 'Android', icon: <AndroidOutlined />, children: 'Android content.' },
      { key: '3', label: 'Windows', icon: <WindowsOutlined />, children: 'Windows content.' },
    ],
  },
};

export const Position: Story = {
  args: {
    tabPosition: 'left',
  },
};

export const DisabledTab: Story = {
  args: {
    items: [
      { key: '1', label: 'Enabled', children: 'Enabled content.' },
      { key: '2', label: 'Disabled', children: 'Disabled content.', disabled: true },
      { key: '3', label: 'Also enabled', children: 'Also enabled content.' },
    ],
  },
};

export const SwitchTabInteraction: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText('Overview content panel.')).toBeInTheDocument();
    await userEvent.click(canvas.getByRole('tab', { name: 'Activity' }));
    await expect(canvas.getByText('Activity content panel.')).toBeInTheDocument();
  },
};
