import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Button, DataTable, Tag } from '@repo/design-system';
import { PlusOutlined } from '@ant-design/icons';

interface Project {
  key: string;
  name: string;
  status: 'active' | 'archived';
  owner: string;
}

const data: Project[] = [
  { key: '1', name: 'Apollo', status: 'active', owner: 'Ada Lovelace' },
  { key: '2', name: 'Hermes', status: 'active', owner: 'Alan Turing' },
  { key: '3', name: 'Atlas', status: 'archived', owner: 'Grace Hopper' },
];

const meta = {
  title: 'Patterns/DataTable',
  component: DataTable,
  parameters: { layout: 'padded' },
} satisfies Meta<typeof DataTable<Project>>;

export default meta;
type Story = StoryObj<typeof meta>;

export const WithToolbar: Story = {
  args: {
    title: 'Projetos',
    onSearch: () => {},
    toolbar: (
      <Button type="primary" icon={<PlusOutlined />}>
        Novo projeto
      </Button>
    ),
    rowKey: 'key',
    dataSource: data,
    columns: [
      { title: 'Nome', dataIndex: 'name' },
      {
        title: 'Status',
        dataIndex: 'status',
        render: (s: Project['status']) => (
          <Tag color={s === 'active' ? 'green' : 'default'}>{s}</Tag>
        ),
      },
      { title: 'Responsável', dataIndex: 'owner' },
    ],
  },
};

export const Empty: Story = {
  args: {
    title: 'Projetos',
    rowKey: 'key',
    dataSource: [],
    columns: [
      { title: 'Nome', dataIndex: 'name' },
      { title: 'Status', dataIndex: 'status' },
    ],
  },
};

export const Loading: Story = {
  args: {
    title: 'Projetos',
    loading: true,
    rowKey: 'key',
    dataSource: [],
    columns: [{ title: 'Nome', dataIndex: 'name' }],
  },
};
