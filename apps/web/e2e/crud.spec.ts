import { test, expect } from '@playwright/test';
import { login } from './helpers';

test('creates and deletes a project (CRUD end-to-end)', async ({ page }) => {
  await login(page, 'ada@plataforma.dev');
  const name = `E2E Projeto ${Date.now()}`;

  await page.getByRole('button', { name: 'Novo projeto' }).click();
  const dialog = page.getByRole('dialog');
  await dialog.getByLabel('Nome').fill(name);
  await dialog.getByRole('button', { name: 'Salvar' }).click();

  await expect(page.getByRole('cell', { name })).toBeVisible();

  const row = page.getByRole('row').filter({ hasText: name });
  await row.getByRole('button', { name: 'Excluir' }).click();
  await page.getByRole('button', { name: 'OK' }).click();
  await expect(page.getByRole('cell', { name })).toHaveCount(0);
});
