import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { List, Avatar, Card, Button } from '@repo/design-system';

interface Person {
  name: string;
  description: string;
  seed: string;
}

const people: Person[] = [
  { name: 'Ada Lovelace', description: 'Lead engineer, Apollo', seed: 'ada' },
  { name: 'Alan Turing', description: 'Architect, Hermes', seed: 'alan' },
  { name: 'Grace Hopper', description: 'Principal, Atlas', seed: 'grace' },
  { name: 'Katherine Johnson', description: 'Analyst, Vesta', seed: 'kath' },
];

const meta: Meta<typeof List> = {
  title: 'Primitives/List',
  component: List,
  args: {
    bordered: true,
    dataSource: ['Apollo', 'Hermes', 'Atlas', 'Orion'],
    renderItem: (item) => <List.Item>{String(item)}</List.Item>,
    style: { maxWidth: 480 },
  },
};

export default meta;
type Story = StoryObj<typeof List>;

export const Default: Story = {};

export const WithPagination: Story = {
  args: {
    dataSource: Array.from({ length: 12 }, (_, i) => `Item ${i + 1}`),
    pagination: { pageSize: 4 },
    renderItem: (item) => <List.Item>{String(item)}</List.Item>,
  },
};

export const WithItemMeta: Story = {
  args: {
    itemLayout: 'horizontal',
    dataSource: people,
    bordered: false,
    renderItem: (item) => {
      const person = item as Person;
      return (
        <List.Item actions={[<Button key="view" type="link">View</Button>]}>
        <List.Item.Meta
          avatar={
            <Avatar
              src={`https://api.dicebear.com/7.x/miniavs/svg?seed=${person.seed}`}
              alt={`${person.name} avatar`}
            />
          }
            title={person.name}
            description={person.description}
          />
        </List.Item>
      );
    },
  },
};

export const Loading: Story = {
  args: {
    loading: true,
    dataSource: [],
    renderItem: (item) => <List.Item>{String(item)}</List.Item>,
  },
};

export const Grid: Story = {
  args: {
    bordered: false,
    grid: { gutter: 16, column: 2 },
    dataSource: people,
    style: { maxWidth: 640 },
    renderItem: (item) => {
      const person = item as Person;
      return (
        <List.Item>
          <Card size="small" title={person.name}>
            {person.description}
          </Card>
        </List.Item>
      );
    },
  },
};
