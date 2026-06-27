import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, userEvent, waitFor, within } from 'storybook/test';
import { Button, Form, FormModal, Input } from '@repo/design-system';

interface ProjectValues {
  name: string;
}

function Demo() {
  const [open, setOpen] = useState(false);
  const [saved, setSaved] = useState<string | null>(null);
  return (
    <div>
      <Button type="primary" onClick={() => setOpen(true)}>
        Novo projeto
      </Button>
      {saved && <p data-testid="saved">Salvo: {saved}</p>}
      <FormModal<ProjectValues>
        open={open}
        title="Novo projeto"
        onCancel={() => setOpen(false)}
        onSubmit={(values) => {
          setSaved(values.name);
          setOpen(false);
        }}
      >
        <Form.Item
          name="name"
          label="Nome"
          rules={[{ required: true, message: 'Informe o nome' }]}
        >
          <Input placeholder="Ex.: Apollo" />
        </Form.Item>
      </FormModal>
    </div>
  );
}

const meta = {
  title: 'Patterns/FormModal',
  component: FormModal,
  parameters: { layout: 'padded' },
  // The story drives its own state via `render`; these satisfy required props.
  args: { open: false, onCancel: () => {}, onSubmit: () => {}, children: null },
} satisfies Meta<typeof FormModal>;

export default meta;
type Story = StoryObj<typeof meta>;

export const CreateFlow: Story = {
  render: () => <Demo />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', { name: /novo projeto/i }));
    // Modal renders in a portal at document.body.
    const dialog = within(await within(document.body).findByRole('dialog'));
    await userEvent.type(dialog.getByLabelText('Nome'), 'Apollo');
    await userEvent.click(dialog.getByRole('button', { name: /salvar/i }));
    await waitFor(() => expect(canvas.getByTestId('saved')).toHaveTextContent('Apollo'));
  },
};
