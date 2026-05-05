import { test, expect, Page } from '@playwright/test';
import { loginAndNavigateToRequestInitiation } from './helpers/auth.helper';
import { RequestInitiationPage } from '../../pages/RequestInitiationPage';

test.describe('RI-11 | Collaboration Toggle', () => {
  let page: Page;
  let requestPage: RequestInitiationPage;

  test.beforeEach(async ({ browser }) => {
    page = await browser.newPage();
    await loginAndNavigateToRequestInitiation(page);
    requestPage = new RequestInitiationPage(page);
    await requestPage.waitForFormVisible();
  });

  test.afterEach(async () => {
    await page.close();
  });

  test('TC-11a | RI-11 — Collaboration toggle is visible on the form', async () => {
    await expect(requestPage.collaborationToggle).toBeVisible({ timeout: 10_000 });
  });

  test('TC-11b | RI-11 — Enabling collaboration shows the collaborator section', async () => {
    await requestPage.enableCollaboration();
    await expect(requestPage.collaboratorList).toBeVisible({ timeout: 5_000 });
    await expect(requestPage.addCollaboratorBtn).toBeVisible({ timeout: 5_000 });
  });

  test('TC-11c | RI-11 — A collaborator can be added when collaboration is enabled', async () => {
    await requestPage.enableCollaboration();
    const countBefore = await requestPage.getCollaboratorCount();
    await requestPage.addCollaborator();
    const countAfter = await requestPage.getCollaboratorCount();
    expect(countAfter).toBeGreaterThan(countBefore);
  });

  test('TC-11d | RI-11 — Disabling collaboration hides collaborator section', async () => {
    // Enable then disable
    await requestPage.enableCollaboration();
    await expect(requestPage.collaboratorList).toBeVisible({ timeout: 5_000 });
    await requestPage.collaborationToggle.click();
    await page.waitForTimeout(300);
    await expect(requestPage.collaboratorList).toBeHidden({ timeout: 5_000 });
  });
});
