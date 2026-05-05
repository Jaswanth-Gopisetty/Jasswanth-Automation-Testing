# Copilot Instructions — QCMetric QA Automation

> **⚠️ MANDATORY: Read and follow ALL instructions below before writing or modifying ANY code in this project.**

---

## 📌 Project Overview

- **Framework:** Playwright + TypeScript
- **Pattern:** Test Data Driven + Page Object Model (POM)
- **Target:** QCMetric Quality Management System — `https://dev-ui.qcmetric.com`
- **Browser:** Chromium only, viewport `1440×900`
- **Execution:** Sequential (`workers: 1`, `fullyParallel: false`)
- **Timeout:** 3 minutes per test

---

## 📁 Folder Structure

```
├── test-data/                        → CSV files with test inputs (from manual testers)
├── pages/
│   └── RequestInitiationPage.ts      → RequestInitiationPage — all UI interactions for the RI form
├── utils/
│   ├── csv-helper.ts                 → CSV parsing utility (readCsvFile, loadTestData, getTestCase, etc.)
│   └── requestInitiationData.ts      → Random request data generator (generateRandomRequestData, uniqueRequestTitle)
├── tests/
│   ├── requestInitiation/            → Request Initiation feature specs + helpers
│   │   ├── helpers/
│   │   │   └── auth.helper.ts        → Re-exports shared auth + navigateToRequestInitiation(), loginAndNavigateToRequestInitiation()
│   │   ├── RI-01-02.access.spec.ts
│   │   ├── RI-03-06.form-fields.spec.ts
│   │   ├── RI-07-10.mandatory-validation.spec.ts
│   │   ├── RI-08-09.filtered-dropdowns.spec.ts
│   │   ├── RI-11.collaboration.spec.ts
│   │   ├── RI-12-13.change-control.spec.ts
│   │   ├── RI-14-16.draft-submit-history.spec.ts
│   │   ├── RI-17-22.template.spec.ts
│   │   ├── RI-23-30.external-users.spec.ts
│   │   ├── RI-31-42.field-validations.spec.ts
│   │   └── RI-43-53.additional-validations.spec.ts
│   └── shared/                       → Common helpers shared across ALL features
│       └── auth.helper.ts            → login(), selectTenantAndPlant(), TEST_CREDENTIALS, BASE_URL, TENANT
├── playwright.config.ts              → Playwright configuration
├── tsconfig.json                     → TypeScript configuration
└── package.json                      → Dependencies & scripts
```

> **📌 Folder naming convention:** The `shared/` folder is intentionally named to sort **after** all feature folders alphabetically, keeping it at the bottom of the VS Code Explorer.

---

## 🔴 CRITICAL RULES — MUST FOLLOW

### Rule 1: NEVER Hardcode Test Data

❌ **WRONG:**
```ts
test('TC-03 | RI-03 — Site ID is auto-populated', async ({ page }) => {
  expect(await page.inputValue('#site-id')).toBe('HYD');   // ← HARDCODED — NEVER
});
```

✅ **CORRECT:**
```ts
import { getTestCase, parseTestDataField } from '../../../utils/csv-helper';

const CSV_FILE = 'QCMetric_RequestInitiation_TestCases_AutomationReady.csv';

test('TC-03 | RI-03 — Site ID field is auto-populated and read-only', async ({ page }) => {
  const tc = getTestCase(CSV_FILE, 'TC-03');
  const siteId = await requestPage.getSiteIdValue();
  expect(siteId.length).toBeGreaterThan(0);
});
```

### Rule 2: NEVER Put Raw Locators in Spec Files

❌ **WRONG:**
```ts
test('TC-07 | RI-07 — Submission blocked without title', async ({ page }) => {
  await page.click('button:has-text("Submit")');             // ← RAW ACTION — NEVER
  await expect(page.getByText('mandatory')).toBeVisible();   // ← RAW LOCATOR — NEVER
});
```

✅ **CORRECT:**
```ts
// In pages/RequestInitiationPage.ts — add the method:
async clickSubmit(): Promise<void> { ... }

// In spec file — call the POM method:
test('TC-07 | RI-07 — Submission blocked without title', async ({ page }) => {
  await requestPage.clickSubmit();
  await expect(requestPage.contentTitleError).toBeVisible();
});
```

