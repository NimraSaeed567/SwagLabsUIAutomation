import { defineConfig, devices, type PlaywrightTestOptions } from '@playwright/test';

// Every local run is headed, maximized, and moderately slowed down so it's
// watchable by default — no flags or env vars to remember. CI stays headless
// and fast. Override the pace with SLOWMO=<ms> if 250 feels off.
const isHeadedRun = !process.env.CI;
const slowMo = Number(process.env.SLOWMO) || (isHeadedRun ? 250 : 0);

// viewport: null (maximize) is Chromium-only — WebKit runs headed fine at a
// normal fixed viewport, so it doesn't need this.
function fullSize(devicePreset: Record<string, unknown>) {
  if (!isHeadedRun) return devicePreset;
  const { deviceScaleFactor, ...rest } = devicePreset;
  return { ...rest, viewport: null };
}

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  // 1 local retry absorbs occasional transient flakes from long sequential
  // headed sessions (observed: WebKit intermittently drops a page/context
  // after ~5+ min of continuous headed use; isolated re-runs always pass).
  retries: process.env.CI ? 2 : 1,
  workers: process.env.CI ? 2 : 1,
  reporter: [['html', { open: 'never' }], ['list'], ['./reporters/bug-report-reporter.ts']],
  use: {
    baseURL: 'https://www.saucedemo.com',
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    headless: !isHeadedRun,
    launchOptions: { slowMo },
  },

  projects: [
    {
      name: 'chromium',
      use: {
        ...fullSize(devices['Desktop Chrome']),
        // --start-maximized is Chromium-only; Firefox/WebKit don't understand it.
        launchOptions: { slowMo, args: isHeadedRun ? ['--start-maximized'] : [] },
      } as unknown as PlaywrightTestOptions,
    },
    {
      name: 'firefox',
      use: {
        ...devices['Desktop Firefox'],
        // Headed Firefox hangs on browserContext.newPage() on this machine
        // (confirmed via a minimal repro outside the test runner — GPU/display
        // driver issue, not a Playwright or project config problem). Firefox
        // always runs headless as a result; Chromium/WebKit stay headed.
        headless: true,
      } as unknown as PlaywrightTestOptions,
    },
    { name: 'webkit', use: { ...devices['Desktop Safari'] } as unknown as PlaywrightTestOptions },
  ],
});
