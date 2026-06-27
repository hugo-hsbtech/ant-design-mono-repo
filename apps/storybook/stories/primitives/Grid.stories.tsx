import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Col, Row, theme } from '@repo/design-system';

const Box = ({ children }: { children: React.ReactNode }) => {
  const { token } = theme.useToken();
  return (
    <div
      style={{
        background: token.colorPrimaryBg,
        border: `1px solid ${token.colorPrimaryBorder}`,
        borderRadius: token.borderRadius,
        color: token.colorText,
        padding: '12px 0',
        textAlign: 'center',
      }}
    >
      {children}
    </div>
  );
};

const meta: Meta<typeof Row> = {
  title: 'Primitives/Grid',
  component: Row,
  args: {
    gutter: [16, 16],
  },
  render: (args) => (
    <Row {...args}>
      <Col span={6}>
        <Box>span 6</Box>
      </Col>
      <Col span={6}>
        <Box>span 6</Box>
      </Col>
      <Col span={6}>
        <Box>span 6</Box>
      </Col>
      <Col span={6}>
        <Box>span 6</Box>
      </Col>
    </Row>
  ),
};

export default meta;
type Story = StoryObj<typeof Row>;

export const Gutter: Story = {};

export const Responsive: Story = {
  render: () => (
    <Row gutter={[16, 16]}>
      {Array.from({ length: 4 }).map((_, i) => (
        <Col key={i} xs={24} sm={12} md={8} lg={6}>
          <Box>xs=24 sm=12 md=8 lg=6</Box>
        </Col>
      ))}
    </Row>
  ),
};

export const Offset: Story = {
  render: () => (
    <Row gutter={[16, 16]}>
      <Col span={8}>
        <Box>span 8</Box>
      </Col>
      <Col span={8} offset={8}>
        <Box>span 8 offset 8</Box>
      </Col>
    </Row>
  ),
};

export const JustifyAlign: Story = {
  render: () => (
    <Row gutter={16} justify="space-between" align="middle" style={{ minHeight: 100 }}>
      <Col span={4}>
        <Box>4</Box>
      </Col>
      <Col span={4}>
        <Box>4</Box>
      </Col>
      <Col span={4}>
        <Box>4</Box>
      </Col>
    </Row>
  ),
};
