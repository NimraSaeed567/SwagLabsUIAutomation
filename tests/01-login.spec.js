const { test, expect, users } = require('../fixtures/pages');

test.describe('Login', () => {
  test('standard user can log in successfully', async ({ page, loginPage }) => {
    await loginPage.goto();
    await loginPage.login(users.standard.username, users.standard.password);

    await expect(page).toHaveURL(/inventory.html/);
    await expect(page.locator('.title')).toHaveText('Products');
  });

  test('locked out user sees an error message', async ({ loginPage }) => {
    await loginPage.goto();
    await loginPage.login(users.lockedOut.username, users.lockedOut.password);

    await expect(loginPage.errorMessage).toBeVisible();
    await expect(loginPage.errorMessage).toContainText('locked out');
  });

  test('invalid password shows an error message', async ({ loginPage }) => {
    await loginPage.goto();
    await loginPage.login(users.standard.username, 'wrong_password');

    await expect(loginPage.errorMessage).toContainText('do not match');
  });

  test('empty credentials show a required-field error', async ({ loginPage }) => {
    await loginPage.goto();
    await loginPage.loginButton.click();

    await expect(loginPage.errorMessage).toContainText('Username is required');
  });
});
