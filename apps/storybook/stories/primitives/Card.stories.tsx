import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Card, Avatar, Flex } from '@repo/design-system';
import { EditOutlined, EllipsisOutlined, SettingOutlined } from '@ant-design/icons';

const { Meta: CardMeta } = Card;

const meta: Meta<typeof Card> = {
  title: 'Primitives/Card',
  component: Card,
  args: {
    title: 'Project overview',
    style: { width: 360 },
    children: 'A card groups related content and actions.',
  },
  argTypes: {
    size: { control: 'select', options: ['default', 'small'] },
    bordered: { control: 'boolean' },
    loading: { control: 'boolean' },
  },
};

export default meta;
type Story = StoryObj<typeof Card>;

export const Default: Story = {};

export const WithCoverActionsExtra: Story = {
  render: (args) => (
    <Card
      {...args}
      title="Apollo"
      extra={<a href="#">More</a>}
      cover={
        <img
          alt="Mountain landscape used as the card cover"
          src="https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png"
        />
      }
      actions={[
        <SettingOutlined key="setting" aria-label="Settings" />,
        <EditOutlined key="edit" aria-label="Edit" />,
        <EllipsisOutlined key="ellipsis" aria-label="More options" />,
      ]}
    >
      <CardMeta
        title="Apollo program"
        description="On track for the Q3 milestone."
      />
    </Card>
  ),
};

export const WithMeta: Story = {
  render: (args) => (
    <Card {...args} title={undefined}>
      <CardMeta
        avatar={
          <Avatar src="https://api.dicebear.com/7.x/miniavs/svg?seed=1" alt="Ada Lovelace avatar" />
        }
        title="Ada Lovelace"
        description="Lead engineer on the Apollo project."
      />
    </Card>
  ),
};

export const GridOfCards: Story = {
  render: () => (
    <Flex gap="middle" wrap="wrap">
      {['Apollo', 'Hermes', 'Atlas', 'Orion'].map((name) => (
        <Card key={name} title={name} size="small" style={{ width: 200 }}>
          Status: active
        </Card>
      ))}
    </Flex>
  ),
};

export const Small: Story = {
  args: {
    size: 'small',
    title: 'Compact card',
  },
};

export const Loading: Story = {
  args: {
    loading: true,
  },
};

export const CardGridLayout: Story = {
  render: (args) => (
    <Card {...args} title="Card.Grid">
      <Card.Grid style={{ width: '50%', textAlign: 'center' }}>Cell 1</Card.Grid>
      <Card.Grid style={{ width: '50%', textAlign: 'center' }}>Cell 2</Card.Grid>
      <Card.Grid style={{ width: '50%', textAlign: 'center' }}>Cell 3</Card.Grid>
      <Card.Grid style={{ width: '50%', textAlign: 'center' }}>Cell 4</Card.Grid>
    </Card>
  ),
};
