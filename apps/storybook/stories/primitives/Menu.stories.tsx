import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, fn, userEvent, within } from 'storybook/test';
import { Menu } from '@repo/design-system';
import type { MenuProps } from '@repo/design-system';
import {
  AppstoreOutlined,
  MailOutlined,
  SettingOutlined,
} from '@ant-design/icons';

const horizontalItems: MenuProps['items'] = [
  { key: 'mail', icon: <MailOutlined />, label: 'Navigation One' },
  { key: 'app', icon: <AppstoreOutlined />, label: 'Navigation Two' },
  {
    key: 'sub',
    icon: <SettingOutlined />,
    label: 'Navigation Three',
    children: [
      { key: 'opt1', label: 'Option 1' },
      { key: 'opt2', label: 'Option 2' },
    ],
  },
  { key: 'link', label: 'Navigation Four' },
];

const inlineItems: MenuProps['items'] = [
  {
    key: 'sub1',
    icon: <MailOutlined />,
    label: 'Navigation One',
    children: [
      {
        type: 'group',
        label: 'Item 1',
        children: [
          { key: '1', label: 'Option 1' },
          { key: '2', label: 'Option 2' },
        ],
      },
      {
        type: 'group',
        label: 'Item 2',
        children: [
          { key: '3', label: 'Option 3' },
          { key: '4', label: 'Option 4' },
        ],
      },
    ],
  },
  {
    key: 'sub2',
    icon: <AppstoreOutlined />,
    label: 'Navigation Two',
    children: [
      { key: '5', label: 'Option 5' },
      { key: '6', label: 'Option 6' },
    ],
  },
  { type: 'divider' },
  {
    key: 'sub3',
    icon: <SettingOutlined />,
    label: 'Navigation Three',
    children: [
      { key: '7', label: 'Option 7' },
      { key: '8', label: 'Option 8' },
    ],
  },
];

const meta: Meta<typeof Menu> = {
  title: 'Primitives/Menu',
  component: Menu,
  args: {
    items: horizontalItems,
    mode: 'horizontal',
    onClick: fn(),
  },
};

export default meta;
type Story = StoryObj<typeof Menu>;

export const Horizontal: Story = {
  args: { mode: 'horizontal', defaultSelectedKeys: ['mail'] },
};

export const Inline: Story = {
  args: {
    mode: 'inline',
    items: inlineItems,
    defaultOpenKeys: ['sub1'],
    style: { width: 256 },
  },
};

export const Dark: Story = {
  args: {
    mode: 'inline',
    theme: 'dark',
    items: inlineItems,
    defaultOpenKeys: ['sub1'],
    style: { width: 256 },
  },
};

export const Selectable: Story = {
  args: {
    mode: 'horizontal',
    defaultSelectedKeys: ['app'],
  },
};

export const ClickInteraction: Story = {
  args: { mode: 'horizontal' },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    const item = canvas.getByText('Navigation One');
    await userEvent.click(item);
    await expect(args.onClick).toHaveBeenCalled();
  },
};
