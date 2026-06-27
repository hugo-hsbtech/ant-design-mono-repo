import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { ProductBranding } from './ProductBranding';

const meta: Meta<typeof ProductBranding> = {
  title: 'Product/ProductBranding',
  component: ProductBranding,
  args: { name: 'Plataforma' },
};

export default meta;
type Story = StoryObj<typeof ProductBranding>;

export const Default: Story = {};
export const WithLink: Story = { args: { href: '#' } };
