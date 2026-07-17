import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Progress, Space } from '@repo/design-system';

const meta: Meta<typeof Progress> = {
  title: 'Primitives/Progress',
  component: Progress,
  args: {
    percent: 60,
    // The progressbar element needs an accessible name for the axe a11y gate.
    'aria-label': 'Progresso',
  },
  argTypes: {
    type: { control: 'select', options: ['line', 'circle', 'dashboard'] },
    status: { control: 'select', options: ['normal', 'active', 'success', 'exception'] },
    percent: { control: { type: 'range', min: 0, max: 100 } },
  },
  render: (args) => (
    <div style={{ maxWidth: 480 }}>
      <Progress {...args} />
    </div>
  ),
};

export default meta;
type Story = StoryObj<typeof Progress>;

export const Line: Story = {};

export const Circle: Story = {
  args: { type: 'circle' },
  render: (args) => <Progress {...args} />,
};

export const Dashboard: Story = {
  args: { type: 'dashboard' },
  render: (args) => <Progress {...args} />,
};

export const Steps: Story = {
  args: { percent: 50, steps: 5 },
};

export const Statuses: Story = {
  render: (args) => (
    <Space direction="vertical" style={{ width: 480 }}>
      <Progress {...args} percent={30} status="active" />
      <Progress {...args} percent={70} status="exception" />
      <Progress {...args} percent={100} status="success" />
    </Space>
  ),
};
