'use client';
import { useMemo, useState } from 'react';
import {
  App,
  AppShell,
  Avatar,
  Button,
  Dropdown,
  Flex,
  Form,
  Input,
  Menu,
  PageHeader,
  DataTable,
  FormModal,
  Popconfirm,
  Space,
  Tag,
  Typography,
} from '@repo/design-system';
import {
  AppstoreOutlined,
  HomeOutlined,
  LogoutOutlined,
  PlusOutlined,
  SettingOutlined,
  TeamOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { ThemeToggle } from '@/components/ThemeToggle';

const { Text } = Typography;

interface Project {
  key: string;
  name: string;
  status: 'active' | 'archived';
}

const initial: Project[] = [
  { key: '1', name: 'Apollo', status: 'active' },
  { key: '2', name: 'Hermes', status: 'active' },
  { key: '3', name: 'Atlas', status: 'archived' },
];

function Dashboard() {
  const { message } = App.useApp();
  const [projects, setProjects] = useState<Project[]>(initial);
  const [query, setQuery] = useState('');
  const [creating, setCreating] = useState(false);

  const filtered = useMemo(
    () => projects.filter((p) => p.name.toLowerCase().includes(query.toLowerCase())),
    [projects, query],
  );

  const remove = (key: string) => {
    setProjects((prev) => prev.filter((p) => p.key !== key));
    message.success('Projeto removido');
  };

  const header = (
    <Flex align="center" justify="space-between" style={{ width: '100%' }}>
      <Text strong>Plataforma</Text>
      <Space>
        <ThemeToggle />
        <Dropdown
          menu={{
            items: [
              { key: 'profile', icon: <UserOutlined />, label: 'Perfil' },
              { key: 'settings', icon: <SettingOutlined />, label: 'Preferências' },
              { type: 'divider' },
              { key: 'logout', icon: <LogoutOutlined />, label: 'Sair' },
            ],
          }}
        >
          <Button type="text" aria-label="Menu do usuário">
            <Avatar size="small">AL</Avatar>
          </Button>
        </Dropdown>
      </Space>
    </Flex>
  );

  const sidebar = (
    <Menu
      mode="inline"
      defaultSelectedKeys={['projects']}
      style={{ borderInlineEnd: 'none' }}
      items={[
        { key: 'home', icon: <HomeOutlined />, label: 'Início' },
        { key: 'projects', icon: <AppstoreOutlined />, label: 'Projetos' },
        { key: 'members', icon: <TeamOutlined />, label: 'Membros' },
        { key: 'settings', icon: <SettingOutlined />, label: 'Configurações' },
      ]}
    />
  );

  return (
    <AppShell header={header} sidebar={sidebar}>
      <PageHeader
        title="Projetos"
        subtitle="CRUD de exemplo sobre a fachada @repo/design-system"
        breadcrumb={[{ title: 'Início' }, { title: 'Projetos' }]}
        extra={
          <Button type="primary" icon={<PlusOutlined />} onClick={() => setCreating(true)}>
            Novo projeto
          </Button>
        }
      />
      <DataTable<Project>
        onSearch={setQuery}
        rowKey="key"
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
            render: (_, row) => (
              <Popconfirm title="Remover projeto?" onConfirm={() => remove(row.key)}>
                <Button type="link" danger>
                  Excluir
                </Button>
              </Popconfirm>
            ),
          },
        ]}
      />
      <FormModal<{ name: string }>
        open={creating}
        title="Novo projeto"
        onCancel={() => setCreating(false)}
        onSubmit={({ name }) => {
          setProjects((prev) => [...prev, { key: String(Date.now()), name, status: 'active' }]);
          setCreating(false);
          message.success('Projeto criado');
        }}
      >
        <Form.Item name="name" label="Nome" rules={[{ required: true, message: 'Informe o nome' }]}>
          <Input placeholder="Ex.: Apollo" />
        </Form.Item>
      </FormModal>
    </AppShell>
  );
}

export default function Page() {
  return <Dashboard />;
}
