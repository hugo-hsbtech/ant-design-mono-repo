'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { signIn } from 'next-auth/react';
import { Alert, Button, Card, Form, Input, Typography } from '@repo/design-system';

const { Title, Paragraph } = Typography;
const EXAMPLE_EMAIL = 'ada@plataforma.dev';

export default function LoginPage() {
  const t = useTranslations('auth');
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const onFinish = async ({ email }: { email: string }) => {
    setLoading(true);
    setError(null);
    const res = await signIn('credentials', { email, redirect: false });
    setLoading(false);
    if (res?.error) {
      setError(t('unknownEmail', { example: EXAMPLE_EMAIL }));
      return;
    }
    router.push('/');
  };

  return (
    <main style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', padding: 24 }}>
      <Card style={{ width: 380, maxWidth: '100%' }}>
        <Title level={3}>{t('title')}</Title>
        <Paragraph type="secondary">{t('devHint', { example: EXAMPLE_EMAIL })}</Paragraph>
        {error && <Alert type="error" message={error} showIcon style={{ marginBottom: 16 }} />}
        <Form layout="vertical" onFinish={onFinish} requiredMark={false}>
          <Form.Item
            name="email"
            label={t('emailLabel')}
            rules={[{ required: true, type: 'email', message: t('invalidEmail') }]}
          >
            <Input placeholder="voce@plataforma.dev" autoComplete="email" />
          </Form.Item>
          <Button type="primary" htmlType="submit" block loading={loading}>
            {t('submit')}
          </Button>
        </Form>
      </Card>
    </main>
  );
}
