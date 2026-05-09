import path from 'node:path';
import { defineConfig, devices } from '@playwright/test';
import * as dotenv from 'dotenv';
import { Timeout } from './enums/timeouts';

const envName = process.env.TARGET_ENV || 'local';
const envPath = path.resolve(__dirname, `.env.${envName}`);
dotenv.config({ path: envPath });

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 4 : 1,
  timeout: Timeout.TEST,
  reporter: [['html', { outputFolder: 'playwright-report', open: 'never' }]],
  use: {
    baseURL: process.env.BASE_URL || 'http://localhost:3000',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'mobile-chrome',
      use: { ...devices['Mobile Chrome'] },
    },
  ],
});
