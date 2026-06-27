import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Descriptions, Badge } from '@repo/design-system';
import type { DescriptionsProps } from '@repo/design-system';

const items: DescriptionsProps['items'] = [
  { key: '1', label: 'Project', children: 'Apollo' },
  { key: '2', label: 'Owner', children: 'Ada Lovelace' },
  { key: '3', label: 'Billing mode', children: 'Prepaid' },
  { key: '4', label: 'Automatic renewal', children: 'Yes' },
  { key: '5', label: 'Order time', children: '2026-06-01 09:42:11' },
  {
    key: '6',
    label: 'Status',
    children: <Badge status="processing" text="Running" />,
    span: 3,
  },
  {
    key: '7',
    label: 'Notes',
    children: 'Data disk type: MongoDB. Network bandwidth: 50 Mbps.',
    span: 3,
  },
];

const meta: Meta<typeof Descriptions> = {
  title: 'Primitives/Descriptions',
  component: Descriptions,
  args: {
    title: 'Project info',
    items,
  },
  argTypes: {
    bordered: { control: 'boolean' },
    size: { control: 'select', options: ['default', 'middle', 'small'] },
    layout: { control: 'select', options: ['horizontal', 'vertical'] },
  },
};

export default meta;
type Story = StoryObj<typeof Descriptions>;

export const Default: Story = {};

export const Bordered: Story = {
  args: {
    bordered: true,
  },
};

export const Sizes: Story = {
  args: {
    bordered: true,
    size: 'small',
  },
};

export const ResponsiveColumn: Story = {
  args: {
    bordered: true,
    column: { xs: 1, sm: 2, md: 3 },
  },
};

export const VerticalLayout: Story = {
  args: {
    bordered: true,
    layout: 'vertical',
  },
};
