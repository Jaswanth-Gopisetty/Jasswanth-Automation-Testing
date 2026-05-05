import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',

  /* ✅ 3 minutes timeout per test */
  timeout: 3 * 60 * 1000,

  /* Run tests sequentially to avoid state conflicts */
  fullyParallel: false,

  /* Fail build if test.only is left */
  forbidOnly: !!process.env.CI,

  /* Retry on CI */
  retries: process.env.CI ? 2 : 0,

  /* Single worker for sequential execution */
  workers: 1,

  /* HTML, JSON & JUnit Reports */
  reporter: [
    ['html'],
    ['json', { outputFile: 'test-results/results.json' }],
    ['junit', { outputFile: 'test-results/junit-results.xml' }],
  ],

  /* Shared settings */
  use: {
    /* ✅ Base URL pointing to the QCMetric dev environment */
    baseURL: 'https://dev-ui.qcmetric.com',

    /* Action timeout: 30 seconds */
    actionTimeout: 30 * 1000,

    /* Navigation timeout: 30 seconds */
    navigationTimeout: 30 * 1000,

    /* Collect trace on first retry */
    trace: 'on-first-retry',

    /* Screenshot & video on failure */
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },

  /* Browser — Chromium only */
  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 1440, height: 900 },
      },
    },
  ],
});