### Rule 3: ALWAYS Reuse Helpers — NEVER Duplicate

❌ **WRONG:**
```ts
// Duplicating auth/navigation logic inside a spec file
await page.goto('https://dev-ui.qcmetric.com/login');
await page.fill('input[name="username"]', 'testuser');
```

✅ **CORRECT:**
```ts
import { loginAndNavigateToRequestInitiation } from './helpers/auth.helper';

test.beforeEach(async ({ browser }) => {
  page = await browser.newPage();
  await loginAndNavigateToRequestInitiation(page);
});
```

### Rule 4: ALWAYS Import from Feature Helper — NOT Shared Helper

❌ **WRONG:**
```ts
import { login } from '../../shared/auth.helper';  // ← Direct import from shared — WRONG
```

✅ **CORRECT:**
```ts
import { login, navigateToRequestInitiation } from './helpers/auth.helper';  // ← Feature helper
```

### Rule 5: ALWAYS Reference Test Case IDs in Test Titles

❌ **WRONG:**
```ts
test('Verify the form is accessible', async ({ page }) => { ... });
```

✅ **CORRECT:**
```ts
test('TC-01 | RI-01 — Authorised user can navigate to Request Initiation page', async ({ page }) => { ... });
```

### Rule 6: ALWAYS Use `generateRandomRequestData()` for Form Submissions

❌ **WRONG:**
```ts
await requestPage.contentTitleInput.fill('My Test Document');   // ← HARDCODED — causes duplicates
```

✅ **CORRECT:**
```ts
import { generateRandomRequestData } from '../../../utils/requestInitiationData';

const data = generateRandomRequestData();
await requestPage.contentTitleInput.fill(data.title);
```

---

## 📗 CSV Utility — How to Use (`utils/csv-helper.ts`)

The project provides a CSV parsing utility. **Always use it to read test data.**

### Available Functions

| Function | Purpose | Returns |
|----------|---------|---------|
| `loadTestData(csvFileName)` | Load all test cases from a CSV file | `TestCaseRow[]` |
| `getTestCase(csvFileName, testCaseId)` | Get a single test case by ID (throws if not found) | `TestCaseRow` |
| `getTestsByScenario(csvFileName, scenarioName)` | Get test cases matching a scenario group | `TestCaseRow[]` |
| `readCsvFile(csvFileName)` | Low-level: returns raw CSV rows | `CsvRow[]` |
| `parseTestDataField(testDataStr)` | Parse `key: value` pairs from the "Test Data" column | `Record<string, string>` |

### TestCaseRow Fields

| Field | CSV Column | Example |
|-------|-----------|---------|
| `testCaseId` | Test Case # | `"TC-01"` |
| `testCaseDescription` | Test Case Description | `"Verify department user with initiation permission..."` |
| `testScenario` | Test Scenario Description | `"Access initiation page with valid permission"` |
| `preConditions` | Pre-Conditions | `"User logged in as testuser..."` |
| `userRole` | User Role | `"Qcmetric User"` |
| `testData` | Test Data | `"tenant: ATPL\nplant: Hyderabad"` |
| `navigationPath` | Navigation Path | `"Dashboard > Content Management > Roles > Request Initiation"` |
| `testSteps` | Test Steps (Automation-Ready) | `"1. Login\n2. Click Content Management..."` |
| `expectedResult` | Expected Result | `"New Request modal opens with form fields"` |
| `assertionDetails` | Assertion Details | `"Modal heading = 'New Request'"` |
| `locatorHint` | Element / Locator Hint | `"button: + Create Request Initiation"` |
| `apiToWaitFor` | API to Wait For | `"/api/requests/initiation/form"` |
| `testType` | Test Type | `"Positive"` |
| `priority` | Priority | `"P0"` |
| `isNegativeScenario` | Negative Scenario? | `true` / `false` |

### Usage Examples

