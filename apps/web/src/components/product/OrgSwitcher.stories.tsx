import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, fn, userEvent, waitFor, within } from 'storybook/test';
import { OrgSwitcher } from './OrgSwitcher';

const orgs = [
  { slug: 'apollo', name: 'Apollo' },
  { slug: 'hermes', name: 'Hermes' },
  { slug: 'atlas', name: 'Atlas' },
];

const meta: Meta<typeof OrgSwitcher> = {
  title: 'Product/OrgSwitcher',
  component: OrgSwitcher,
  args: { current: orgs[0], orgs, onSelect: fn() },
};

export default meta;
type Story = StoryObj<typeof OrgSwitcher>;

export const Default: Story = {};

export const SelectOrg: Story = {
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', { name: /trocar de organização/i }));
    const menu = within(document.body);
    const hermes = await menu.findByRole('menuitem', { name: /hermes/i });
    await userEvent.click(hermes);
    await waitFor(() => expect(args.onSelect).toHaveBeenCalledWith('hermes'));
  },
};
