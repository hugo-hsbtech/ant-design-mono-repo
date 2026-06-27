import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, fn, userEvent, waitFor, within } from 'storybook/test';
import { NotificationCenter, type NotificationItem } from './NotificationCenter';

const items: NotificationItem[] = [
  { id: 'n1', title: 'Bem-vindo', description: 'Comece criando um projeto.', time: 'agora' },
  { id: 'n2', title: 'Novo membro', description: 'Alan entrou.', time: 'há 2h', read: true },
  { id: 'n3', title: 'Deploy concluído', time: 'ontem' },
];

const meta: Meta<typeof NotificationCenter> = {
  title: 'Product/NotificationCenter',
  component: NotificationCenter,
  args: { items, onMarkAllRead: fn(), onItemClick: fn() },
};

export default meta;
type Story = StoryObj<typeof NotificationCenter>;

export const Default: Story = {};

export const Empty: Story = { args: { items: [] } };

export const OpenAndMarkRead: Story = {
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', { name: /notificações/i }));
    const popup = within(document.body);
    const markAll = await popup.findByRole('button', { name: /marcar todas/i });
    await userEvent.click(markAll);
    await waitFor(() => expect(args.onMarkAllRead).toHaveBeenCalled());
  },
};
