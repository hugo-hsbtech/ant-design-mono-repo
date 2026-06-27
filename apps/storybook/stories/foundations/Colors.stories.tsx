import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Card, Flex, Typography, theme } from '@repo/design-system';

const { Text } = Typography;

function Swatch({ name, value }: { name: string; value: string }) {
  return (
    <Flex vertical gap={4} style={{ width: 140 }}>
      <div
        style={{
          height: 56,
          borderRadius: 8,
          background: value,
          border: '1px solid rgba(0,0,0,0.08)',
        }}
      />
      <Text strong style={{ fontSize: 12 }}>
        {name}
      </Text>
      <Text type="secondary" style={{ fontSize: 12 }}>
        {value}
      </Text>
    </Flex>
  );
}

function Palette() {
  const { token } = theme.useToken();
  const semantic: Array<[string, string]> = [
    ['colorPrimary', token.colorPrimary],
    ['colorSuccess', token.colorSuccess],
    ['colorWarning', token.colorWarning],
    ['colorError', token.colorError],
    ['colorInfo', token.colorInfo],
    ['colorText', token.colorText],
    ['colorTextSecondary', token.colorTextSecondary],
    ['colorBgLayout', token.colorBgLayout],
    ['colorBgContainer', token.colorBgContainer],
    ['colorBorder', token.colorBorder],
  ];
  return (
    <Flex vertical gap="large">
      <Card title="Semantic tokens (do ConfigProvider)">
        <Flex wrap="wrap" gap="middle">
          {semantic.map(([name, value]) => (
            <Swatch key={name} name={name} value={value} />
          ))}
        </Flex>
      </Card>
      <Card title="Primary — paleta derivada pelo algoritmo">
        <Flex wrap="wrap" gap="middle">
          {Array.from({ length: 10 }, (_, i) => `colorPrimary-${i + 1}`).map((name) => (
            <Swatch
              key={name}
              name={name}
              value={(token as unknown as Record<string, string>)[name] ?? token.colorPrimary}
            />
          ))}
        </Flex>
      </Card>
    </Flex>
  );
}

const meta: Meta = {
  title: 'Foundations/Colors',
  parameters: { layout: 'fullscreen' },
};
export default meta;

type Story = StoryObj;

export const Tokens: Story = {
  render: () => <Palette />,
};
