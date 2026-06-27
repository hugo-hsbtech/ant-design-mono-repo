import { test, expect } from '@playwright/test';
import { login } from './helpers';

test('switches organization via the OrgSwitcher', async ({ page }) => {
  await login(page, 'ada@plataforma.dev');
  await expect(page).toHaveURL(/\/apollo(\/|$)/);

  await page.getByRole('button', { name: 'Trocar de organização' }).click();
  await page.getByRole('menuitem', { name: /hermes/i }).click();

  await expect(page).toHaveURL(/\/hermes(\/|$)/);
});
