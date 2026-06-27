'use client';
import { Button, Drawer, Form, Space, type DrawerProps, type FormProps } from 'antd';
import { useState, type ReactNode } from 'react';

export interface FormDrawerProps<Values>
  extends Pick<DrawerProps, 'open' | 'title' | 'width'> {
  onClose: () => void;
  onSubmit: (values: Values) => void | Promise<void>;
  initialValues?: Partial<Values>;
  children: ReactNode;
  submitText?: string;
  cancelText?: string;
  formProps?: Omit<FormProps<Values>, 'form' | 'initialValues' | 'onFinish'>;
}

/** Drawer + Form for create/edit flows (wider forms / side panels). */
export function FormDrawer<Values extends object = Record<string, unknown>>({
  open,
  title,
  width = 480,
  onClose,
  onSubmit,
  initialValues,
  children,
  submitText = 'Salvar',
  cancelText = 'Cancelar',
  formProps,
}: FormDrawerProps<Values>) {
  const [form] = Form.useForm<Values>();
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    const values = await form.validateFields();
    setSubmitting(true);
    try {
      await onSubmit(values);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Drawer
      open={open}
      title={title}
      width={width}
      onClose={onClose}
      destroyOnClose
      footer={
        <Space style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button onClick={onClose}>{cancelText}</Button>
          <Button type="primary" loading={submitting} onClick={handleSubmit}>
            {submitText}
          </Button>
        </Space>
      }
    >
      <Form<Values>
        form={form}
        layout="vertical"
        initialValues={initialValues as Values}
        onFinish={handleSubmit}
        {...formProps}
      >
        {children}
      </Form>
    </Drawer>
  );
}
