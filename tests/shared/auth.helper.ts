import { Page } from '@playwright/test';

// ─── Shared credentials & base URL ─────────────────────────────────────────
export const TEST_CREDENTIALS = {
  username: 'testuser',
  password: 'Password@123',
};

export const RESTRICTED_CREDENTIALS = {
  username: 'restricted_user',
  password: TEST_CREDENTIALS.password,
};

export const BASE_URL = 'https://dev-ui.qcmetric.com';

export const TENANT = {
  name: 'ATPL',
  code: 'OP-TESTDEVCOM-001',
  plant: 'Hyderabad',
};

// ─── Authentication ─────────────────────────────────────────────────────────

/**
 * Logs in with the provided credentials and waits for tenant selection page.
 * Then selects the default ATPL tenant and Hyderabad plant.
 * Lands on the dashboard after successful login.
 */
export async function login(
  page: Page,
  username = TEST_CREDENTIALS.username,
  password = TEST_CREDENTIALS.password,
): Promise<void> {
  await page.goto(`${BASE_URL}/login`);
  await page.waitForLoadState('domcontentloaded');

  await page.getByRole('textbox', { name: /username|email/i }).fill(username);
  await page.getByRole('textbox', { name: /password/i }).fill(password);
  await page.getByRole('button', { name: /sign in|login/i }).click();

  // Wait until we land on tenant-selection OR dashboard (app may redirect via dashboard)
  await page.waitForURL(
    (url) =>
      url.pathname.includes('/tenants-selection') ||
      url.pathname.includes('/dashboard') ||
      url.pathname.includes('/content') ||
      url.pathname.includes('/request'),
    { timeout: 30_000 },
  );

  // Complete tenant + plant selection if we are on that page
  await selectTenantAndPlant(page, TENANT.name, TENANT.plant);
}

/**
 * Selects a tenant and plant on the tenant-selection page.
 * Safely no-ops if the page is not the tenant-selection screen.
 *
 * DOM insight: the ATPL tenant card is already EXPANDED on initial page load.
 * The "1 plant" badge and ATPL header <P> are both toggles — clicking them
 * COLLAPSES the tree, hiding the plant card. We must NOT click them.
 * Instead, we directly click the plant <P> element (cursor:pointer) which
 * triggers navigation to /dashboard.
 */
export async function selectTenantAndPlant(
  page: Page,
  tenantName = TENANT.name,
  plantName = TENANT.plant,
): Promise<void> {
  // Wait a moment in case the app is still redirecting
  await page.waitForTimeout(500);

  if (!page.url().includes('/tenants-selection')) return;

  await page.waitForLoadState('domcontentloaded');
  await page.waitForTimeout(1500); // allow tree to fully render

  // The plant <P> element (cursor:pointer) is already visible since the tenant
  // card starts expanded. Locate it using an exact-text regex on <p> tags.
  const plantP = page.locator('p').filter({ hasText: new RegExp(`^\\s*${plantName}\\s*$`) });

  // If the plant is not visible within 3 s, the card may be collapsed — try
  // to expand it by clicking the tenant <P> header (expands when collapsed).
  const isVisible = await plantP
    .waitFor({ state: 'visible', timeout: 3_000 })
    .then(() => true)
    .catch(() => false);

  if (!isVisible) {
    const tenantP = page
      .locator('p')
      .filter({ hasText: new RegExp(`^\\s*${tenantName}\\s*$`) })
      .first();
    await tenantP.click().catch(() => {});
    await page.waitForTimeout(800);
  }

  // Wait for the plant <P> to be visible then click it.
  // Use Promise.all so waitForURL listener is registered before the click fires.
  await plantP.waitFor({ state: 'visible', timeout: 10_000 });
  await Promise.all([
    page.waitForURL(
      (url) => !url.pathname.includes('/tenants-selection'),
      { timeout: 30_000 },
    ),
    plantP.first().click(),
  ]);

  // Wait for the dashboard to be interactive
  await page.waitForLoadState('domcontentloaded');
}
