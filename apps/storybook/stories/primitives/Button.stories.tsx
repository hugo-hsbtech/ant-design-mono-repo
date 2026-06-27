import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, fn, userEvent, within } from 'storybook/test';
import { Button, Flex, Space } from '@repo/design-system';
import { DownloadOutlined, PlusOutlined, SearchOutlined } from '@ant-design/icons';

const meta: Meta<typeof Button> = {
  title: 'Primitives/Button',
  component: Button,
  args: {
    children: 'Button',
    type: 'primary',
    onClick: fn(),
  },
  argTypes: {
    type: {
      control: 'select',
      options: ['primary', 'default', 'dashed', 'text', 'link'],
    },
    size: { control: 'select', options: ['small', 'middle', 'large'] },
    danger: { control: 'boolean' },
    disabled: { control: 'boolean' },
    loading: { control: 'boolean' },
    block: { control: 'boolean' },
  },
};

export default meta;
type Story = StoryObj<typeof Button>;

export const Primary: Story = {};

export const Types: Story = {
  render: (args) => (
    <Space wrap>
      <Button {...args} type="primary">
        Primary
      </Button>
      <Button {...args} type="default">
        Default
      </Button>
      <Button {...args} type="dashed">
        Dashed
      </Button>
      <Button {...args} type="text">
        Text
      </Button>
      <Button {...args} type="link">
        Link
      </Button>
    </Space>
  ),
};

export const Sizes: Story = {
  render: (args) => (
    <Space wrap align="center">
      <Button {...args} size="large">
        Large
      </Button>
      <Button {...args} size="middle">
        Middle
      </Button>
      <Button {...args} size="small">
        Small
      </Button>
    </Space>
  ),
};

export const States: Story = {
  render: (args) => (
    <Flex gap="middle" wrap="wrap">
      <Button {...args}>Default</Button>
      <Button {...args} loading>
        Loading
      </Button>
      <Button {...args} disabled>
        Disabled
      </Button>
      <Button {...args} danger>
        Danger
      </Button>
    </Flex>
  ),
};

export const WithIcons: Story = {
  render: (args) => (
    <Space wrap>
      <Button {...args} icon={<PlusOutlined />}>
        Novo
      </Button>
      <Button {...args} type="default" icon={<DownloadOutlined />}>
        Exportar
      </Button>
      <Button {...args} type="default" shape="circle" icon={<SearchOutlined />} />
    </Space>
  ),
};

// PRD §6.3: interaction test where there is behavior.
export const ClickInteraction: Story = {
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    const button = canvas.getByRole('button', { name: /button/i });
    await userEvent.click(button);
    await expect(args.onClick).toHaveBeenCalledTimes(1);
  },
};