```ts
import { loadTestData, getTestCase, parseTestDataField } from '../../../utils/csv-helper';

// Define CSV file name as a constant at the top of each spec file
const CSV_FILE = 'QCMetric_RequestInitiation_TestCases_AutomationReady.csv';

// ── Get a single test case ──
const tc = getTestCase(CSV_FILE, 'TC-01');
console.log(tc.testCaseDescription);   // "Verify department user with initiation permission..."
console.log(tc.expectedResult);        // "New Request modal opens..."

// ── Parse test data key-value pairs ──
const data = parseTestDataField(tc.testData);
console.log(data.tenant);   // "ATPL"
console.log(data.plant);    // "Hyderabad"

// ── Load all test cases ──
const allTests = loadTestData(CSV_FILE);
allTests.forEach(tc => console.log(tc.testCaseId));   // TC-01, TC-02, ...TC-53

// ── Filter by scenario ──
const validationTests = getTestsByScenario(CSV_FILE, 'mandatory');
```

---

## 📦 Request Initiation Data Utility (`utils/requestInitiationData.ts`)

### Available Exports

| Export | Type | Purpose |
|--------|------|---------|
| `RequestInitiationData` | Interface | Shape of all RI form data fields |
| `generateRandomRequestData(overrides?)` | Function | Generates a full random form dataset |
| `uniqueRequestTitle(base?)` | Function | Unique title with 4-char alphanumeric suffix |
| `INVALID_EMAILS` | `string[]` | Invalid email formats for negative email tests (TC-45..48) |
| `EDGE_CASE_TITLES` | Object | Edge-case title strings (`spacesOnly`, `longTitle`, etc.) for TC-31..42 |
| `API_ENDPOINTS` | Object | All API URL patterns for intercept helpers |
| `waitForApiResponse()` | Function | Wait for a specific API response |
| `waitForApiRequest()` | Function | Wait for a specific API request |
| `assertNoApiCall()` | Function | Assert no API call is made (validates client-side blocking) |
| `mockApiResponse()` | Function | Mock an API endpoint with custom JSON |

### Usage Examples

```ts
import {
  generateRandomRequestData,
  uniqueRequestTitle,
  INVALID_EMAILS,
  EDGE_CASE_TITLES,
} from '../../../utils/requestInitiationData';

// Fully random data
const data = generateRandomRequestData();
await requestPage.contentTitleInput.fill(data.title);
await requestPage.purposeField.fill(data.purpose);

// Partial override (fixed purpose, random rest)
const data = generateRandomRequestData({ purpose: 'Compliance requirement' });

// Unique title from a base stem (for draft/submit tests)
const title = uniqueRequestTitle('SOP Review');  // e.g. "SOP Review xk7p"

// Negative: loop over invalid emails (TC-45..48)
for (const email of INVALID_EMAILS) {
  await requestPage.externalApproverEmail.fill(email);
  await requestPage.clickSubmit();
  await expect(requestPage.externalApproverEmailError).toBeVisible();
}

// Edge-case title inputs (TC-31..42)
await requestPage.contentTitleInput.fill(EDGE_CASE_TITLES.spacesOnly);
await requestPage.contentTitleInput.fill(EDGE_CASE_TITLES.longTitle);
```

---

## 🔐 Auth Flow

The QCMetric app has a **multi-step login flow**:

1. `GET /login` — username + password form
2. `→ /dashboard` (brief redirect)
3. `→ /tenants-selection` — ATPL card is **already expanded** on load
4. Click the **Hyderabad `<p>` element** directly (do NOT click the ATPL toggle — it collapses the card)
5. `→ /dashboard` — main dashboard with module cards

**Navigate to Request Initiation form:**
6. Click **Content Management** card (matched by text, not class)
7. `→ /documents` — Content Dashboard
8. Sidebar → expand **Content** → click **Roles**
9. `→ /documents/roles` — "Document Roles" page
10. Open **"Choose a role..."** dropdown → pick **Request Initiation**
11. Click **"+ Create Request Initiation"** button
12. **"New Request" modal** opens on the same `/documents/roles` URL

> ⚠️ The Request Initiation form opens as a **modal** — the URL never changes to `/request`. Do NOT use `waitForURL('/request')`. Instead wait for `page.getByText('New Request')` to be visible.

