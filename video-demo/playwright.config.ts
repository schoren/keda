import { defineConfig, devices } from '@playwright/test';

const TIMEOUT = 120_000;

export default defineConfig({
  testDir: './tests',
  timeout: TIMEOUT,
  workers: 1,
  reporter: 'list',

  use: {
    baseURL: 'http://localhost:8085',
    video: 'on',
    trace: 'off',
    launchOptions: {
      slowMo: 1000,
    }
  },

  projects: [
    {
      name: 'Mobile Safari',
      use: { ...devices['iPhone 13'] },
    },
  ],

  testMatch: 'demo.spec.ts',
});
