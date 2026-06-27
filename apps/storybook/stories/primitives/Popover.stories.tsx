import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, userEvent, within } from 'storybook/test';
import { Button, Popover, Space, Typography } from '@repo/design-system';

const Content = () => (
  <div style={{ maxWidth: 220 }}>
    <Typography.Paragraph>This is the popover content with some details.</Typography.Paragraph>
    <Space>
      <Button size="small">Cancel</Button>
      <Button size="small" type="primary">
        Confirm
      </Button>
    </Space>
  </div>
);

const meta: Meta<typeof Popover> = {
  title: 'Primitives/Popover',
  component: Popover,
  args: {
    title: 'Popover title',
    trigger: 'click',
  },
  argTypes: {
    trigger: { control: 'select', options: ['click', 'hover', 'focus'] },
    placement: {
      control: 'select',
      options: ['top', 'bottom', 'left', 'right', 'topLeft', 'bottomRight'],
    },
  },
  render: (args) => (
    <Popover {...args} content={<Content />}>
      <Button type="primary">Open popover</Button>
    </Popover>
  ),
};

export default meta;
type Story = StoryObj<typeof Popover>;

export const Default: Story = {};

export const Placements: Story = {
  render: () => (
    <Space size="large" wrap>
      <Popover title="Top" trigger="click" placement="top" content={<Content />}>
        <Button>Top</Button>
      </Popover>
      <Popover title="Bottom" trigger="click" placement="bottom" content={<Content />}>
        <Button>Bottom</Button>
      </Popover>
      <Popover title="Left" trigger="click" placement="left" content={<Content />}>
        <Button>Left</Button>
      </Popover>
      <Popover title="Right" trigger="click" placement="right" content={<Content />}>
        <Button>Right</Button>
      </Popover>
    </Space>
  ),
};

export const HoverTrigger: Story = {
  args: { trigger: 'hover' },
};

export const ClickInteraction: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const trigger = canvas.getByRole('button', { name: /open popover/i });
    await userEvent.click(trigger);

    const body = within(document.body);
    expect(await body.findByText(/popover title/i)).toBeInTheDocument();
    expect(body.getByRole('button', { name: /confirm/i })).toBeInTheDocument();
  },
};
