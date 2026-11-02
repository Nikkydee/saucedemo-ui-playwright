import { defineConfig, devices } from '@playwright/test';
import os from 'os';
import dotenv from 'dotenv';

/**
 * Load environment variables (e.g. test credentials) from a local .env file.
 * See .env.example for the required keys.
 */
dotenv.config({ quiet: true });

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  testDir: './tests',
  /* Run tests in files in parallel */
  fullyParallel: false,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 1 : 0,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: [
    ['html', { open: 'never' }],
    ['list'],
    ['allure-playwright', {
      detail: true,
      environmentInfo: {
        'Platform': os.platform(),
        'Platform version': os.release(),
        'Node version': process.version,
      }
    }]
  ],
  /* Shared settings for all the projects below. */
  use: {
    /* Collect trace when retrying the failed test. */
    trace: 'on-first-retry',
  },

  projects: [
    {
      name: 'UI Tests',
      testDir: 'tests/Tests/UI',
      use: {
        ...devices['Desktop Chrome'],
        baseURL: 'https://www.saucedemo.com',
        testIdAttribute: 'data-test',
        screenshot: 'only-on-failure',
      },
    },
    {
      name: 'API Tests',
      testDir: 'tests/Tests/API',
      use: {
        baseURL: 'https://restful-booker.herokuapp.com',
        extraHTTPHeaders: {
          'Accept': 'application/json',
        },
      },
    },
  ],
});
