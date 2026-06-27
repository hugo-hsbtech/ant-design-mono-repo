import { test, expect } from '@playwright/test';
import { login } from './helpers';

test('a viewer cannot see write actions', async ({ page }) => {
  await login(page, 'alan@plataforma.dev'); // viewer of apollo
  await expect(page).toHaveURL(/\/apollo(\/|$)/);
  await expect(page.getByRole('button', { name: 'Novo projeto' })).toHaveCount(0);
});

test('a non-member gets 404 for another org (no cross-tenant access)', async ({ page }) => {
  await login(page, 'alan@plataforma.dev'); // not a member of hermes
  const res = await page.goto('/hermes');
  expect(res?.status()).toBe(404);
});
