import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, userEvent, waitFor, within } from 'storybook/test';
import { App, Button, Modal } from '@repo/design-system';

interface DemoProps {
  title?: string;
  width?: number;
  withFooter?: boolean;
}

function ModalDemo({ title = 'Título do modal', width, withFooter }: DemoProps) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button type="primary" onClick={() => setOpen(true)}>
        Abrir modal
      </Button>
      <Modal
        title={title}
        open={open}
        width={width}
        onOk={() => setOpen(false)}
        onCancel={() => setOpen(false)}
        footer={
          withFooter
            ? [
                <Button key="back" onClick={() => setOpen(false)}>
                  Cancelar
                </Button>,
                <Button key="submit" type="primary" danger onClick={() => setOpen(false)}>
                  Confirmar exclusão
                </Button>,
              ]
            : undefined
        }
      >
        <p>Conteúdo do modal renderizado em um portal.</p>
      </Modal>
    </>
  );
}

const meta: Meta<typeof ModalDemo> = {
  title: 'Primitives/Modal',
  component: ModalDemo,
  args: {
    title: 'Título do modal',
  },
};

export default meta;
type Story = StoryObj<typeof ModalDemo>;

export const Basic: Story = {};

export const ConfirmStyleFooter: Story = {
  args: { title: 'Excluir registro', withFooter: true },
};

export const LargeWidth: Story = {
  args: { title: 'Modal largo', width: 800 },
};

export const ImperativeConfirm: Story = {
  render: () => {
    function ConfirmDemo() {
      const { modal } = App.useApp();
      return (
        <Button
          onClick={() =>
            modal.confirm({
              title: 'Tem certeza?',
              content: 'Esta ação não pode ser desfeita.',
              okText: 'Sim',
              cancelText: 'Não',
            })
          }
        >
          Modal.confirm
        </Button>
      );
    }
    return <ConfirmDemo />;
  },
};

export const OpenInteraction: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', { name: /abrir modal/i }));
    const dialog = await within(document.body).findByRole('dialog');
    // The modal mounts mid zoom-in animation; wait for it to settle visible.
    await waitFor(() => expect(dialog).toBeVisible());
  },
};
