# Sample bug report (fabricated — not a real, open bug)

This is a fictional example showing what `reporters/bug-report-reporter.ts` generates
automatically under `bug-reports/` whenever a real test fails — no manual write-up needed.
It's checked in here purely so the format is visible without running a failing test yourself.
None of the values below correspond to an actual issue in this project or in saucedemo.com.

## How this gets generated for real

**Prerequisites**
- Dependencies installed: `npm install`
- Playwright browsers installed: `npx playwright test install` (one-time)
- The custom reporter registered in `playwright.config.ts` (already done in this repo —
  see the `reporter: [...]` array, which includes `./reporters/bug-report-reporter.ts`)

**What triggers it**
Any test run that has at least one failing test, via any of:
```
npm test
npm run test:headed
npm run test:e2e
npx playwright test <any-args>
```
Playwright runs the suite as normal; when a test finishes, its `TestResult` (status, error,
steps, attachments) is handed to every registered reporter. `BugReportReporter` collects the
result for every test via `onTestEnd`, and once the whole run finishes, `onEnd` filters for
tests with `status === 'failed' | 'timedOut'`.

**What it does with each failure**
1. Builds a URL-safe filename from the browser project name and test title.
2. Pulls the `test.step()` breadcrumbs to show which steps passed before the failure.
3. Strips ANSI color codes and Playwright's verbose polling "Call log" from the error, keeping
   just the useful assertion summary (locator, expected, received, timeout).
4. Filters out noisy attachments meant for AI-debugging tools (the accessibility-tree
   "error-context" snapshot) and lists the useful ones — screenshot, video, trace.
5. Writes one `.md` file per failure into `bug-reports/`, plus `bug-reports/index.md`
   summarizing every failure in that run.

**Where to find it after a real failing run**
`bug-reports/` at the project root (gitignored — wiped and rebuilt every run, so it only ever
reflects the *last* run, never stale data from an earlier one). Hand the relevant `.md` file
straight to a developer, or open the linked trace with `npx playwright show-trace <path>`.

---

# [example] cart badge count updates after adding an item

Browser: chromium | Status: FAILED | Detected: 2026-01-01T00:00:00.000Z

## Steps
ok — log in as standard_user
ok — add "Sauce Labs Backpack" to the cart
FAILED — assert the cart badge shows "1"

## What went wrong
```
Error: expect(locator).toHaveText(expected) failed

Locator:  locator('.shopping_cart_badge')
Expected: "1"
Received: "0"
Timeout:  5000ms
```

## Reproduce
```
npx playwright test -g "cart badge count updates after adding an item" --project=chromium
```

## Evidence
- screenshot: `test-results/.../test-failed-1.png`
- video: `test-results/.../video.webm`
- trace: `test-results/.../trace.zip`
