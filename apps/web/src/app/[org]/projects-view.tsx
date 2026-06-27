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
  Tag,
} from '@repo/design-system';
import { PlusOutlined } from '@ant-design/icons';
import type { Project, Role } from '@/lib/types';
import { can } from '@/lib/rbac';
import { createProjectAction, deleteProjectAction } from './actions';

export function ProjectsView({
  slug,
  role,
  projects,
}: {
  slug: string;
  role: Role;
  projects: Project[];
}) {
  const { message } = App.useApp();
  const router = useRouter();
  const [creating, setCreating] = useState(false);
  const [query, setQuery] = useState('');
  const [, startTransition] = useTransition();

  const canCreate = can(role, 'project:create');
  const canDelete = can(role, 'project:delete');
  const filtered = projects.filter((p) => p.name.toLowerCase().includes(query.toLowerCase()));

  const handleCreate = async ({ name }: { name: string }) => {
    try {
      await createProjectAction(slug, name);
      router.refresh();
      message.success('Projeto criado');
      setCreating(false);
    } catch {
      message.error('Você não tem permissão para criar projetos');
    }
  };

  const handleDelete = (id: string) =>
    startTransition(async () => {
      try {
        await deleteProjectAction(slug, id);
        router.refresh();
        message.success('Projeto removido');
      } catch {
        message.error('Você não tem permissão para remover projetos');
      }
    });

  return (
    <>
      <PageHeader
        title="Projetos"
        subtitle="CRUD escopado por organização, autorizado no servidor (RBAC)"
        extra={
          canCreate ? (
            <Button type="primary" icon={<PlusOutlined />} onClick={() => setCreating(true)}>
              Novo projeto
            </Button>
          ) : undefined
        }
      />
      <DataTable<Project>
        onSearch={setQuery}
        rowKey="id"
        dataSource={filtered}
        pagination={false}
        columns={[
          { title: 'Nome', dataIndex: 'name' },
          {
            title: 'Status',
            dataIndex: 'status',
            render: (s: Project['status']) => (
              <Tag color={s === 'active' ? 'green' : 'default'}>{s}</Tag>
            ),
          },
          {
            title: 'Ações',
            key: 'actions',
            width: 100,
            render: (_, row) =>
              canDelete ? (
                <Popconfirm title="Remover projeto?" onConfirm={() => handleDelete(row.id)}>
                  <Button type="link" danger>
                    Excluir
                  </Button>
                </Popconfirm>
              ) : null,
          },
        ]}
      />
      <FormModal<{ name: string }>
        open={creating}
        title="Novo projeto"
        onCancel={() => setCreating(false)}
        onSubmit={handleCreate}
      >
        <Form.Item name="name" label="Nome" rules={[{ required: true, message: 'Informe o nome' }]}>
          <Input placeholder="Ex.: Apollo Web" />
        </Form.Item>
      </FormModal>
    </>
  );
}
