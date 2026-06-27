import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, fn, userEvent, within } from 'storybook/test';
import { Button, Popconfirm } from '@repo/design-system';

const meta: Meta<typeof Popconfirm> = {
  title: 'Primitives/Popconfirm',
  component: Popconfirm,
  args: {
    title: 'Excluir registro',
    description: 'Tem certeza de que deseja excluir?',
    okText: 'Sim',
    cancelText: 'Não',
    onConfirm: fn(),
    onCancel: fn(),
  },
  render: (args) => (
    <Popconfirm {...args}>
      <Button danger>Excluir</Button>
    </Popconfirm>
  ),
};

export default meta;
type Story = StoryObj<typeof Popconfirm>;

export const Default: Story = {};

export const TitleOnly: Story = {
  args: { description: undefined, title: 'Confirmar esta ação?' },
};

export const ConfirmInteraction: Story = {
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', { name: /excluir/i }));
    const popup = within(document.body);
    const confirmBtn = await popup.findByRole('button', { name: 'Sim' });
    await userEvent.click(confirmBtn);
    await expect(args.onConfirm).toHaveBeenCalled();
  },
};
