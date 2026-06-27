import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Breadcrumb } from '@repo/design-system';
import type { BreadcrumbProps } from '@repo/design-system';
import { HomeOutlined, UserOutlined } from '@ant-design/icons';

const basicItems: BreadcrumbProps['items'] = [
  { title: 'Home', href: '/' },
  { title: 'Application Center', href: '/apps' },
  { title: 'Application List', href: '/apps/list' },
  { title: 'An Application' },
];

const meta: Meta<typeof Breadcrumb> = {
  title: 'Primitives/Breadcrumb',
  component: Breadcrumb,
  args: {
    items: basicItems,
  },
};

export default meta;
type Story = StoryObj<typeof Breadcrumb>;

export const Basic: Story = {};

export const WithIcon: Story = {
  args: {
    items: [
      { href: '/', title: <HomeOutlined /> },
      {
        href: '/user',
        title: (
          <>
            <UserOutlined />
            <span>Application List</span>
          </>
        ),
      },
      { title: 'Application' },
    ],
  },
};

export const WithDropdown: Story = {
  args: {
    items: [
      { title: 'Home', href: '/' },
      {
        title: 'Application Center',
        menu: {
          items: [
            { key: '1', label: <a href="/apps/general">General</a> },
            { key: '2', label: <a href="/apps/layout">Layout</a> },
            { key: '3', label: <a href="/apps/navigation">Navigation</a> },
          ],
        },
      },
      { title: 'An Application' },
    ],
  },
};
