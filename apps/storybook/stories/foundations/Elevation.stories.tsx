import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Flex, Typography, theme } from '@repo/design-system';
import { tokens } from '@repo/brand-tokens';

const { Text } = Typography;

function ElevationScale() {
  const { token } = theme.useToken();
  const shadows = Object.entries(tokens)
    .filter(([k]) => k.startsWith('elevation.'))
    .map(([k, v]) => [k.replace('elevation.', ''), String(v)] as const);

  return (
    <Flex wrap="wrap" gap={32} style={{ padding: 24 }}>
      {shadows.map(([name, value]) => (
        <Flex key={name} vertical gap={8} align="center">
          <div
            style={{
              width: 160,
              height: 100,
              borderRadius: token.borderRadiusLG,
              background: token.colorBgContainer,
              boxShadow: value,
            }}
          />
          <Text code>elevation.{name}</Text>
        </Flex>
      ))}
    </Flex>
  );
}

const meta: Meta = {
  title: 'Foundations/Elevation',
  parameters: { layout: 'fullscreen' },
};
export default meta;

type Story = StoryObj;

export const Shadows: Story = {
  render: () => <ElevationScale />,
};
