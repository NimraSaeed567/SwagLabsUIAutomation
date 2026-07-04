import { test, expect } from '../fixtures/pages';

test.describe('Cart', () => {
  test('shows added items with correct names', async ({ loggedInPage, inventoryPage, cartPage }) => {
    await inventoryPage.addItemToCart('Sauce Labs Backpack');
    await inventoryPage.addItemToCart('Sauce Labs Bike Light');
    await inventoryPage.goToCart();

    await expect(cartPage.cartItems).toHaveCount(2);
    const names = await cartPage.getItemNames();
    expect(names).toEqual(expect.arrayContaining(['Sauce Labs Backpack', 'Sauce Labs Bike Light']));
  });

  test('can remove an item from the cart', async ({ loggedInPage, inventoryPage, cartPage }) => {
    await inventoryPage.addItemToCart('Sauce Labs Backpack');
    await inventoryPage.goToCart();

    await cartPage.removeItem('Sauce Labs Backpack');
    await expect(cartPage.cartItems).toHaveCount(0);
  });

  test('continue shopping returns to inventory page', async ({ loggedInPage, inventoryPage, cartPage }) => {
    await inventoryPage.goToCart();
    await cartPage.continueShoppingButton.click();

    await expect(loggedInPage).toHaveURL(/inventory.html/);
  });

  test('proceeds to checkout', async ({ loggedInPage, inventoryPage, cartPage }) => {
    await inventoryPage.addItemToCart('Sauce Labs Backpack');
    await inventoryPage.goToCart();

    await cartPage.checkout();
    await expect(loggedInPage).toHaveURL(/checkout-step-one.html/);
  });
});