### Credentials & Constants

```ts
// From tests/shared/auth.helper.ts
export const TEST_CREDENTIALS = { username: 'testuser', password: 'Password@123' };
export const BASE_URL = 'https://dev-ui.qcmetric.com';
export const TENANT   = { name: 'ATPL', code: 'OP-TESTDEVCOM-001', plant: 'Hyderabad' };
```

---

## 🏗️ Step-by-Step: Adding Tests for a NEW Feature

When a **new CSV file** is added to `test-data/` for a new feature (e.g., "Document Review"), follow these steps **in order**:

### Step 1: Create the POM class

Create `pages/<Feature>Page.ts`:

```ts
import { Page, Locator, expect } from '@playwright/test';
import { BASE_URL } from '../tests/shared/auth.helper';

export class DocumentReviewPage {
  readonly page: Page;
  readonly formHeading: Locator;
  // ... declare all locators as readonly properties

  constructor(page: Page) {
    this.page = page;
    // Match by visible text/placeholder — NOT data-testid (app does not use them)
    this.formHeading = page.getByText('Document Review', { exact: false });
  }

  async waitForFormVisible(): Promise<void> {
    await this.formHeading.waitFor({ state: 'visible', timeout: 15_000 });
  }
}
```

### Step 2: Create the feature helper

Create `tests/<feature>/helpers/auth.helper.ts`:

```ts
import { Page } from '@playwright/test';
export { TEST_CREDENTIALS, RESTRICTED_CREDENTIALS, BASE_URL, TENANT, login, selectTenantAndPlant } from '../../shared/auth.helper';

export async function navigateToDocumentReview(page: Page): Promise<void> {
  // Follow the actual navigation steps specific to this feature
}

export async function loginAndNavigateToDocumentReview(page: Page): Promise<void> {
  const { login } = await import('../../shared/auth.helper');
  await login(page);
  await navigateToDocumentReview(page);
}
```

### Step 3: Create numbered spec files

Create `tests/<feature>/DR-01-05.navigation.spec.ts`:

```ts
import { test, expect, Page } from '@playwright/test';
import { loginAndNavigateToDocumentReview } from './helpers/auth.helper';
import { DocumentReviewPage } from '../../pages/DocumentReviewPage';
import { getTestCase } from '../../utils/csv-helper';

const CSV_FILE = 'QCMetric_DocumentReview_TestCases_AutomationReady.csv';

test.describe('DR-01-05 | Navigation & Access', () => {
  let page: Page;
  let drPage: DocumentReviewPage;

  test.beforeEach(async ({ browser }) => {
    page = await browser.newPage();
    await loginAndNavigateToDocumentReview(page);
    drPage = new DocumentReviewPage(page);
    await drPage.waitForFormVisible();
  });

  test.afterEach(async () => { await page.close(); });

  test('TC-01 | DR-01 — Authorised user can access Document Review page', async () => {
    const tc = getTestCase(CSV_FILE, 'TC-01');
    await drPage.waitForFormVisible();
    // assertions based on tc.expectedResult
  });
});
```

### Step 4: Add npm script

In `package.json`, add:
```json
"test:documentReview": "npx playwright test tests/documentReview/"
```

---

## 📐 Coding Conventions

### TypeScript & Playwright
- Use **TypeScript** for all files
- Import from `@playwright/test` for `test`, `expect`, `Page`, `Locator`
- Use `async/await` for all asynchronous operations
- Prefer `page.getByText()`, `page.locator('button').filter({ hasText: /.../ })` over CSS class selectors (QCMetric UI uses Tailwind utility classes that change)

### Locator Strategy (QCMetric-specific)
- The app **does NOT use `data-testid`** attributes — never write `[data-testid="..."]` locators
- Match inputs by **placeholder text**: `page.locator('input[placeholder*="document title" i]')`
- Match dropdowns by **visible text**: `page.locator('button, [role="combobox"]').filter({ hasText: /Select document type/i })`
- Match read-only fields: first `input[disabled], input[readonly]` in the modal
- Validation feedback is a **single toast banner** — match by `page.getByText(/please enter the mandatory/i)`

