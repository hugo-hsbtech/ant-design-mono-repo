import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Button, Drawer, Space } from '@repo/design-system';
import type { DrawerProps } from '@repo/design-system';

interface DemoProps {
  placement?: DrawerProps['placement'];
  withFooter?: boolean;
}

function DrawerDemo({ placement = 'right', withFooter }: DemoProps) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button type="primary" onClick={() => setOpen(true)}>
        Abrir drawer
      </Button>
      <Drawer
        title="Detalhes"
        placement={placement}
        open={open}
        onClose={() => setOpen(false)}
        footer={
          withFooter ? (
            <Space>
              <Button onClick={() => setOpen(false)}>Cancelar</Button>
              <Button type="primary" onClick={() => setOpen(false)}>
                Salvar
              </Button>
            </Space>
          ) : undefined
        }
      >
        <p>Conteúdo do drawer renderizado em um portal.</p>
      </Drawer>
    </>
  );
}

const meta: Meta<typeof DrawerDemo> = {
  title: 'Primitives/Drawer',
  component: DrawerDemo,
  args: {
    placement: 'right',
  },
  argTypes: {
    placement: { control: 'select', options: ['top', 'right', 'bottom', 'left'] },
  },
};

export default meta;
type Story = StoryObj<typeof DrawerDemo>;

export const Right: Story = { args: { placement: 'right' } };
export const Left: Story = { args: { placement: 'left' } };
export const Top: Story = { args: { placement: 'top' } };
export const Bottom: Story = { args: { placement: 'bottom' } };

export const WithFooter: Story = {
  args: { placement: 'right', withFooter: true },
};
