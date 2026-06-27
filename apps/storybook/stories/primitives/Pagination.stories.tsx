import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, fn, userEvent, within } from 'storybook/test';
import { Pagination } from '@repo/design-system';

const meta: Meta<typeof Pagination> = {
  title: 'Primitives/Pagination',
  component: Pagination,
  args: {
    defaultCurrent: 1,
    total: 100,
    onChange: fn(),
  },
};

export default meta;
type Story = StoryObj<typeof Pagination>;

export const Basic: Story = {};

export const WithSizeChanger: Story = {
  args: { total: 500, showSizeChanger: true },
};

export const WithQuickJumper: Story = {
  args: { total: 500, showQuickJumper: true },
};

export const Simple: Story = {
  args: { simple: true, total: 50 },
};

export const Small: Story = {
  args: { size: 'small', total: 100 },
};

export const WithTotal: Story = {
  args: {
    total: 85,
    showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`,
  },
};

export const ClickNextPage: Story = {
  args: { total: 100 },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    const next = canvas.getByRole('listitem', { name: /next page/i });
    await userEvent.click(next);
    await expect(args.onChange).toHaveBeenCalled();
  },
};
