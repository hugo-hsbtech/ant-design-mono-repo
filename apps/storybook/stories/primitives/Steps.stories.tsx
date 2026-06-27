import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { fn } from 'storybook/test';
import { Steps } from '@repo/design-system';
import type { StepsProps } from '@repo/design-system';
import {
  LoadingOutlined,
  SolutionOutlined,
  SmileOutlined,
  UserOutlined,
} from '@ant-design/icons';

const basicItems: StepsProps['items'] = [
  { title: 'Finished', description: 'This is a description.' },
  { title: 'In Progress', description: 'This is a description.' },
  { title: 'Waiting', description: 'This is a description.' },
];

const meta: Meta<typeof Steps> = {
  title: 'Primitives/Steps',
  component: Steps,
  args: {
    current: 1,
    items: basicItems,
  },
};

export default meta;
type Story = StoryObj<typeof Steps>;

export const Horizontal: Story = {};

export const Vertical: Story = {
  args: { direction: 'vertical', current: 1 },
};

export const CurrentStep: Story = {
  args: { current: 2 },
};

export const ErrorStatus: Story = {
  args: { current: 1, status: 'error' },
};

export const SmallSize: Story = {
  args: { size: 'small', current: 1 },
};

export const WithIcons: Story = {
  args: {
    current: 1,
    items: [
      { title: 'Login', status: 'finish', icon: <UserOutlined /> },
      { title: 'Verification', status: 'finish', icon: <SolutionOutlined /> },
      { title: 'Pay', status: 'process', icon: <LoadingOutlined /> },
      { title: 'Done', status: 'wait', icon: <SmileOutlined /> },
    ],
  },
};

export const Clickable: Story = {
  args: {
    current: 0,
    onChange: fn(),
    items: [
      { title: 'Step 1', description: 'Click to navigate.' },
      { title: 'Step 2', description: 'Click to navigate.' },
      { title: 'Step 3', description: 'Click to navigate.' },
    ],
  },
};
