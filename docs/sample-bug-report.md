# Sample bug report (fabricated — not a real, open bug)

This is a fictional example showing what `reporters/bug-report-reporter.js` generates
automatically under `bug-reports/` whenever a real test fails — no manual write-up needed.
It's checked in here purely so the format is visible without running a failing test yourself.
None of the values below correspond to an actual issue in this project or in saucedemo.com.

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
