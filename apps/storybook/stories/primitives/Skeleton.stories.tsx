import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Button, Card, Skeleton, Space } from '@repo/design-system';

const meta: Meta<typeof Skeleton> = {
  title: 'Primitives/Skeleton',
  component: Skeleton,
  args: {
    active: false,
  },
  argTypes: {
    active: { control: 'boolean' },
    loading: { control: 'boolean' },
  },
  render: (args) => (
    <div style={{ maxWidth: 480 }}>
      <Skeleton {...args} />
    </div>
  ),
  // antd's Skeleton renders an empty <h3 class="ant-skeleton-title"> as the title
  // placeholder, which axe flags as an empty heading. It's antd's loading markup,
  // not real content, so skip that rule for the Skeleton stories.
  parameters: {
    a11y: { config: { rules: [{ id: 'empty-heading', enabled: false }] } },
  },
};

export default meta;
type Story = StoryObj<typeof Skeleton>;

export const Default: Story = {};

export const WithAvatar: Story = {
  args: { avatar: true },
};

export const Active: Story = {
  args: { active: true, avatar: true },
};

export const ParagraphRows: Story = {
  args: { active: true, paragraph: { rows: 5 } },
};

export const Elements: Story = {
  render: () => (
    <Space direction="vertical" size="middle">
      <Space>
        <Skeleton.Button active />
        <Skeleton.Avatar active />
        <Skeleton.Input active />
      </Space>
      <Skeleton.Image active />
    </Space>
  ),
};

export const LoadingToContent: Story = {
  render: () => {
    const [loading, setLoading] = useState(true);
    return (
      <Card style={{ width: 480 }}>
        <Skeleton loading={loading} active avatar>
          <p>Conteúdo carregado com sucesso.</p>
        </Skeleton>
        <Button style={{ marginTop: 16 }} onClick={() => setLoading((v) => !v)}>
          {loading ? 'Mostrar conteúdo' : 'Mostrar skeleton'}
        </Button>
      </Card>
    );
  },
};
