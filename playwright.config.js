// @ts-check
const { defineConfig, devices } = require('@playwright/test');

// Headed runs (see the test:headed / test:e2e npm scripts) set SLOWMO and get
// a maximized, full-size browser window instead of a fixed small viewport.
const slowMo = Number(process.env.SLOWMO) || 0;
const isHeadedRun = slowMo > 0;

module.exports = defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 2 : undefined,
  reporter: [['html', { open: 'never' }], ['list']],
  use: {
    baseURL: 'https://www.saucedemo.com',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    viewport: isHeadedRun ? null : { width: 1280, height: 720 },
    launchOptions: {
      slowMo,
      args: isHeadedRun ? ['--start-maximized'] : [],
    },
  },

  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
    { name: 'webkit', use: { ...devices['Desktop Safari'] } },
  ],
});
