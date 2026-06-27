import { test, expect } from '@playwright/test';
import { login } from './helpers';

test('redirects unauthenticated users to /login', async ({ page }) => {
  await page.goto('/apollo');
  await expect(page).toHaveURL(/\/login$/);
});

test('logs in via the dev provider and lands on the org dashboard', async ({ page }) => {
  await login(page, 'ada@plataforma.dev');
  await expect(page).toHaveURL(/\/apollo(\/|$)/);
  await expect(page.getByRole('heading', { name: 'Projetos' })).toBeVisible();
});
