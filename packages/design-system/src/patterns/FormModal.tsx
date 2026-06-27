'use client';
import { Form, Modal, type FormProps, type ModalProps } from 'antd';
import { useState, type ReactNode } from 'react';

export interface FormModalProps<Values>
  extends Pick<ModalProps, 'open' | 'title' | 'width' | 'okText' | 'cancelText'> {
  onCancel: () => void;
  /** Receives validated form values; may be async (mutation). */
  onSubmit: (values: Values) => void | Promise<void>;
  initialValues?: Partial<Values>;
  /** Form fields. */
  children: ReactNode;
  formProps?: Omit<FormProps<Values>, 'form' | 'initialValues' | 'onFinish'>;
}

/**
 * Modal + Form for create/edit flows. Validates on OK, surfaces a loading
 * state while `onSubmit` runs, and only closes once it resolves.
 */
export function FormModal<Values extends object = Record<string, unknown>>({
  open,
  title,
  width,
  okText = 'Salvar',
  cancelText = 'Cancelar',
  onCancel,
  onSubmit,
  initialValues,
  children,
  formProps,
}: FormModalProps<Values>) {
  const [form] = Form.useForm<Values>();
  const [submitting, setSubmitting] = useState(false);

  const handleOk = async () => {
    const values = await form.validateFields();
    setSubmitting(true);
    try {
      await onSubmit(values);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal
      open={open}
      title={title}
      width={width}
      okText={okText}
      cancelText={cancelText}
      confirmLoading={submitting}
      onOk={handleOk}
      onCancel={onCancel}
      destroyOnClose
      forceRender
    >
      <Form<Values>
        form={form}
        layout="vertical"
        initialValues={initialValues as Values}
        onFinish={handleOk}
        {...formProps}
      >
        {children}
      </Form>
    </Modal>
  );
}
