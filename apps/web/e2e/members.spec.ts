import { test, expect } from '@playwright/test';
import { login } from './helpers';

test('owner invites a member', async ({ page }) => {
  await login(page, 'ada@plataforma.dev');
  await page.goto('/apollo/members');
  await expect(page.getByRole('heading', { name: 'Membros', level: 3 })).toBeVisible();

  await page.getByRole('button', { name: 'Convidar' }).click();
  const dialog = page.getByRole('dialog');
  await dialog.getByLabel('E-mail').fill('grace@plataforma.dev');
  await dialog.getByRole('button', { name: 'Salvar' }).click();

  await expect(page.getByRole('cell', { name: 'grace@plataforma.dev' })).toBeVisible();
});