### Test File Conventions
- File naming: `RI-NN-NN.feature-area.spec.ts` (range of TC numbers + description)
- Use `test.describe()` to group related tests
- Use `test.beforeEach()` for login and page setup — always via `browser.newPage()`
- Define `const CSV_FILE = '...'` at the top of each spec file
- Reference test case IDs in test titles: `test('TC-07 | RI-07 — Description', ...)`

### POM Class Conventions
- One POM class per major page/feature modal
- Constructor initializes all locators (matched by visible text/placeholder, not CSS class)
- Group methods: Navigation → Dropdown helpers → Form field helpers → Actions → Assertions
- Use `readonly` for locator properties
- **ALL** `page.locator()`, `page.click()`, `page.fill()` calls belong in POM — NEVER in spec files

### Helper Conventions
- Common helpers export **functions** (not classes)
- Feature helpers **re-export** from common helpers and add feature-specific functions
- NEVER define helper functions inside spec files

---

## 📋 Existing Implementation Reference

### Pages (POM)
- `pages/RequestInitiationPage.ts` — `RequestInitiationPage` class: form field locators, dropdown helpers, action buttons, `waitForFormVisible()`, `getSiteIdValue()`, `isSiteIdReadOnly()`, `getContentIdValue()`, `selectContentType()`, `selectDepartment()`, etc.

### Shared Helpers
- `tests/shared/auth.helper.ts` — `login()`, `selectTenantAndPlant()`, `TEST_CREDENTIALS`, `BASE_URL`, `TENANT`

### Feature Helpers
- `tests/requestInitiation/helpers/auth.helper.ts` — Re-exports shared auth + `navigateToRequestInitiation()`, `loginAndNavigateToRequestInitiation()`

### Utilities
- `utils/csv-helper.ts` — `loadTestData()`, `getTestCase()`, `getTestsByScenario()`, `readCsvFile()`, `parseTestDataField()`
- `utils/requestInitiationData.ts` — `generateRandomRequestData()`, `uniqueRequestTitle()`, `RequestInitiationData` interface, `INVALID_EMAILS`, `EDGE_CASE_TITLES`, API intercept helpers

### Test Data (CSV)
- `test-data/QCMetric_RequestInitiation_TestCases_AutomationReady.csv` — 53 test cases (TC-01..TC-53)
- CSV columns: `Req #`, `Test Scenario ID`, `Test Scenario Description`, `Test Case #`, `Test Case Description`, `Pre-Conditions`, `User Role`, `Test Data`, `Navigation Path`, `Test Steps (Automation-Ready)`, `Expected Result`, `Assertion Details`, `Element / Locator Hint`, `API to Wait For`, `Test Type`, `Priority`, `Negative Scenario?`, `Bug / Comments`, `Test Status`

### Test Specs (Request Initiation — TC-01..TC-53)
| File | Test Cases | Description |
|------|-----------|-------------|
| `RI-01-02.access.spec.ts` | TC-01..02 | Access & Navigation |
| `RI-03-06.form-fields.spec.ts` | TC-03..06 | Form Field Auto-population & Dropdowns |
| `RI-07-10.mandatory-validation.spec.ts` | TC-07..10 | Mandatory Field Validation |
| `RI-08-09.filtered-dropdowns.spec.ts` | TC-08..09 | Filtered Role Dropdowns |
| `RI-11.collaboration.spec.ts` | TC-11 | Collaboration Toggle |
| `RI-12-13.change-control.spec.ts` | TC-12..13 | Change Control Behaviour |
| `RI-14-16.draft-submit-history.spec.ts` | TC-14..16 | Draft, Submit & History |
| `RI-17-22.template.spec.ts` | TC-17..22 | Template Behaviour |
| `RI-23-30.external-users.spec.ts` | TC-23..30 | External Reviewer & Approver |
| `RI-31-42.field-validations.spec.ts` | TC-31..42 | Field Validations |
| `RI-43-53.additional-validations.spec.ts` | TC-43..53 | Additional Validations |

---

## 🚫 Common Mistakes to Avoid

