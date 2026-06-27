'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { Alert, Button, Card, Form, Input, Typography } from '@repo/design-system';

const { Title, Paragraph, Text } = Typography;

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const onFinish = async ({ email }: { email: string }) => {
    setLoading(true);
    setError(null);
    const res = await signIn('credentials', { email, redirect: false });
    setLoading(false);
    if (res?.error) {
      setError('E-mail não reconhecido. Tente ada@plataforma.dev');
      return;
    }
    router.push('/');
  };

  return (
    <main
      style={{
        minHeight: '100vh',
        display: 'grid',
        placeItems: 'center',
        padding: 24,
      }}
    >
      <Card style={{ width: 380, maxWidth: '100%' }}>
        <Title level={3}>Entrar</Title>
        <Paragraph type="secondary">
          Ambiente de desenvolvimento — use <Text code>ada@plataforma.dev</Text> ou{' '}
          <Text code>alan@plataforma.dev</Text>.
        </Paragraph>
        {error && <Alert type="error" message={error} showIcon style={{ marginBottom: 16 }} />}
        <Form layout="vertical" onFinish={onFinish} requiredMark={false}>
          <Form.Item
            name="email"
            label="E-mail"
            rules={[{ required: true, type: 'email', message: 'Informe um e-mail válido' }]}
          >
            <Input placeholder="voce@plataforma.dev" autoComplete="email" />
          </Form.Item>
          <Button type="primary" htmlType="submit" block loading={loading}>
            Entrar
          </Button>
        </Form>
      </Card>
    </main>
  );
}
