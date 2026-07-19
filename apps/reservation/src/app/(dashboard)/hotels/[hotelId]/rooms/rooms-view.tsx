'use client';
import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import {
  App,
  Button,
  DataTable,
  Form,
  FormDrawer,
  Input,
  InputNumber,
  PageHeader,
  Popconfirm,
} from '@repo/design-system';
import { PlusOutlined } from '@ant-design/icons';
import type { Hotel, Room } from '@/lib/types';
import { createRoomAction, deleteRoomAction, updateRoomAction } from './actions';

interface RoomFormValues {
  number: string;
  type?: string;
  capacity?: number;
}

export function RoomsView({ hotel, rooms }: { hotel: Hotel; rooms: Room[] }) {
  const { message } = App.useApp();
  const router = useRouter();
  const [editing, setEditing] = useState<Room | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [, startTransition] = useTransition();

  const openCreate = () => {
    setEditing(null);
    setDrawerOpen(true);
  };
  const openEdit = (room: Room) => {
    setEditing(room);
    setDrawerOpen(true);
  };

  const handleSubmit = async (values: RoomFormValues) => {
    try {
      if (editing) {
        await updateRoomAction(hotel.id, editing.id, values);
        message.success('Room updated');
      } else {
        await createRoomAction(hotel.id, values);
        message.success('Room created');
      }
      setDrawerOpen(false);
      router.refresh();
    } catch (err) {
      message.error(err instanceof Error ? err.message : 'Something went wrong');
    }
  };

  const handleDelete = (id: string) =>
    startTransition(async () => {
      try {
        await deleteRoomAction(hotel.id, id);
        message.success('Room deleted');
        router.refresh();
      } catch (err) {
        message.error(err instanceof Error ? err.message : 'Something went wrong');
      }
    });

  return (
    <>
      <PageHeader
        title={hotel.name}
        subtitle="Rooms"
        onBack={() => router.push('/hotels')}
        breadcrumb={[{ title: 'Hotels', href: '/hotels' }, { title: hotel.name }]}
        extra={
          <Button type="primary" icon={<PlusOutlined />} onClick={openCreate}>
            New room
          </Button>
        }
      />
      <DataTable<Room>
        rowKey="id"
        dataSource={rooms}
        pagination={false}
        columns={[
          { title: 'Number', dataIndex: 'number' },
          { title: 'Type', dataIndex: 'type', render: (v?: string) => v ?? '—' },
          { title: 'Capacity', dataIndex: 'capacity', render: (v?: number) => v ?? '—' },
          {
            title: 'Actions',
            key: 'actions',
            width: 160,
            render: (_, row) => (
              <>
                <Button type="link" onClick={() => openEdit(row)}>
                  Edit
                </Button>
                <Popconfirm title="Delete room?" onConfirm={() => handleDelete(row.id)}>
                  <Button type="link" danger>
                    Delete
                  </Button>
                </Popconfirm>
              </>
            ),
          },
        ]}
      />
      <FormDrawer<RoomFormValues>
        key={editing?.id ?? 'new'}
        open={drawerOpen}
        title={editing ? 'Edit room' : 'New room'}
        initialValues={
          editing
            ? { number: editing.number, type: editing.type, capacity: editing.capacity }
            : undefined
        }
        onClose={() => setDrawerOpen(false)}
        onSubmit={handleSubmit}
        submitText="Save"
        cancelText="Cancel"
      >
        <Form.Item
          name="number"
          label="Number"
          rules={[{ required: true, message: 'Enter a room number' }]}
        >
          <Input placeholder="e.g. 101" />
        </Form.Item>
        <Form.Item name="type" label="Type">
          <Input placeholder="e.g. double" />
        </Form.Item>
        <Form.Item name="capacity" label="Capacity">
          <InputNumber min={1} style={{ width: '100%' }} placeholder="e.g. 2" />
        </Form.Item>
      </FormDrawer>
    </>
  );
}
