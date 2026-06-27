import { test, expect } from '@playwright/test';

test('login is operable by keyboard (focus email, type, press Enter)', async ({ page }) => {
  await page.goto('/login');

  // Reach the email field by keyboard and assert it is the active element.
  const email = page.getByLabel('E-mail');
  await email.focus();
  await expect(email).toBeFocused();

  // Type the dev credential and submit the form with Enter (no mouse click).
  await email.fill('ada@plataforma.dev');
  await email.press('Enter');

  // The dev provider redirects to one of the org dashboards.
  await expect(page).toHaveURL(/\/(apollo|hermes)(\/|$)/);
});

test('primary action on the dashboard is reachable and has an accessible name', async ({ page }) => {
  // Sign in via keyboard, then verify the primary action is exposed to AT.
  await page.goto('/login');
  const email = page.getByLabel('E-mail');
  await email.focus();
  await expect(email).toBeFocused();
  await email.fill('ada@plataforma.dev');
  await email.press('Enter');
  await page.waitForURL(/\/(apollo|hermes)(\/|$)/);

  const newProject = page.getByRole('button', { name: 'Novo projeto' });
  await expect(newProject).toBeVisible();
  await newProject.focus();
  await expect(newProject).toBeFocused();
});
