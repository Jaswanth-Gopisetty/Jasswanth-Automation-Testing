import { test, expect, Page } from '@playwright/test';
import { loginAndNavigateToRequestInitiation, BASE_URL } from './helpers/auth.helper';
import { RequestInitiationPage } from '../../pages/RequestInitiationPage';

/** Fills all mandatory form fields with valid data. */
async function fillRequiredFields(requestPage: RequestInitiationPage): Promise<void> {
  await requestPage.selectContentType();
  await requestPage.selectDepartment();
  await requestPage.selectAuthor();
  await requestPage.selectRequestApprover();
  await requestPage.contentTitleInput.fill(`Additional Test Title ${Date.now()}`);
  await requestPage.purposeField.fill('Valid purpose for additional validations');
}

test.describe('RI-43-53 | Additional Validations', () => {
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

  // ─── TC-43 | Collaboration ──────────────────────────────────────────────────

  test('TC-43 | RI-43 — Adding the same collaborator twice prevents duplication', async () => {
    await requestPage.enableCollaboration();
    await requestPage.addCollaborator();
    const countAfterFirst = await requestPage.getCollaboratorCount();

    // Attempt to add the same user again
    await requestPage.addCollaboratorBtn.click();
    await page.waitForTimeout(500);
    const option = page.locator('[role="option"]:not([aria-disabled="true"])').first();
    await option.click();
    await page.waitForTimeout(500);

    const countAfterSecond = await requestPage.getCollaboratorCount();
    const hasDuplicateError = await requestPage.hasValidationError('duplicate-collaborator-error');

    // Either count is unchanged (duplicate blocked) OR an error is shown
    expect(countAfterSecond === countAfterFirst || hasDuplicateError).toBe(true);
  });

  // ─── TC-44 | Template ───────────────────────────────────────────────────────

  test('TC-44 | RI-44 — View icon disappears after template is deselected or cleared', async () => {
    await requestPage.selectContentType();
    await requestPage.selectDepartment();
    await page.waitForTimeout(500);
    await requestPage.selectTemplate();
    await page.waitForTimeout(500);
    await expect(requestPage.templateViewIcon).toBeVisible({ timeout: 5_000 });

    // Clear the template by opening the dropdown and choosing the empty/placeholder option
    await requestPage.templateDropdown.click();
    await page.waitForTimeout(500);
    const emptyOption = page
      .locator('[role="option"]')
      .filter({ hasText: /^(-+|none|select|clear|--|)$/i })
      .first();
    const emptyCount = await emptyOption.count();
    if (emptyCount > 0) {
      await emptyOption.click();
    } else {
      await page.keyboard.press('Escape');
    }
    await page.waitForTimeout(500);

    await expect(requestPage.templateViewIcon).toBeHidden({ timeout: 5_000 });
  });

  // ─── TC-45–48 | External Approver email validations ────────────────────────

  test('TC-45 | RI-45 — Invalid email formats in External Approver field each show a validation error', async () => {
    await fillRequiredFields(requestPage);
    await requestPage.enableExternalApprover();

    const invalidEmails = ['notanemail', 'missing@', '@nodomain.com', 'spaces in@test.com'];
    for (const email of invalidEmails) {
      await requestPage.externalApproverEmail.fill('');
      await requestPage.externalApproverEmail.fill(email);
      await requestPage.clickSubmit();

      await expect(requestPage.externalApproverEmailError).toBeVisible({ timeout: 5_000 });
      const errText = await requestPage.externalApproverEmailError.textContent();
      expect(errText?.toLowerCase()).toMatch(/invalid|format|valid email/);
    }
  });

  test('TC-46 | RI-46 — Spaces-only email in External Approver field shows validation error', async () => {
    await fillRequiredFields(requestPage);
    await requestPage.enableExternalApprover();
    await requestPage.externalApproverEmail.fill('   ');

    await requestPage.clickSubmit();

    await expect(requestPage.externalApproverEmailError).toBeVisible({ timeout: 5_000 });
    const errText = await requestPage.externalApproverEmailError.textContent();
    expect(errText?.toLowerCase()).toMatch(/required|invalid|enter|provide/);
  });

  test('TC-47 | RI-47 — Valid email is accepted in External Approver field without error', async () => {
    await fillRequiredFields(requestPage);
    await requestPage.enableExternalApprover();
    await requestPage.externalApproverEmail.fill('testapprover@qcmetric.com');

    await requestPage.clickSubmit();

    const hasError = await requestPage.hasValidationError('external-approver-email-error');
    expect(hasError).toBe(false);
  });

  test('TC-48 | RI-48 — Both reviewer and approver email errors appear simultaneously when both checkboxes are enabled with empty emails', async () => {
    await fillRequiredFields(requestPage);
    await requestPage.enableExternalReviewer();
    await requestPage.enableExternalApprover();
    // Leave both email fields empty

    await requestPage.clickSubmit();

    await expect(requestPage.externalReviewerEmailError).toBeVisible({ timeout: 5_000 });
    await expect(requestPage.externalApproverEmailError).toBeVisible({ timeout: 5_000 });
  });

  // ─── TC-49–52 | Draft / Submit edge cases ──────────────────────────────────

  test('TC-49 | RI-49 — Reopening a saved draft pre-fills all previously entered data', async () => {
    const title = `Draft Prefill ${Date.now()}`;
    await requestPage.selectContentType();
    await requestPage.selectDepartment();
    await requestPage.contentTitleInput.fill(title);
    await requestPage.purposeField.fill('Draft prefill purpose');
    await requestPage.clickSaveDraft();
    await requestPage.successToast.waitFor({ state: 'visible', timeout: 10_000 });

    // Navigate to My Requests and reopen the draft
    await page.goto(`${BASE_URL}/requests`);
    await page.waitForLoadState('domcontentloaded');
    const draftRow = page
      .locator('[data-testid="request-row"], tr, li')
      .filter({ hasText: title })
      .first();
    await draftRow.waitFor({ state: 'visible', timeout: 15_000 });
    await draftRow.click();
    await page.waitForLoadState('domcontentloaded');

    // Verify the title is pre-filled
    const restoredTitle = await requestPage.contentTitleInput.inputValue();
    expect(restoredTitle).toBe(title);
  });

  test('TC-50 | RI-50 — Submitting with all mandatory fields empty shows all field errors simultaneously', async () => {
    // Do not fill any field
    await requestPage.clickSubmit();

    // All mandatory errors should appear at the same time
    await expect(requestPage.contentTypeError).toBeVisible({ timeout: 5_000 });
    await expect(requestPage.departmentError).toBeVisible({ timeout: 5_000 });
    await expect(requestPage.contentTitleError).toBeVisible({ timeout: 5_000 });
    await expect(requestPage.authorError).toBeVisible({ timeout: 5_000 });
    await expect(requestPage.approverError).toBeVisible({ timeout: 5_000 });
    await expect(requestPage.purposeError).toBeVisible({ timeout: 5_000 });
  });

  test('TC-51 | RI-51 — Double-clicking Submit does not create duplicate requests', async () => {
    await fillRequiredFields(requestPage);

    // Intercept POST /submit calls
    const submitCalls: string[] = [];
    page.on('request', (req) => {
      if (req.method() === 'POST' && req.url().includes('/submit')) {
        submitCalls.push(req.url());
      }
    });

    // Rapidly double-click the submit button
    await requestPage.submitBtn.waitFor({ state: 'visible', timeout: 10_000 });
    await requestPage.submitBtn.dblclick();
    await page.waitForTimeout(3_000);

    // Expect at most 1 API call fired
    expect(submitCalls.length).toBeLessThanOrEqual(1);
  });

  test('TC-52 | RI-52 — A submitted request is read-only and cannot be edited', async () => {
    await fillRequiredFields(requestPage);
    await requestPage.clickSubmit();
    await requestPage.successToast.waitFor({ state: 'visible', timeout: 15_000 });

    // Navigate to My Requests and open the submitted request
    await page.goto(`${BASE_URL}/requests`);
    await page.waitForLoadState('domcontentloaded');
    const submittedRow = page
      .locator('[data-testid="request-row"], tr, li')
      .filter({ hasText: /submitted/i })
      .first();
    await submittedRow.waitFor({ state: 'visible', timeout: 15_000 });
    await submittedRow.click();
    await page.waitForLoadState('domcontentloaded');

    // Form fields should be disabled or read-only
    const isDisabled = await requestPage.contentTitleInput.isDisabled();
    const isReadOnly = (await requestPage.contentTitleInput.getAttribute('readonly')) !== null;
    expect(isDisabled || isReadOnly).toBe(true);

    // Action buttons should not be visible
    await expect(requestPage.submitBtn).toBeHidden({ timeout: 5_000 });
    await expect(requestPage.saveDraftBtn).toBeHidden({ timeout: 5_000 });
  });

  // ─── TC-53 | Session / Auth ─────────────────────────────────────────────────

  test('TC-53 | RI-53 — Direct URL access without a session redirects to login', async ({ browser }) => {
    // Open a fresh context with no stored session (incognito-equivalent)
    const freshContext = await browser.newContext({ storageState: undefined });
    const freshPage = await freshContext.newPage();

    await freshPage.goto(`${BASE_URL}/requests/create`);
    await freshPage.waitForLoadState('domcontentloaded');

    const finalUrl = freshPage.url();
    const isRedirectedToAuth =
      finalUrl.includes('/login') || finalUrl.includes('/tenants-selection');

    if (!isRedirectedToAuth) {
      // Some apps render the login form in-place instead of hard-redirecting
      const loginForm = freshPage
        .locator('[data-testid="login-form"], form:has(input[name="password"])')
        .first();
      await expect(loginForm).toBeVisible({ timeout: 10_000 });
    } else {
      expect(isRedirectedToAuth).toBe(true);
    }

    await freshPage.close();
    await freshContext.close();
  });
});
