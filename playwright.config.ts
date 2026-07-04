import { defineConfig, devices, type PlaywrightTestOptions } from '@playwright/test';

// Headed runs (see the test:headed / test:e2e npm scripts) set SLOWMO and get
// a maximized, full-size browser window instead of a fixed small viewport.
const slowMo = Number(process.env.SLOWMO) || 0;
const isHeadedRun = slowMo > 0;

// viewport: null can't be combined with a fixed deviceScaleFactor, so drop it too.
function fullSize(devicePreset: Record<string, unknown>) {
  if (!isHeadedRun) return devicePreset;
  const { deviceScaleFactor, ...rest } = devicePreset;
  return { ...rest, viewport: null };
}

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 2 : undefined,
  reporter: [['html', { open: 'never' }], ['list'], ['./reporters/bug-report-reporter.ts']],
  use: {
    baseURL: 'https://www.saucedemo.com',
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    viewport: isHeadedRun ? null : { width: 1280, height: 720 },
    launchOptions: {
      slowMo,
      args: isHeadedRun ? ['--start-maximized'] : [],
    },
  },

  projects: [
    { name: 'chromium', use: { ...fullSize(devices['Desktop Chrome']) } as unknown as PlaywrightTestOptions },
    { name: 'firefox', use: { ...fullSize(devices['Desktop Firefox']) } as unknown as PlaywrightTestOptions },
    { name: 'webkit', use: { ...fullSize(devices['Desktop Safari']) } as unknown as PlaywrightTestOptions },
  ],
});
