import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Button, Card, Stack } from '@repo/design-system';

const meta = {
  title: 'Patterns/Stack',
  component: Stack,
  args: { gap: 'middle', direction: 'vertical' },
  argTypes: {
    direction: { control: 'inline-radio', options: ['vertical', 'horizontal'] },
    gap: { control: 'select', options: ['small', 'middle', 'large'] },
  },
} satisfies Meta<typeof Stack>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
    <Stack {...args}>
      <Card size="small">Item 1</Card>
      <Card size="small">Item 2</Card>
      <Card size="small">Item 3</Card>
      <Button type="primary">Ação</Button>
    </Stack>
  ),
};
