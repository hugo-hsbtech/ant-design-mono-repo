import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, fn, userEvent, waitFor, within } from 'storybook/test';
import { UserMenu } from './UserMenu';

const meta: Meta<typeof UserMenu> = {
  title: 'Product/UserMenu',
  component: UserMenu,
  args: {
    name: 'Ada Lovelace',
    email: 'ada@plataforma.dev',
    onProfile: fn(),
    onSettings: fn(),
    onLogout: fn(),
  },
};

export default meta;
type Story = StoryObj<typeof UserMenu>;

export const Default: Story = {};

export const Logout: Story = {
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', { name: /menu do usuário/i }));
    const menu = within(document.body);
    const logout = await menu.findByRole('menuitem', { name: /sair/i });
    await userEvent.click(logout);
    await waitFor(() => expect(args.onLogout).toHaveBeenCalled());
  },
};
