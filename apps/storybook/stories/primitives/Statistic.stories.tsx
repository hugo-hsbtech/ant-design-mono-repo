import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Statistic, Card, Flex } from '@repo/design-system';
import { ArrowDownOutlined, ArrowUpOutlined, LikeOutlined } from '@ant-design/icons';

const { Countdown } = Statistic;

const meta: Meta<typeof Statistic> = {
  title: 'Primitives/Statistic',
  component: Statistic,
  args: {
    title: 'Active users',
    value: 112893,
  },
};

export default meta;
type Story = StoryObj<typeof Statistic>;

export const Default: Story = {};

export const WithPrefixSuffix: Story = {
  render: () => (
    <Flex gap="large" wrap="wrap">
      <Statistic
        title="Growth"
        value={11.28}
        precision={2}
        valueStyle={{ color: '#3f8600' }}
        prefix={<ArrowUpOutlined />}
        suffix="%"
      />
      <Statistic
        title="Decline"
        value={9.3}
        precision={2}
        valueStyle={{ color: '#cf1322' }}
        prefix={<ArrowDownOutlined />}
        suffix="%"
      />
      <Statistic title="Feedback" value={1128} prefix={<LikeOutlined />} />
    </Flex>
  ),
};

export const CountdownTimer: Story = {
  render: () => (
    <Flex gap="large" wrap="wrap">
      <Countdown title="Launch in" value={Date.now() + 1000 * 60 * 60 * 24} />
      <Countdown
        title="Time remaining"
        value={Date.now() + 1000 * 30}
        format="mm:ss"
      />
    </Flex>
  ),
};

export const Precision: Story = {
  args: {
    title: 'Average rating',
    value: 4.567,
    precision: 2,
    suffix: '/ 5',
  },
};

export const InCard: Story = {
  render: () => (
    <Flex gap="middle" wrap="wrap">
      <Card style={{ width: 220 }}>
        <Statistic
          title="Active users"
          value={11.28}
          precision={2}
          valueStyle={{ color: '#3f8600' }}
          prefix={<ArrowUpOutlined />}
          suffix="%"
        />
      </Card>
      <Card style={{ width: 220 }}>
        <Statistic
          title="Idle"
          value={9.3}
          precision={2}
          valueStyle={{ color: '#cf1322' }}
          prefix={<ArrowDownOutlined />}
          suffix="%"
        />
      </Card>
    </Flex>
  ),
};
