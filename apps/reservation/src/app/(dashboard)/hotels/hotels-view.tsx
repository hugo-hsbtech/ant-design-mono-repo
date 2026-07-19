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
} from '@repo/design-system';
import { PlusOutlined } from '@ant-design/icons';
import type { Hotel } from '@/lib/types';
import { createHotelAction, deleteHotelAction, updateHotelAction } from './actions';

interface HotelFormValues {
  name: string;
  address?: string;
}

export function HotelsView({ hotels }: { hotels: Hotel[] }) {
  const { message } = App.useApp();
  const router = useRouter();
  const [editing, setEditing] = useState<Hotel | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [, startTransition] = useTransition();

  const filtered = hotels.filter((h) => h.name.toLowerCase().includes(query.toLowerCase()));

  const openCreate = () => {
    setEditing(null);
    setFormOpen(true);
  };
  const openEdit = (hotel: Hotel) => {
    setEditing(hotel);
    setFormOpen(true);
  };

  const handleSubmit = async (values: HotelFormValues) => {
    try {
      if (editing) {
        await updateHotelAction(editing.id, values);
        message.success('Hotel updated');
      } else {
        await createHotelAction(values);
        message.success('Hotel created');
      }
      setFormOpen(false);
      router.refresh();
    } catch (err) {
      message.error(err instanceof Error ? err.message : 'Something went wrong');
    }
  };

  const handleDelete = (id: string) =>
    startTransition(async () => {
      try {
        await deleteHotelAction(id);
        message.success('Hotel deleted');
        router.refresh();
      } catch (err) {
        message.error(err instanceof Error ? err.message : 'Something went wrong');
      }
    });

  return (
    <>
      <PageHeader
        title="Hotels"
        subtitle="Manage hotels and their rooms"
        extra={
          <Button type="primary" icon={<PlusOutlined />} onClick={openCreate}>
            New hotel
          </Button>
        }
      />
      <DataTable<Hotel>
        onSearch={setQuery}
        searchPlaceholder="Search hotels…"
        rowKey="id"
        dataSource={filtered}
        pagination={false}
        columns={[
          { title: 'Name', dataIndex: 'name' },
          { title: 'Address', dataIndex: 'address', render: (v?: string) => v ?? '—' },
          {
            title: 'Actions',
            key: 'actions',
            width: 220,
            render: (_, row) => (
              <>
                <Button type="link" onClick={() => router.push(`/hotels/${row.id}/rooms`)}>
                  Rooms
                </Button>
                <Button type="link" onClick={() => openEdit(row)}>
                  Edit
                </Button>
                <Popconfirm title="Delete hotel?" onConfirm={() => handleDelete(row.id)}>
                  <Button type="link" danger>
                    Delete
                  </Button>
                </Popconfirm>
              </>
            ),
          },
        ]}
      />
      <FormModal<HotelFormValues>
        key={editing?.id ?? 'new'}
        open={formOpen}
        title={editing ? 'Edit hotel' : 'New hotel'}
        initialValues={editing ? { name: editing.name, address: editing.address } : undefined}
        onCancel={() => setFormOpen(false)}
        onSubmit={handleSubmit}
      >
        <Form.Item name="name" label="Name" rules={[{ required: true, message: 'Enter a name' }]}>
          <Input placeholder="e.g. Grand Hotel" />
        </Form.Item>
        <Form.Item name="address" label="Address">
          <Input placeholder="e.g. 123 Main St" />
        </Form.Item>
      </FormModal>
    </>
  );
}
