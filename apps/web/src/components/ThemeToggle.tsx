'use client';
import { Button, useThemeMode } from '@repo/design-system';
import { BulbFilled, BulbOutlined } from '@ant-design/icons';

/** Toggles light/dark, persisted via the cookie (see app/providers). */
export function ThemeToggle() {
  const { mode, toggle } = useThemeMode();
  return (
    <Button
      type="text"
      aria-label={mode === 'dark' ? 'Mudar para tema claro' : 'Mudar para tema escuro'}
      icon={mode === 'dark' ? <BulbFilled /> : <BulbOutlined />}
      onClick={toggle}
    />
  );
}
