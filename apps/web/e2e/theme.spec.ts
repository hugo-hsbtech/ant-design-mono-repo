import { test, expect } from '@playwright/test';
import { login } from './helpers';

test('theme toggle persists across reloads (SSR cookie)', async ({ page }) => {
  await login(page, 'ada@plataforma.dev');
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');

  await page.getByRole('button', { name: 'Mudar para tema escuro' }).click();
  await page.reload();

  // The server read the cookie and rendered dark on first paint.
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
});
