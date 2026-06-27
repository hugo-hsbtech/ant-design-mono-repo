import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Flex, theme } from '@repo/design-system';

const Box = ({ children }: { children: React.ReactNode }) => {
  const { token } = theme.useToken();
  return (
    <div
      style={{
        background: token.colorFillSecondary,
        border: `1px solid ${token.colorBorder}`,
        borderRadius: token.borderRadius,
        color: token.colorText,
        padding: '12px 20px',
        textAlign: 'center',
        minWidth: 64,
      }}
    >
      {children}
    </div>
  );
};

const meta: Meta<typeof Flex> = {
  title: 'Primitives/Flex',
  component: Flex,
  args: {
    gap: 'middle',
  },
  argTypes: {
    gap: { control: 'select', options: ['small', 'middle', 'large'] },
    justify: {
      control: 'select',
      options: ['flex-start', 'center', 'flex-end', 'space-between', 'space-around'],
    },
    align: { control: 'select', options: ['flex-start', 'center', 'flex-end', 'stretch'] },
    vertical: { control: 'boolean' },
    wrap: { control: 'select', options: ['nowrap', 'wrap'] },
  },
  render: (args) => (
    <Flex {...args}>
      <Box>1</Box>
      <Box>2</Box>
      <Box>3</Box>
    </Flex>
  ),
};

export default meta;
type Story = StoryObj<typeof Flex>;

export const Gap: Story = {};

export const Justify: Story = {
  render: () => (
    <Flex vertical gap="large">
      {(['flex-start', 'center', 'flex-end', 'space-between', 'space-around'] as const).map((j) => (
        <Flex key={j} justify={j} style={{ border: '1px dashed #ccc', padding: 8 }}>
          <Box>{j}</Box>
          <Box>B</Box>
          <Box>C</Box>
        </Flex>
      ))}
    </Flex>
  ),
};

export const Align: Story = {
  render: () => (
    <Flex gap="large" align="stretch" style={{ height: 140 }}>
      <Flex align="flex-start" style={{ border: '1px dashed #ccc', flex: 1 }}>
        <Box>start</Box>
      </Flex>
      <Flex align="center" style={{ border: '1px dashed #ccc', flex: 1 }}>
        <Box>center</Box>
      </Flex>
      <Flex align="flex-end" style={{ border: '1px dashed #ccc', flex: 1 }}>
        <Box>end</Box>
      </Flex>
    </Flex>
  ),
};

export const Vertical: Story = {
  args: { vertical: true },
};

export const Wrap: Story = {
  render: () => (
    <Flex wrap="wrap" gap="small" style={{ maxWidth: 320 }}>
      {Array.from({ length: 12 }).map((_, i) => (
        <Box key={i}>{i + 1}</Box>
      ))}
    </Flex>
  ),
};
