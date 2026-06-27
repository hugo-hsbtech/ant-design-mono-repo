import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, userEvent, within } from 'storybook/test';
import { Button, Space, Tooltip } from '@repo/design-system';
import { InfoCircleOutlined } from '@ant-design/icons';

const meta: Meta<typeof Tooltip> = {
  title: 'Primitives/Tooltip',
  component: Tooltip,
  args: {
    title: 'Helpful tooltip text',
  },
  argTypes: {
    placement: {
      control: 'select',
      options: ['top', 'bottom', 'left', 'right', 'topLeft', 'bottomRight'],
    },
    color: { control: 'text' },
  },
  render: (args) => (
    <Tooltip {...args}>
      <Button>Hover me</Button>
    </Tooltip>
  ),
};

export default meta;
type Story = StoryObj<typeof Tooltip>;

export const Default: Story = {};

export const Placements: Story = {
  render: () => (
    <Space size="large" wrap>
      <Tooltip title="Top" placement="top">
        <Button>Top</Button>
      </Tooltip>
      <Tooltip title="Bottom" placement="bottom">
        <Button>Bottom</Button>
      </Tooltip>
      <Tooltip title="Left" placement="left">
        <Button>Left</Button>
      </Tooltip>
      <Tooltip title="Right" placement="right">
        <Button>Right</Button>
      </Tooltip>
    </Space>
  ),
};

export const Colored: Story = {
  args: { color: '#722ed1', title: 'Purple tooltip' },
};

export const OnIconButton: Story = {
  render: (args) => (
    <Tooltip {...args} title="More information">
      <Button shape="circle" icon={<InfoCircleOutlined />} aria-label="More information" />
    </Tooltip>
  ),
};

export const HoverInteraction: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const trigger = canvas.getByRole('button', { name: /hover me/i });
    await userEvent.hover(trigger);

    const body = within(document.body);
    expect(await body.findByText(/helpful tooltip text/i)).toBeInTheDocument();
  },
};
