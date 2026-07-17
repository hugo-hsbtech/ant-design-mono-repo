import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Table, Tag, Space, Typography } from '@repo/design-system';
import type { TableProps } from '@repo/design-system';

const { Text } = Typography;

interface Project {
  key: string;
  name: string;
  owner: string;
  status: 'active' | 'paused' | 'archived';
  budget: number;
}

const dataSource: Project[] = [
  { key: '1', name: 'Apollo', owner: 'Ada Lovelace', status: 'active', budget: 120000 },
  { key: '2', name: 'Hermes', owner: 'Alan Turing', status: 'active', budget: 85000 },
  { key: '3', name: 'Atlas', owner: 'Grace Hopper', status: 'paused', budget: 64000 },
  { key: '4', name: 'Vesta', owner: 'Katherine Johnson', status: 'archived', budget: 41000 },
  { key: '5', name: 'Orion', owner: 'Edsger Dijkstra', status: 'active', budget: 99000 },
];

// Solid (white-on-dark) status colors instead of antd's tinted presets, which
// render colored-text-on-tint below the 4.5:1 WCAG AA contrast threshold.
const statusColor: Record<Project['status'], string> = {
  active: '#166534',
  paused: '#92400E',
  archived: 'default',
};

const columns: TableProps<Project>['columns'] = [
  { title: 'Project', dataIndex: 'name', key: 'name' },
  { title: 'Owner', dataIndex: 'owner', key: 'owner' },
  {
    title: 'Status',
    dataIndex: 'status',
    key: 'status',
    render: (status: Project['status']) => (
      <Tag color={statusColor[status]}>{status.toUpperCase()}</Tag>
    ),
    filters: [
      { text: 'Active', value: 'active' },
      { text: 'Paused', value: 'paused' },
      { text: 'Archived', value: 'archived' },
    ],
    onFilter: (value, record) => record.status === value,
  },
  {
    title: 'Budget',
    dataIndex: 'budget',
    key: 'budget',
    align: 'right',
    sorter: (a, b) => a.budget - b.budget,
    render: (budget: number) => <Text>${budget.toLocaleString('en-US')}</Text>,
  },
];

const meta: Meta<typeof Table<Project>> = {
  title: 'Primitives/Table',
  component: Table,
  args: {
    columns,
    dataSource,
    rowKey: 'key',
  },
};

export default meta;
type Story = StoryObj<typeof Table<Project>>;

export const Default: Story = {};

export const Pagination: Story = {
  args: {
    pagination: { pageSize: 3 },
  },
};

export const RowSelection: Story = {
  args: {
    rowSelection: {
      type: 'checkbox',
      // Selection checkboxes have no visible label; name them for the axe gate.
      // antd forwards aria-* to the input at runtime but doesn't type it on the
      // checkbox props, so cast to the expected return type.
      getCheckboxProps: (record) =>
        ({ 'aria-label': `Select ${record.name}` }) as unknown as ReturnType<
          NonNullable<NonNullable<TableProps<Project>['rowSelection']>['getCheckboxProps']>
        >,
    },
  },
};

export const Sizes: Story = {
  render: (args) => (
    <Space direction="vertical" size="large" style={{ width: '100%' }}>
      <Table {...args} size="large" pagination={false} />
      <Table {...args} size="middle" pagination={false} />
      <Table {...args} size="small" pagination={false} />
    </Space>
  ),
};

export const Loading: Story = {
  args: {
    loading: true,
  },
};

export const Bordered: Story = {
  args: {
    bordered: true,
  },
};
