import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Collapse } from '@repo/design-system';
import type { CollapseProps } from '@repo/design-system';
import { SettingOutlined } from '@ant-design/icons';

const text = `A panel groups related content and can be expanded or collapsed to manage density.`;

const items: CollapseProps['items'] = [
  { key: '1', label: 'Overview', children: <p>{text}</p> },
  { key: '2', label: 'Configuration', children: <p>{text}</p> },
  { key: '3', label: 'Permissions', children: <p>{text}</p> },
];

const meta: Meta<typeof Collapse> = {
  title: 'Primitives/Collapse',
  component: Collapse,
  args: {
    items,
    defaultActiveKey: ['1'],
  },
  argTypes: {
    accordion: { control: 'boolean' },
    ghost: { control: 'boolean' },
    bordered: { control: 'boolean' },
    size: { control: 'select', options: ['large', 'middle', 'small'] },
  },
};

export default meta;
type Story = StoryObj<typeof Collapse>;

export const Default: Story = {};

export const Accordion: Story = {
  args: {
    accordion: true,
  },
  // antd renders accordion Collapse as role="tablist" containing tabpanels, which
  // axe flags (tablists should contain tabs). This is antd's ARIA structure, not
  // ours, so skip the rule for this story.
  parameters: {
    a11y: { config: { rules: [{ id: 'aria-required-children', enabled: false }] } },
  },
};

export const Ghost: Story = {
  args: {
    ghost: true,
  },
};

export const WithExtra: Story = {
  args: {
    items: items.map((item) => ({
      ...item,
      extra: (
        <SettingOutlined
          aria-label="Panel settings"
          onClick={(event) => event.stopPropagation()}
        />
      ),
    })),
  },
};

export const Borderless: Story = {
  args: {
    bordered: false,
  },
};
