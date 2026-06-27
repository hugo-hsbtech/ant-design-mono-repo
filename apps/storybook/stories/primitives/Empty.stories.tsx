import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Button, Empty } from '@repo/design-system';

const meta: Meta<typeof Empty> = {
  title: 'Primitives/Empty',
  component: Empty,
  args: {},
  render: (args) => (
    <div style={{ maxWidth: 480 }}>
      <Empty {...args} />
    </div>
  ),
};

export default meta;
type Story = StoryObj<typeof Empty>;

export const Default: Story = {};

export const SimpleImage: Story = {
  args: { image: Empty.PRESENTED_IMAGE_SIMPLE },
};

export const CustomWithAction: Story = {
  render: () => (
    <Empty
      image={Empty.PRESENTED_IMAGE_SIMPLE}
      description="Nenhum cliente cadastrado ainda"
    >
      <Button type="primary">Criar cliente</Button>
    </Empty>
  ),
};
