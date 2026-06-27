import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Tree } from '@repo/design-system';
import type { TreeDataNode } from '@repo/design-system';
import { CarryOutOutlined, FormOutlined } from '@ant-design/icons';

const treeData: TreeDataNode[] = [
  {
    title: 'Apollo',
    key: '0-0',
    children: [
      {
        title: 'Frontend',
        key: '0-0-0',
        children: [
          { title: 'Components', key: '0-0-0-0' },
          { title: 'Pages', key: '0-0-0-1' },
        ],
      },
      {
        title: 'Backend',
        key: '0-0-1',
        children: [
          { title: 'API', key: '0-0-1-0' },
          { title: 'Workers', key: '0-0-1-1' },
        ],
      },
    ],
  },
  {
    title: 'Hermes',
    key: '0-1',
    children: [
      { title: 'Infra', key: '0-1-0' },
      { title: 'Docs', key: '0-1-1' },
    ],
  },
];

const meta: Meta<typeof Tree> = {
  title: 'Primitives/Tree',
  component: Tree,
  args: {
    treeData,
    defaultExpandedKeys: ['0-0', '0-0-0'],
  },
  argTypes: {
    checkable: { control: 'boolean' },
    showLine: { control: 'boolean' },
  },
};

export default meta;
type Story = StoryObj<typeof Tree>;

export const Default: Story = {};

export const Checkable: Story = {
  args: {
    checkable: true,
    defaultCheckedKeys: ['0-0-0-0'],
    defaultExpandedKeys: ['0-0', '0-0-0'],
  },
};

export const DefaultExpanded: Story = {
  args: {
    defaultExpandAll: true,
  },
};

const iconTreeData: TreeDataNode[] = [
  {
    title: 'Tasks',
    key: '1',
    icon: <CarryOutOutlined />,
    children: [
      { title: 'Draft spec', key: '1-0', icon: <FormOutlined /> },
      { title: 'Review', key: '1-1', icon: <CarryOutOutlined /> },
    ],
  },
];

export const WithIcons: Story = {
  args: {
    showIcon: true,
    treeData: iconTreeData,
    defaultExpandedKeys: ['1'],
  },
};
