const { test, expect, users } = require('../fixtures/pages');

test.describe('End-to-end purchase journey', () => {
  test('login, shop, checkout, and return to home', async ({
    page,
    loginPage,
    inventoryPage,
    cartPage,
    checkoutStepOnePage,
    checkoutStepTwoPage,
    checkoutCompletePage,
  }) => {
    await test.step('log in as standard_user', async () => {
      await loginPage.goto();
      await loginPage.login(users.standard.username, users.standard.password);
      await expect(page).toHaveURL(/inventory.html/);
      await expect(inventoryPage.pageTitle).toHaveText('Products');
    });

    await test.step('add products to the cart', async () => {
      await inventoryPage.addItemToCart('Sauce Labs Backpack');
      await inventoryPage.addItemToCart('Sauce Labs Bike Light');
      await expect(inventoryPage.cartBadge).toHaveText('2');
    });

    await test.step('open the cart and review items', async () => {
      await inventoryPage.goToCart();
      await expect(page).toHaveURL(/cart.html/);
      await expect(cartPage.cartItems).toHaveCount(2);
    });

    await test.step('proceed through checkout', async () => {
      await cartPage.checkout();
      await expect(page).toHaveURL(/checkout-step-one.html/);

      await checkoutStepOnePage.fillInfo('John', 'Doe', '12345');
      await checkoutStepOnePage.continueToOverview();
      await expect(page).toHaveURL(/checkout-step-two.html/);
      await expect(checkoutStepTwoPage.cartItems).toHaveCount(2);

      await checkoutStepTwoPage.finish();
      await expect(page).toHaveURL(/checkout-complete.html/);
    });

    await test.step('confirm order and return to home', async () => {
      await expect(checkoutCompletePage.completeHeader).toHaveText('Thank you for your order!');

      await checkoutCompletePage.backToProducts();
      await expect(page).toHaveURL(/inventory.html/);
      await expect(inventoryPage.pageTitle).toHaveText('Products');
    });
  });
});
