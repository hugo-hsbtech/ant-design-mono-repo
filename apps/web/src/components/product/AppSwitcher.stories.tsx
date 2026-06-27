import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, userEvent, waitFor, within } from 'storybook/test';
import { AppstoreOutlined, GlobalOutlined, ReadOutlined } from '@ant-design/icons';
import { AppSwitcher } from './AppSwitcher';

const products = [
  { key: 'dashboard', name: 'Dashboard', icon: <AppstoreOutlined /> },
  { key: 'landing', name: 'Landing', icon: <GlobalOutlined /> },
  { key: 'site', name: 'Site', icon: <ReadOutlined /> },
];

const meta: Meta<typeof AppSwitcher> = {
  title: 'Product/AppSwitcher',
  component: AppSwitcher,
  args: { products, currentKey: 'dashboard' },
};

export default meta;
type Story = StoryObj<typeof AppSwitcher>;

export const Default: Story = {};

export const OpenGrid: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', { name: /trocar de produto/i }));
    await waitFor(async () =>
      expect(await within(document.body).findByText('Landing')).toBeVisible(),
    );
  },
};
