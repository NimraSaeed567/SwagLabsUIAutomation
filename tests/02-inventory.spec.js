const { test, expect } = require('../fixtures/pages');

test.describe('Inventory', () => {
  test('displays six products', async ({ loggedInPage, inventoryPage }) => {
    await expect(inventoryPage.inventoryItems).toHaveCount(6);
  });

  test('can add and remove a product from the cart', async ({ loggedInPage, inventoryPage }) => {
    const itemName = 'Sauce Labs Backpack';

    await inventoryPage.addItemToCart(itemName);
    await expect(inventoryPage.cartBadge).toHaveText('1');

    await inventoryPage.removeItemFromCart(itemName);
    await expect(inventoryPage.cartBadge).toHaveCount(0);
  });

  test('cart badge reflects multiple added items', async ({ loggedInPage, inventoryPage }) => {
    await inventoryPage.addItemToCart('Sauce Labs Backpack');
    await inventoryPage.addItemToCart('Sauce Labs Bike Light');
    await inventoryPage.addItemToCart('Sauce Labs Bolt T-Shirt');

    await expect(inventoryPage.cartBadge).toHaveText('3');
  });

  test('can sort products by price low to high', async ({ loggedInPage, inventoryPage }) => {
    await inventoryPage.sortBy('lohi');

    const prices = await inventoryPage.getItemPrices();
    const sorted = [...prices].sort((a, b) => a - b);
    expect(prices).toEqual(sorted);
  });

  test('can sort products by name Z to A', async ({ loggedInPage, inventoryPage }) => {
    await inventoryPage.sortBy('za');

    const names = await inventoryPage.getItemNames();
    const sorted = [...names].sort().reverse();
    expect(names).toEqual(sorted);
  });

  test('navigates to cart page', async ({ loggedInPage, inventoryPage }) => {
    await inventoryPage.addItemToCart('Sauce Labs Backpack');
    await inventoryPage.goToCart();

    await expect(loggedInPage).toHaveURL(/cart.html/);
  });
});
