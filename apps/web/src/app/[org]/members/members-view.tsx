'use client';
import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import {
  App,
  Button,
  DataTable,
  Form,
  FormModal,
  Input,
  PageHeader,
  Popconfirm,
  Select,
  Space,
  Tag,
} from '@repo/design-system';
import { UserAddOutlined } from '@ant-design/icons';
import type { PendingInvite, Role } from '@/lib/types';
import { can } from '@/lib/rbac';
import {
  cancelInviteAction,
  inviteMemberAction,
  removeMemberAction,
  updateMemberRoleAction,
} from './actions';

interface MemberRow {
  userId: string;
  name: string;
  email: string;
  role: Role;
}

const ROLE_OPTIONS: { value: Role; label: string }[] = [
  { value: 'owner', label: 'Owner' },
  { value: 'admin', label: 'Admin' },
  { value: 'member', label: 'Member' },
  { value: 'viewer', label: 'Viewer' },
];

export function MembersView({
  slug,
  role,
  currentUserId,
  members,
  invites,
}: {
  slug: string;
  role: Role;
  currentUserId: string;
  members: MemberRow[];
  invites: PendingInvite[];
}) {
  const { message } = App.useApp();
  const router = useRouter();
  const [inviting, setInviting] = useState(false);
  const [, startTransition] = useTransition();

  const canInvite = can(role, 'member:invite');
  const canUpdate = can(role, 'member:update');
  const canRemove = can(role, 'member:remove');
  const ownerCount = members.filter((m) => m.role === 'owner').length;
  const isLastOwner = (m: MemberRow) => m.role === 'owner' && ownerCount <= 1;

  const run = (fn: () => Promise<unknown>, ok: string) =>
    startTransition(async () => {
      try {
        await fn();
        router.refresh();
        message.success(ok);
      } catch {
        message.error('Ação não permitida');
      }
    });

  const handleInvite = async ({ email, role: r }: { email: string; role: Role }) => {
    try {
      const res = await inviteMemberAction(slug, email, r);
      router.refresh();
      message.success(res.status === 'added' ? 'Membro adicionado' : 'Convite enviado');
      setInviting(false);
    } catch {
      message.error('Não foi possível convidar');
    }
  };

  return (
    <>
      <PageHeader
        title="Membros"
        subtitle="Gerencie quem tem acesso e seus papéis (RBAC validado no servidor)"
        extra={
          canInvite ? (
            <Button type="primary" icon={<UserAddOutlined />} onClick={() => setInviting(true)}>
              Convidar
            </Button>
          ) : undefined
        }
      />

      <DataTable<MemberRow>
        title="Membros"
        rowKey="userId"
        dataSource={members}
        pagination={false}
        columns={[
          {
            title: 'Nome',
            dataIndex: 'name',
            render: (name: string, row) => (
              <Space>
                {name}
                {row.userId === currentUserId && <Tag>você</Tag>}
              </Space>
            ),
          },
          { title: 'E-mail', dataIndex: 'email' },
          {
            title: 'Papel',
            dataIndex: 'role',
            width: 160,
            render: (r: Role, row) =>
              canUpdate ? (
                <Select<Role>
                  size="small"
                  value={r}
                  style={{ width: 130 }}
                  disabled={isLastOwner(row)}
                  options={ROLE_OPTIONS}
                  aria-label={`Papel de ${row.name}`}
                  onChange={(next) =>
                    run(() => updateMemberRoleAction(slug, row.userId, next), 'Papel atualizado')
                  }
                />
              ) : (
                <Tag>{r}</Tag>
              ),
          },
          {
            title: 'Ações',
            key: 'actions',
            width: 100,
            render: (_, row) =>
              canRemove && !isLastOwner(row) ? (
                <Popconfirm
                  title="Remover membro?"
                  onConfirm={() => run(() => removeMemberAction(slug, row.userId), 'Membro removido')}
                >
                  <Button type="link" danger>
                    Remover
                  </Button>
                </Popconfirm>
              ) : null,
          },
        ]}
      />

      {invites.length > 0 && (
        <div style={{ marginTop: 24 }}>
          <DataTable<PendingInvite>
            title="Convites pendentes"
            rowKey="id"
            dataSource={invites}
            pagination={false}
            columns={[
              { title: 'E-mail', dataIndex: 'email' },
              { title: 'Papel', dataIndex: 'role', render: (r: Role) => <Tag>{r}</Tag> },
              {
                title: 'Ações',
                key: 'actions',
                width: 100,
                render: (_, row) =>
                  canRemove ? (
                    <Button
                      type="link"
                      danger
                      onClick={() => run(() => cancelInviteAction(slug, row.id), 'Convite cancelado')}
                    >
                      Cancelar
                    </Button>
                  ) : null,
              },
            ]}
          />
        </div>
      )}

      <FormModal<{ email: string; role: Role }>
        open={inviting}
        title="Convidar membro"
        onCancel={() => setInviting(false)}
        onSubmit={handleInvite}
        initialValues={{ role: 'member' }}
      >
        <Form.Item
          name="email"
          label="E-mail"
          rules={[{ required: true, type: 'email', message: 'Informe um e-mail válido' }]}
        >
          <Input placeholder="pessoa@empresa.com" />
        </Form.Item>
        <Form.Item name="role" label="Papel" rules={[{ required: true }]}>
          <Select<Role> options={ROLE_OPTIONS} />
        </Form.Item>
      </FormModal>
    </>
  );
}
