'use client';
import { useTransition } from 'react';
import { App, Alert, Button, Card, Form, Input, PageHeader } from '@repo/design-system';
import type { Role } from '@/lib/types';
import { can } from '@/lib/rbac';
import { updateOrgAction } from './actions';

export function SettingsView({
  slug,
  role,
  orgName,
  orgSlug,
}: {
  slug: string;
  role: Role;
  orgName: string;
  orgSlug: string;
}) {
  const { message } = App.useApp();
  const [pending, startTransition] = useTransition();
  const canEdit = can(role, 'org:update');

  const onFinish = ({ name }: { name: string }) =>
    startTransition(async () => {
      try {
        await updateOrgAction(slug, name);
        message.success('Configurações salvas');
      } catch {
        message.error('Você não tem permissão para editar');
      }
    });

  return (
    <>
      <PageHeader title="Configurações" subtitle="Dados da organização" />
      <Card style={{ maxWidth: 560 }}>
        {!canEdit && (
          <Alert
            type="info"
            showIcon
            message="Somente owners e admins podem editar as configurações."
            style={{ marginBottom: 16 }}
          />
        )}
        <Form
          layout="vertical"
          initialValues={{ name: orgName }}
          onFinish={onFinish}
          disabled={!canEdit}
        >
          <Form.Item
            name="name"
            label="Nome da organização"
            rules={[{ required: true, message: 'Informe o nome' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item label="Slug (URL)">
            <Input value={orgSlug} disabled />
          </Form.Item>
          {canEdit && (
            <Button type="primary" htmlType="submit" loading={pending}>
              Salvar
            </Button>
          )}
        </Form>
      </Card>
    </>
  );
}
