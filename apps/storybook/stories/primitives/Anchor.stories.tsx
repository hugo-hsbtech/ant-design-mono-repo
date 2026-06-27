import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Anchor } from '@repo/design-system';
import type { AnchorProps } from '@repo/design-system';

const items: AnchorProps['items'] = [
  { key: '1', href: '#section-1', title: 'Section 1' },
  { key: '2', href: '#section-2', title: 'Section 2' },
  {
    key: '3',
    href: '#section-3',
    title: 'Section 3',
    children: [
      { key: '3-1', href: '#section-3-1', title: 'Section 3.1' },
      { key: '3-2', href: '#section-3-2', title: 'Section 3.2' },
    ],
  },
];

const meta: Meta<typeof Anchor> = {
  title: 'Primitives/Anchor',
  component: Anchor,
  args: {
    items,
  },
};

export default meta;
type Story = StoryObj<typeof Anchor>;

export const Basic: Story = {};

export const Horizontal: Story = {
  args: {
    direction: 'horizontal',
    items: [
      { key: '1', href: '#section-1', title: 'Section 1' },
      { key: '2', href: '#section-2', title: 'Section 2' },
      { key: '3', href: '#section-3', title: 'Section 3' },
    ],
  },
};

export const FixedTarget: Story = {
  args: {
    affix: false,
    items,
  },
};
