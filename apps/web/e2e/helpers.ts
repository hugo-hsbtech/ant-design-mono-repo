import { expect, type Page } from '@playwright/test';

/** Log in via the dev Credentials provider (email-only) and wait for an org. */
export async function login(page: Page, email = 'ada@plataforma.dev') {
  await page.goto('/login');
  await page.getByLabel('E-mail').fill(email);
  await page.getByRole('button', { name: 'Entrar' }).click();
  await page.waitForURL(/\/(apollo|hermes)(\/|$)/);
  await expect(page.getByRole('heading', { name: 'Projetos' })).toBeVisible();
}
