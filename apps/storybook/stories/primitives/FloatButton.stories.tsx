import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { FloatButton } from '@repo/design-system';
import {
  CommentOutlined,
  CustomerServiceOutlined,
  QuestionCircleOutlined,
  SyncOutlined,
} from '@ant-design/icons';

const meta: Meta<typeof FloatButton> = {
  title: 'Primitives/FloatButton',
  component: FloatButton,
  parameters: {
    layout: 'fullscreen',
  },
  args: {
    icon: <QuestionCircleOutlined />,
    'aria-label': 'Help',
  },
};

export default meta;
type Story = StoryObj<typeof FloatButton>;

export const Single: Story = {
  render: (args) => (
    <div style={{ height: 320, position: 'relative' }}>
      <FloatButton {...args} />
    </div>
  ),
};

export const Primary: Story = {
  render: () => (
    <div style={{ height: 320, position: 'relative' }}>
      <FloatButton
        type="primary"
        icon={<CommentOutlined />}
        aria-label="Feedback"
      />
    </div>
  ),
};

export const WithTooltip: Story = {
  render: () => (
    <div style={{ height: 320, position: 'relative' }}>
      <FloatButton
        icon={<QuestionCircleOutlined />}
        tooltip="Documentation"
        aria-label="Documentation"
      />
    </div>
  ),
};

export const WithBadge: Story = {
  render: () => (
    <div style={{ height: 320, position: 'relative' }}>
      <FloatButton
        icon={<CommentOutlined />}
        badge={{ count: 5 }}
        aria-label="Messages"
      />
    </div>
  ),
};

export const GroupMenu: Story = {
  render: () => (
    <div style={{ height: 320, position: 'relative' }}>
      <FloatButton.Group
        trigger="hover"
        type="primary"
        icon={<CustomerServiceOutlined />}
      >
        <FloatButton
          icon={<CommentOutlined />}
          tooltip="Comment"
          aria-label="Comment"
        />
        <FloatButton
          icon={<SyncOutlined />}
          tooltip="Sync"
          aria-label="Sync"
        />
      </FloatButton.Group>
    </div>
  ),
};

export const BackTop: Story = {
  render: () => (
    <div style={{ height: 320, position: 'relative' }}>
      <FloatButton.BackTop visibilityHeight={0} aria-label="Back to top" />
    </div>
  ),
};
