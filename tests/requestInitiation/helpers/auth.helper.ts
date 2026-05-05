import { Page } from '@playwright/test';
import { BASE_URL } from '../../shared/auth.helper';

// Re-export everything from shared helper
export { TEST_CREDENTIALS, RESTRICTED_CREDENTIALS, BASE_URL, TENANT, login, selectTenantAndPlant } from '../../shared/auth.helper';

/**
 * Navigates from the dashboard to the Request Initiation form.
 * Pre-condition: user must already be logged in and on the dashboard.
 */
export async function navigateToRequestInitiation(page: Page): Promise<void> {
  // ── Step 7: Click 'Content Management' module card on the dashboard ────
  // Match by both heading text AND description text to uniquely target the card
  // regardless of its CSS class names.
  const contentMgmtCard = page
    .locator('div, article, section, a, li')
    .filter({ hasText: /Content Management/i })
    .filter({ hasText: /Create, review|version control|approval workflow/i })
    .first();

  // Fallback: just find the heading and click its closest ancestor that is
  // interactive (has a cursor:pointer or role=button/link).
  const isVisible = await contentMgmtCard
    .waitFor({ state: 'visible', timeout: 5_000 })
    .then(() => true)
    .catch(() => false);

  if (isVisible) {
    await contentMgmtCard.click();
  } else {
    // Fallback: click the heading directly (the card itself may be a link)
    await page
      .getByRole('heading', { name: /content management/i })
      .first()
      .click();
  }

  // ── Step 8: Wait for navigation away from dashboard ─────────────────────
  // The Content Management card may land on /quality, /content, /documents, etc.
  await page.waitForURL(
    (url) => !url.pathname.includes('/dashboard'),
    { timeout: 30_000 },
  );
  await page.waitForLoadState('domcontentloaded');

  // ── Step 9: Click 'Content' in the sidebar to expand it ────────────────
  const sidebarContent = page
    .locator('nav, aside, [class*="sidebar"], [class*="menu"]')
    .getByText('Content', { exact: true })
    .first();
  await sidebarContent.waitFor({ state: 'visible', timeout: 10_000 });
  await sidebarContent.click();
  await page.waitForTimeout(400);

  // ── Step 10: Click 'Roles' in the sidebar submenu ───────────────────────
  const rolesLink = page
    .locator('nav, aside, [class*="sidebar"], [class*="menu"]')
    .getByText('Roles', { exact: true })
    .first();
  await rolesLink.waitFor({ state: 'visible', timeout: 10_000 });
  await rolesLink.click();
  await page.waitForLoadState('domcontentloaded');

  // ── Step 11: On the "Document Roles" page, open the "Choose a role..." dropdown ─
  const roleDropdown = page
    .locator('[role="combobox"], [class*="select"], button')
    .filter({ hasText: /choose a role|select role/i })
    .first();
  await roleDropdown.waitFor({ state: 'visible', timeout: 10_000 });
  await roleDropdown.click();
  await page.waitForTimeout(300);

  // ── Step 12: Pick "Request Initiation" from the dropdown options ─────────
  const requestInitOption = page
    .locator('[role="option"], [role="listbox"] li, ul li')
    .filter({ hasText: /^Request Initiation$/i })
    .first();
  await requestInitOption.waitFor({ state: 'visible', timeout: 5_000 });
  await requestInitOption.click();
  await page.waitForTimeout(400);

  // ── Step 13: Click the "+ Create Request Initiation" button ──────────────
  const createBtn = page
    .locator('a, button')
    .filter({ hasText: /Create Request Initiation/i })
    .first();
  await createBtn.waitFor({ state: 'visible', timeout: 10_000 });
  await createBtn.click();

  // The form opens as a modal on the same page — wait for its heading
  await page.getByText('New Request', { exact: false }).waitFor({ state: 'visible', timeout: 15_000 });
  await page.waitForLoadState('domcontentloaded');
}

/**
 * Full login + navigate to Request Initiation form in one call.
 * Used in beforeEach for tests that always need the form open.
 */
export async function loginAndNavigateToRequestInitiation(
  page: Page,
  username?: string,
  password?: string,
): Promise<void> {
  const { login } = await import('../../shared/auth.helper');
  await login(page, username, password);
  await navigateToRequestInitiation(page);
}
