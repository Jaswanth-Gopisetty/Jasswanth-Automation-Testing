import { test, expect, Page } from '@playwright/test';
import { loginAndNavigateToRequestInitiation } from './helpers/auth.helper';
import { RequestInitiationPage } from '../../pages/RequestInitiationPage';

/** Fills all mandatory form fields with valid data. */
async function fillRequiredFields(requestPage: RequestInitiationPage): Promise<void> {
  await requestPage.selectContentType();
  await requestPage.selectDepartment();
  await requestPage.selectAuthor();
  await requestPage.selectRequestApprover();
  await requestPage.contentTitleInput.fill(`Ext User Title ${Date.now()}`);
  await requestPage.purposeField.fill('Purpose for external user test');
}

test.describe('RI-23-30 | External Reviewer & External Approver', () => {
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

  // ─── External Reviewer ───────────────────────────────────────────────────

  test('TC-23 | RI-23 — Enabling External Reviewer checkbox shows email input field', async () => {
    await expect(requestPage.externalReviewerCheckbox).toBeVisible({ timeout: 10_000 });
    await requestPage.enableExternalReviewer();
    await expect(requestPage.externalReviewerEmail).toBeVisible({ timeout: 5_000 });
  });

  test('TC-24 | RI-24 — Submission is blocked when External Reviewer is enabled but email is empty', async () => {
    await fillRequiredFields(requestPage);
    await requestPage.enableExternalReviewer();
    // Leave email field blank

    await requestPage.clickSubmit();

    await expect(requestPage.externalReviewerEmailError).toBeVisible({ timeout: 5_000 });
    const errText = await requestPage.externalReviewerEmailError.textContent();
    expect(errText?.toLowerCase()).toMatch(/required|mandatory|enter|provide/);
  });

  test('TC-25 | RI-25 — Valid external reviewer email is accepted and form submits', async () => {
    await fillRequiredFields(requestPage);
    await requestPage.enableExternalReviewer();
    await requestPage.externalReviewerEmail.fill('reviewer@example.com');

    await requestPage.clickSubmit();

    // Error should NOT appear for external reviewer email
    const hasError = await requestPage.hasValidationError('external-reviewer-email-error');
    expect(hasError).toBe(false);
  });

  test('TC-26 | RI-26 — Invalid email format for external reviewer shows error', async () => {
    await fillRequiredFields(requestPage);
    await requestPage.enableExternalReviewer();
    await requestPage.externalReviewerEmail.fill('not-an-email');

    await requestPage.clickSubmit();

    await expect(requestPage.externalReviewerEmailError).toBeVisible({ timeout: 5_000 });
    const errText = await requestPage.externalReviewerEmailError.textContent();
    expect(errText?.toLowerCase()).toMatch(/invalid|format|valid email/);
  });

  // ─── External Approver ────────────────────────────────────────────────────

  test('TC-27 | RI-27 — Enabling External Approver checkbox shows email input field', async () => {
    await expect(requestPage.externalApproverCheckbox).toBeVisible({ timeout: 10_000 });
    await requestPage.enableExternalApprover();
    await expect(requestPage.externalApproverEmail).toBeVisible({ timeout: 5_000 });
  });

  test('TC-28 | RI-28 — Submission is blocked when External Approver is enabled but email is empty', async () => {
    await fillRequiredFields(requestPage);
    await requestPage.enableExternalApprover();
    // Leave email field blank

    await requestPage.clickSubmit();

    await expect(requestPage.externalApproverEmailError).toBeVisible({ timeout: 5_000 });
    const errText = await requestPage.externalApproverEmailError.textContent();
    expect(errText?.toLowerCase()).toMatch(/required|mandatory|enter|provide/);
  });

  test('TC-29 | RI-29 — Form submits successfully with valid external approver email', async () => {
    await fillRequiredFields(requestPage);
    await requestPage.enableExternalApprover();
    await requestPage.externalApproverEmail.fill('approver@example.com');

    await requestPage.clickSubmit();

    await expect(requestPage.successToast).toBeVisible({ timeout: 15_000 });
  });

  test('TC-30 | RI-30 — Disabling External Reviewer checkbox hides the email field', async () => {
    await requestPage.enableExternalReviewer();
    await expect(requestPage.externalReviewerEmail).toBeVisible({ timeout: 5_000 });

    await requestPage.disableExternalReviewer();
    await page.waitForTimeout(300);
    await expect(requestPage.externalReviewerEmail).toBeHidden({ timeout: 5_000 });
  });
});
