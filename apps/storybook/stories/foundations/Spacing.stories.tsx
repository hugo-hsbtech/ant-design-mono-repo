import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Card, Flex, Typography, theme } from '@repo/design-system';
import { tokens } from '@repo/brand-tokens';

const { Text } = Typography;

function SpacingScale() {
  const { token } = theme.useToken();
  const steps = Object.entries(tokens)
    .filter(([k]) => k.startsWith('space.'))
    .map(([k, v]) => [k.replace('space.', 'space-'), Number(v)] as const)
    .sort((a, b) => a[1] - b[1]);

  return (
    <Card title="Escala de espaçamento (tokens da marca)">
      <Flex vertical gap="middle">
        {steps.map(([name, value]) => (
          <Flex key={name} align="center" gap="middle">
            <Text style={{ width: 80 }} code>
              {name}
            </Text>
            <div
              style={{
                width: value,
                height: 16,
                background: token.colorPrimary,
                borderRadius: 4,
              }}
            />
            <Text type="secondary">{value}px</Text>
          </Flex>
        ))}
      </Flex>
    </Card>
  );
}

const meta: Meta = {
  title: 'Foundations/Spacing',
};
export default meta;

type Story = StoryObj;

export const Scale: Story = {
  render: () => <SpacingScale />,
};
