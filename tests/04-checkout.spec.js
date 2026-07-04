const { test, expect } = require('../fixtures/pages');

test.describe('Checkout', () => {
  test.beforeEach(async ({ loggedInPage, inventoryPage, cartPage }) => {
    await inventoryPage.addItemToCart('Sauce Labs Backpack');
    await inventoryPage.addItemToCart('Sauce Labs Bike Light');
    await inventoryPage.goToCart();
    await cartPage.checkout();
  });

  test('requires all fields before continuing', async ({ checkoutStepOnePage }) => {
    await checkoutStepOnePage.continueToOverview();

    await expect(checkoutStepOnePage.errorMessage).toContainText('First Name is required');
  });

  test('completes the full purchase flow', async ({
    loggedInPage,
    checkoutStepOnePage,
    checkoutStepTwoPage,
    checkoutCompletePage,
  }) => {
    await checkoutStepOnePage.fillInfo('John', 'Doe', '12345');
    await checkoutStepOnePage.continueToOverview();

    await expect(loggedInPage).toHaveURL(/checkout-step-two.html/);
    await expect(checkoutStepTwoPage.cartItems).toHaveCount(2);

    const subtotal = await checkoutStepTwoPage.getSubtotal();
    const tax = await checkoutStepTwoPage.getTax();
    const total = await checkoutStepTwoPage.getTotal();
    expect(total).toBeCloseTo(subtotal + tax, 2);

    await checkoutStepTwoPage.finish();

    await expect(loggedInPage).toHaveURL(/checkout-complete.html/);
    await expect(checkoutCompletePage.completeHeader).toHaveText('Thank you for your order!');
  });

  test('can cancel from overview and return to inventory', async ({
    loggedInPage,
    checkoutStepOnePage,
    checkoutStepTwoPage,
  }) => {
    await checkoutStepOnePage.fillInfo('John', 'Doe', '12345');
    await checkoutStepOnePage.continueToOverview();

    await checkoutStepTwoPage.cancelButton.click();
    await expect(loggedInPage).toHaveURL(/inventory.html/);
  });
});
