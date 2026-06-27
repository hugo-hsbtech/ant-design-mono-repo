import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Card, Divider, Flex, Typography } from '@repo/design-system';

const { Title, Text, Paragraph, Link } = Typography;

function TypeScale() {
  return (
    <Card title="Tipografia da marca (fontFamily: Inter)">
      <Title level={1}>Heading 1</Title>
      <Title level={2}>Heading 2</Title>
      <Title level={3}>Heading 3</Title>
      <Title level={4}>Heading 4</Title>
      <Title level={5}>Heading 5</Title>
      <Divider />
      <Paragraph>
        Body — texto padrão de parágrafo usando o token <Text code>fontSize</Text>. A mesma
        tipografia permeia dashboard, landing e site.
      </Paragraph>
      <Flex gap="middle" wrap="wrap">
        <Text strong>Strong</Text>
        <Text type="secondary">Secondary</Text>
        <Text type="success">Success</Text>
        <Text type="warning">Warning</Text>
        <Text type="danger">Danger</Text>
        <Text disabled>Disabled</Text>
        <Text mark>Marked</Text>
        <Text code>code()</Text>
        <Link href="#">Link</Link>
      </Flex>
    </Card>
  );
}

const meta: Meta = {
  title: 'Foundations/Typography',
};
export default meta;

type Story = StoryObj;

export const Scale: Story = {
  render: () => <TypeScale />,
};