| ❌ Mistake | ✅ Correct Approach |
|-----------|-------------------|
| Hardcoding document titles, emails, purposes | Use `generateRandomRequestData()` from `utils/requestInitiationData.ts` |
| Using `[data-testid="..."]` locators | App has no `data-testid` — use text/placeholder/role-based locators |
| Using `page.locator()` in spec files | Add method to `RequestInitiationPage`, call from spec |
| `waitForURL('/request')` after opening form | Form opens as a modal — wait for `getByText('New Request')` instead |
| Clicking ATPL card on tenant-selection | ATPL is already expanded — click Hyderabad `<p>` directly |
| Importing from `tests/shared/auth.helper.ts` in specs | Import from `tests/requestInitiation/helpers/auth.helper.ts` |
| Creating tests without TC IDs | Always include `TC-NN | RI-NN` in test title |
| Duplicating `beforeEach` login logic | Always use `loginAndNavigateToRequestInitiation()` |
| Using fixed titles for form submissions | Use `uniqueRequestTitle()` to avoid duplicate record errors |
| Asserting individual field errors | App shows a single toast — use `page.getByText(/please enter the mandatory/i)` |

---

## 🖥️ Available NPM Scripts

```bash
npm test                         # Run all tests
npm run test:requestInitiation   # Run Request Initiation tests only
npm run test:headed              # Run tests in headed mode
npm run test:report              # Open HTML report
npx playwright test --ui         # Open Playwright UI mode (interactive)
```

---

## 📝 Checklist Before Submitting Code

- [ ] Test data is read from CSV — no hardcoded values
- [ ] All UI interactions are in `RequestInitiationPage` — no raw locators in spec files
- [ ] Helpers are reused — no duplicated login/navigation logic
- [ ] Imports come from `tests/requestInitiation/helpers/auth.helper.ts` — not shared helper directly
- [ ] Test case IDs from CSV are referenced in test titles (`TC-NN | RI-NN`)
- [ ] Form submissions use `generateRandomRequestData()` — no static titles
- [ ] `test.beforeEach()` uses `browser.newPage()` and calls `loginAndNavigateToRequestInitiation()`
- [ ] File follows `RI-NN-NN.feature-area.spec.ts` naming convention
- [ ] No `[data-testid="..."]` locators (app doesn't use them)
- [ ] Modal assertions check heading text, not URL

---

## 📅 Infrastructure Changelog

> This section tracks structural / infra changes to the project. Update it whenever folders, files, or conventions change.

### 2026-03-17

| Change | Detail |
|--------|--------|
| **Added** `tests/requestInitiation/RI-43-53.additional-validations.spec.ts` | New spec file covering TC-43..TC-53 (11 previously missing test cases). All 53 CSV test cases are now covered. |
| **Fixed** `tests/shared/auth.helper.ts` — `selectTenantAndPlant()` | Root cause: ATPL card is already expanded on page load. Clicking it collapsed the tree. Fixed by directly clicking the plant `<p>` element without any ATPL toggle. |
| **Fixed** `tests/requestInitiation/helpers/auth.helper.ts` — `navigateToRequestInitiation()` | Navigation path: Dashboard → Content Management card → `/documents` → Sidebar Roles → "Document Roles" dropdown → pick Request Initiation → click "+ Create Request Initiation" button → "New Request" modal appears. |
| **Fixed** `pages/RequestInitiationPage.ts` — all locators | Replaced all `[data-testid="..."]` locators with text/placeholder/role-based locators. App does not use `data-testid`. Validation errors point to the single toast banner. |
| **Rewritten** `utils/requestInitiationData.ts` | Now follows `somecrudfile.ts` pattern: `RequestInitiationData` interface, `generateRandomRequestData(overrides?)`, `uniqueRequestTitle()`, data pools, `INVALID_EMAILS`, `EDGE_CASE_TITLES`. Removed flat `FORM_DATA` object. |
| **QCMetric UI note** | Request Initiation form is a **modal** on `/documents/roles` — URL never changes to `/request`. Validation is a single top banner: `"Please enter the mandatory fields: Document Type, Department, Document Title, Template, Author, Request Approver"`. Change Control uses a `<select>` dropdown with options Yes/No. Collaboration uses a checkbox labelled "Collaboration required". |
