import { test, expect } from '../fixtures/pages';

test.describe('Logout', () => {
  test('standard user can log out successfully', async ({ page, loggedInPage, logoutPage, loginPage }) => {
    await logoutPage.logout();

    await expect(loginPage.loginButton).toBeVisible();
    await expect(loginPage.usernameInput).toBeVisible();
    await expect(page).not.toHaveURL(/inventory.html/);
  });

  test('session is cleared after logout, direct navigation back to inventory is blocked', async ({
    page,
    loggedInPage,
    logoutPage,
    loginPage,
  }) => {
    await logoutPage.logout();

    await page.goto('/inventory.html');

    await expect(page).not.toHaveURL(/inventory.html/);
    await expect(loginPage.errorMessage).toContainText('you are logged in');
  });
});
